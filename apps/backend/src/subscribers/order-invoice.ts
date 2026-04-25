import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { generateInvoice } from "../lib/invoice"

export default async function orderInvoiceHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const query = container.resolve("query")
  const notificationService = container.resolve("notification")

  try {
    // 1. Fetch full order details with calculated totals
    const { data: orders } = await (query as any).graph({
      entity: "order",
      fields: [
        "*", 
        "items.*",
        "items.variant.*",
        "items.variant.product.hs_code",
        "items.adjustments.*",
        "items.tax_lines.*",
        "shipping_address.*", 
        "billing_address.*", 
        "payment_collections.payments.*",
        "shipping_methods.*",
        "shipping_methods.adjustments.*",
        "+total",
        "+subtotal",
        "+shipping_total",
        "+tax_total",
        "+discount_total"
      ],
      filters: { id: data.id },
    })

    const order = orders?.[0]

    if (!order) {
      console.error(`[Order Processing] Order #${data.id} not found in database.`);
      return;
    }

    // 2. Generate PDF using pdfkit
    const pdfBuffer = await generateInvoice(order);
    const pdfBase64 = pdfBuffer.toString("base64");

    // 3. Send Notification with Attachment
    const storefrontUrl = process.env.STOREFRONT_URL || 'http://localhost:8001'
    
    const items = order.items || []
  
    // Robust computation of totals
    const rawItemsSubtotal = items.reduce((sum: number, item: any) => sum + ((item.unit_price || 0) * (item.quantity || 0)), 0)
    const shippingTotal = order.shipping_total ?? (order.shipping_methods || []).reduce((sum: number, sm: any) => sum + (sm.amount ?? 0), 0)
    const itemDiscounts = items.reduce((sum: number, item: any) => sum + (item.adjustments || []).reduce((s: number, a: any) => s + (a.amount ?? 0), 0), 0)
    const shippingDiscounts = (order.shipping_methods || []).reduce((sum: number, sm: any) => sum + (sm.adjustments || []).reduce((s: number, a: any) => s + (a.amount ?? 0), 0), 0)
    const discountTotal = order.discount_total || (itemDiscounts + shippingDiscounts)
    const taxTotal = order.tax_total || 0
    const subtotal = order.subtotal || rawItemsSubtotal
    const calculatedTotal = order.total || (subtotal + shippingTotal - discountTotal + taxTotal)

    const customerName = `${order.shipping_address?.first_name || ''} ${order.shipping_address?.last_name || ''}`.trim() || 'Valued Customer'
    const orderDate = new Date(order.created_at).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })
    const shippingMethodName = order.shipping_methods?.[0]?.name || 'Shipping'
    const paymentMethod = order.payment_collections?.[0]?.payments?.[0]?.provider_id
      ? order.payment_collections[0].payments[0].provider_id.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
      : 'Credit Card/Debit Card/NetBanking'

    // Build item rows HTML
    const itemRowsHtml = items.map((item: any) => {
      const isFree = (item.unit_price || 0) === 0
      const taxRate = (item.tax_lines || []).reduce((sum: number, t: any) => sum + (t.rate ?? 0), 0)
      const taxLabel = taxRate > 0 ? `${taxRate}% GST Included` : 'GST Included'
      const lineTotal = (item.unit_price || 0) * (item.quantity || 1)

      return `
        <tr>
          <td style="padding: 18px 0; vertical-align: top; border-bottom: 1px solid #F0EDE8;">
            <div style="font-size: 14px; font-weight: 600; color: #2C1E36; margin-bottom: 4px;">${item.title}</div>
            <div style="font-size: 11px; color: #9B949F;">${taxLabel}</div>
            ${isFree ? '<div style="font-size: 11px; color: #C5A059; margin-top: 2px;">Type: Free Product</div>' : ''}
          </td>
          <td style="padding: 18px 10px; vertical-align: top; border-bottom: 1px solid #F0EDE8; text-align: center; color: #665D6B; font-size: 14px;">×${item.quantity}</td>
          <td style="padding: 18px 0; vertical-align: top; border-bottom: 1px solid #F0EDE8; text-align: right; font-size: 14px; font-weight: 600; color: #2C1E36; white-space: nowrap;">₹${lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>`
    }).join('')

    // Build address block helper
    const buildAddress = (addr: any) => {
      if (!addr) return '<span style="color: #9B949F;">N/A</span>'
      const name = `${addr.first_name || ''} ${addr.last_name || ''}`.trim()
      const lines = [
        name,
        addr.address_1,
        addr.address_2,
        `${addr.city || ''} ${addr.postal_code || ''}`.trim(),
        addr.province,
      ].filter(Boolean)
      return lines.map(l => `<span style="display: block; font-size: 13px; color: #665D6B; line-height: 1.6;">${l}</span>`).join('')
    }

    const billingAddr = order.billing_address || order.shipping_address
    const shippingAddr = order.shipping_address

    if (notificationService) {
      await (notificationService as any).createNotifications([
        {
          to: order.email,
          channel: "email",
          template: "order-placed",
          data: {
            subject: `Order Confirmed: #${order.display_id} - The Blissful Soul`,
            html_body: `
      <div style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; background-color: #FBFAF8; padding: 40px 30px; color: #110E17; max-width: 620px; margin: 0 auto; border: 1px solid #E1DFE3; border-radius: 24px;">

        <!-- ═══ HEADER ═══ -->
        <div style="text-align: center; margin-bottom: 35px;">
          <div style="width: 56px; height: 56px; margin: 0 auto 16px; background: #2C1E36; transform: rotate(45deg); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
            <span style="color: #C5A059; font-weight: 800; font-size: 14px; transform: rotate(-45deg); display: block;">TBS</span>
          </div>
          <h1 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 14px; color: #2C1E36; margin: 0; font-weight: 700; letter-spacing: 0.05em;">The Blissful Soul</h1>
          <p style="text-transform: uppercase; font-size: 9px; letter-spacing: 0.4em; color: #C5A059; margin: 4px 0 0;">Healing &amp; Crystals</p>
        </div>

        <!-- ═══ ORDER TITLE ═══ -->
        <h2 style="font-size: 26px; font-weight: 800; color: #2C1E36; margin: 0 0 10px;">New order: #${order.display_id}</h2>
        <p style="font-size: 15px; line-height: 1.5; color: #665D6B; margin: 0 0 30px;">
          You've received a new order from ${customerName}:
        </p>

        <!-- ═══ ORDER SUMMARY ═══ -->
        <div style="margin-bottom: 30px;">
          <h3 style="font-size: 18px; font-weight: 700; color: #2C1E36; margin: 0 0 6px;">Order summary</h3>
          <a href="${storefrontUrl}/order/lookup?display_id=${order.display_id}&email=${order.email}" style="font-size: 13px; color: #7C3AED; text-decoration: none; font-weight: 500;">Order #${order.display_id}</a>
          <span style="font-size: 13px; color: #9B949F; margin-left: 4px;">(${orderDate})</span>
        </div>

        <!-- ═══ ITEMS TABLE ═══ -->
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 10px;">
          <tbody>
            ${itemRowsHtml}
          </tbody>
        </table>

        <!-- ═══ TOTALS ═══ -->
        <div style="border-top: 2px solid #E1DFE3; padding-top: 20px; margin-bottom: 10px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
            <tr>
              <td style="font-size: 14px; color: #665D6B; padding: 5px 0;">Subtotal:</td>
              <td style="font-size: 14px; color: #2C1E36; text-align: right; padding: 5px 0; font-weight: 500;">₹${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td style="font-size: 14px; color: #665D6B; padding: 5px 0;">Shipping: ${shippingMethodName}</td>
              <td style="font-size: 14px; color: #2C1E36; text-align: right; padding: 5px 0; font-weight: 500;">₹${shippingTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
            ${discountTotal > 0 ? `
            <tr>
              <td style="font-size: 14px; color: #C5A059; padding: 5px 0;">Discount Applied:</td>
              <td style="font-size: 14px; color: #C5A059; text-align: right; padding: 5px 0; font-weight: 600;">-₹${discountTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>` : ''}
            <tr>
              <td style="font-size: 16px; color: #2C1E36; padding: 14px 0 5px; font-weight: 800; border-top: 1px solid #2C1E36;">Total:</td>
              <td style="font-size: 20px; color: #2C1E36; text-align: right; padding: 14px 0 5px; font-weight: 800; border-top: 1px solid #2C1E36;">₹${calculatedTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td style="font-size: 13px; color: #665D6B; padding: 5px 0;">Payment method:</td>
              <td style="font-size: 13px; color: #2C1E36; text-align: right; padding: 5px 0;">${paymentMethod}</td>
            </tr>
          </table>
        </div>

        <!-- ═══ DOWNLOAD INVOICE BUTTON ═══ -->
        <div style="margin: 28px 0;">
          <a href="${storefrontUrl}/order/lookup?display_id=${order.display_id}&email=${order.email}" style="display: inline-block; background: #2C1E36; color: #C5A059; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 13px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; box-shadow: 0 4px 15px rgba(44,30,54,0.25);">Download GST Invoice</a>
        </div>

        <!-- ═══ BILLING + SHIPPING ADDRESS ═══ -->
        <div style="border-top: 1px solid #E1DFE3; padding-top: 25px; margin-bottom: 25px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
            <tr>
              <td style="width: 50%; vertical-align: top; padding-right: 15px;">
                <p style="font-size: 14px; font-weight: 700; color: #2C1E36; margin: 0 0 10px;">Billing address</p>
                ${buildAddress(billingAddr)}
                ${billingAddr?.phone ? `<a href="tel:${billingAddr.phone}" style="display: block; font-size: 13px; color: #7C3AED; text-decoration: none; margin-top: 4px;">${billingAddr.phone}</a>` : ''}
                ${order.email ? `<a href="mailto:${order.email}" style="display: block; font-size: 13px; color: #7C3AED; text-decoration: none; margin-top: 2px;">${order.email}</a>` : ''}
              </td>
              <td style="width: 50%; vertical-align: top; padding-left: 15px;">
                <p style="font-size: 14px; font-weight: 700; color: #2C1E36; margin: 0 0 10px;">Shipping address</p>
                ${buildAddress(shippingAddr)}
                ${shippingAddr?.phone ? `<span style="display: block; font-size: 13px; color: #665D6B; margin-top: 4px;">${shippingAddr.phone}</span>` : ''}
              </td>
            </tr>
          </table>
        </div>

        <!-- ═══ FOOTER ═══ -->
        <div style="border-top: 1px solid #E1DFE3; padding-top: 25px; text-align: center;">
          <p style="font-size: 13px; color: #9B949F; margin: 0 0 8px;">
            Your GST invoice is attached to this email.<br/>
            May the energy of these crystals find you well.
          </p>
          <p style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 18px; font-style: italic; color: #2C1E36; margin: 18px 0 4px;">Stay Blissful,</p>
          <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.3em; color: #C5A059; margin: 0;">The Blissful Soul Team</p>
        </div>

      </div>
            `,
            pdf_attachments: [
              {
                content: pdfBase64,
                encoding: "base64",
                filename: `invoice_${order.display_id}.pdf`,
                contentType: "application/pdf",
              },
            ],
          },
        }
      ]);
      console.log(`[Order Processing] Local PDF Invoice generated and email queued for Order #${order.display_id}`);
    } else {
      console.warn("[Order Processing] Notification service not found. Skipping email.");
    }
  } catch (error: any) {
    console.error(`[Order Processing] Error in orderInvoiceHandler for Order #${data.id}:`, error.message || error);
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
