import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { generateInvoice } from "../lib/invoice"
import { sendOrderConfirmationWhatsApp, sendBookingConfirmationWhatsApp, sendCourseConfirmationWhatsApp } from "../lib/interakt"

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
        "items.variant.metadata",
        "items.variant.product.*",
        "items.variant.product.metadata",
        "items.variant.product.hs_code",
        "items.adjustments.*",
        "items.tax_lines.*",
        "shipping_address.*", 
        "billing_address.*", 
        "payment_collections.payments.*",
        "shipping_methods.*",
        "shipping_methods.adjustments.*",
        "shipping_methods.tax_lines.*",
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

    console.log(`[Order Processing] Order #${order.display_id} (${data.id}) for ${order.email} — ${order.items?.length ?? 0} item(s)`)

    // 2. Generate PDF using pdfkit
    let pdfBuffer: Buffer
    let pdfBase64: string
    try {
      const pdfStart = Date.now()
      pdfBuffer = await generateInvoice(order)
      pdfBase64 = pdfBuffer.toString("base64")
      console.log(`[Order Processing] PDF generated for #${order.display_id} in ${Date.now() - pdfStart}ms (${Math.round(pdfBuffer.length / 1024)}KB)`)
    } catch (pdfErr: any) {
      console.error(`[Order Processing] PDF generation failed for #${order.display_id}:`, pdfErr.message)
      pdfBase64 = ""
    }

    // 3. Send Notification with Attachment
    const storefrontUrl = process.env.STOREFRONT_URL || 'http://localhost:8001'
    
    const items = order.items || []
  
    // Robust computation of totals
    const rawItemsSubtotal = items.reduce((sum: number, item: any) => sum + ((item.unit_price || 0) * (item.quantity || 0)), 0)
    const shippingGross = (order.shipping_methods || []).reduce((sum: number, sm: any) => sum + (sm.amount ?? 0), 0)
    // Scale item discounts to tax-inclusive using each item's GST rate
    const itemDiscounts = items.reduce((sum: number, item: any) => {
      const adjPreTax = (item.adjustments || []).reduce((s: number, a: any) => s + (a.amount ?? 0), 0)
      const gstRate = (item.tax_lines || []).reduce((s: number, t: any) => s + (t.rate ?? 0), 0)
      return sum + Math.min((item.unit_price || 0) * (item.quantity || 1), adjPreTax * (1 + gstRate / 100))
    }, 0)
    // Scale shipping discount to tax-inclusive using shipping GST rate
    const shippingTaxRate = (order.shipping_methods || []).reduce((maxRate: number, sm: any) =>
      Math.max(maxRate, (sm.tax_lines || []).reduce((s: number, t: any) => s + (t.rate ?? 0), 0)), 0)
    const shippingAdjPreTax = (order.shipping_methods || []).reduce((sum: number, sm: any) =>
      sum + (sm.adjustments || []).reduce((s: number, a: any) => s + (a.amount ?? 0), 0), 0)
    const shippingDiscounts = shippingAdjPreTax * (1 + shippingTaxRate / 100)
    const discountTotal = itemDiscounts + shippingDiscounts
    const subtotal = order.subtotal || rawItemsSubtotal
    const calculatedTotal = order.total || (subtotal + shippingGross - discountTotal)

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

    // Support for session-specific details
    const bookingDate = order.metadata?.booking_date
    const bookingTime = order.metadata?.booking_time
    const calMeetUrl = order.metadata?.cal_meet_url
    const isSession = order.metadata?.is_session === true || order.metadata?.is_session === "true"
    
    // Check if any purchased item is a course by looking for drive_folder_id
    let driveFolderId = order.metadata?.drive_folder_id as string | undefined
    for (const item of items) {
      const folderId = item.variant?.product?.metadata?.drive_folder_id
      if (folderId) {
        driveFolderId = folderId
        break
      }
    }

    // Share Google Drive folder if a course was purchased and it hasn't been shared yet
    if (driveFolderId && order.email) {
      try {
        const { shareDriveFolder } = require("../lib/google-drive")
        await shareDriveFolder(driveFolderId, order.email)
      } catch (err: any) {
        console.error(`[Order Processing] Failed to share Google Drive folder for #${order.display_id}:`, err.message)
      }
    }

    const sessionDetailsHtml = isSession ? `
      <div style="background: #F9F7F9; padding: 25px; border-left: 4px solid #C5A059; border-radius: 4px; margin: 25px 0;">
        <p style="margin: 0 0 10px 0; font-weight: bold; color: #2C1E36;">🗓️ Session Appointment:</p>
        <p style="margin: 0; font-size: 18px; color: #2C1E36;">${bookingDate} at ${bookingTime}</p>
        ${calMeetUrl ? `
          <div style="margin-top: 20px; text-align: center; background: #2C1E36; padding: 20px; border-radius: 12px; border: 1px solid #C5A059;">
            <p style="margin-top: 0; color: #C5A059; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Your Meeting Link</p>
            <a href="${calMeetUrl}" style="background: #C5A059; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 15px; margin: 5px 0;">Join Live Session</a>
          </div>
        ` : ""}
      </div>
    ` : ""

    const courseDetailsHtml = driveFolderId ? `
      <div style="background: #F9F7F9; padding: 25px; border-left: 4px solid #7C3AED; border-radius: 4px; margin: 25px 0;">
        <p style="margin: 0 0 10px 0; font-weight: bold; color: #2C1E36;">📚 Your Course Access:</p>
        <p style="margin: 0 0 15px 0; font-size: 14px; color: #665D6B; line-height: 1.5;">You now have access to your course materials. You should also receive a separate email directly from Google Drive confirming your access.</p>
        <div style="text-align: center;">
          <a href="https://drive.google.com/drive/folders/${driveFolderId}" style="background: #7C3AED; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 15px;">Access Course Materials</a>
        </div>
      </div>
    ` : ""

    if (notificationService) {
      const commonBodyPrefix = `
      <div style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; background-color: #FBFAF8; padding: 40px 30px; color: #110E17; max-width: 620px; margin: 0 auto; border: 1px solid #E1DFE3; border-radius: 24px;">

        <!-- ═══ HEADER ═══ -->
        <div style="text-align: center; margin-bottom: 35px;">
          <h1 style="font-family: Georgia, serif; font-size: 20px; color: #2C1E36; margin: 0 0 4px; font-weight: 700; letter-spacing: 0.05em;">The Blissful Soul</h1>
          <p style="text-transform: uppercase; font-size: 9px; letter-spacing: 0.4em; color: #C5A059; margin: 0;">Healing &amp; Crystals</p>
        </div>`

      const commonBodySuffix = `
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
              <td style="font-size: 14px; color: #2C1E36; text-align: right; padding: 5px 0; font-weight: 500;">₹${shippingGross.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
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

      </div>`

      const clientHtmlBody = isSession ? `
        ${commonBodyPrefix}
        <!-- ═══ SESSION TITLE ═══ -->
        <h2 style="font-size: 26px; font-weight: 800; color: #2C1E36; margin: 0 0 10px;">Session Booked: #${order.display_id}</h2>
        <p style="font-size: 15px; line-height: 1.5; color: #665D6B; margin: 0 0 30px;">
          Hi ${order.shipping_address?.first_name || 'Customer'}, your session has been confirmed! We look forward to connecting with you.
        </p>
        ${sessionDetailsHtml}
        ${commonBodySuffix.replace(
          'Your GST invoice is attached to this email.<br/>\n            May the energy of these crystals find you well.',
          'Your invoice is attached to this email.<br/>\n            We look forward to your healing journey.'
        )}
      ` : `
        ${commonBodyPrefix}
        <!-- ═══ CLIENT ORDER TITLE ═══ -->
        <h2 style="font-size: 26px; font-weight: 800; color: #2C1E36; margin: 0 0 10px;">Order Confirmed: #${order.display_id}</h2>
        <p style="font-size: 15px; line-height: 1.5; color: #665D6B; margin: 0 0 30px;">
          Hi ${order.shipping_address?.first_name || 'Customer'}, We have received your order. ${driveFolderId ? 'Your digital course access is provided below.' : 'It shall be energised and dispatched soon.'}
        </p>
        ${sessionDetailsHtml}
        ${courseDetailsHtml}
        ${commonBodySuffix}
      `

      const adminHtmlBody = `
        ${commonBodyPrefix}
        <!-- ═══ ADMIN ORDER TITLE ═══ -->
        <h2 style="font-size: 26px; font-weight: 800; color: #2C1E36; margin: 0 0 10px;">${isSession ? 'New Session Booking' : 'New order'}: #${order.display_id}</h2>
        <p style="font-size: 15px; line-height: 1.5; color: #665D6B; margin: 0 0 30px;">
          You've received a new ${isSession ? 'session booking' : 'order'} from ${customerName}:
        </p>
        ${sessionDetailsHtml}
        ${courseDetailsHtml}
        ${commonBodySuffix}
      `

      const adminEmails = [...new Set([
        process.env.ADMIN_NOTIFICATION_EMAIL,
        process.env.GOOGLE_SMTP_USER,
      ].filter(Boolean) as string[])]

      const emailStart = Date.now()
      try {
        await (notificationService as any).createNotifications([
          {
            to: order.email,
            channel: "email",
            template: "order-placed",
            data: {
              subject: isSession ? `Session Booked: #${order.display_id} - The Blissful Soul` : `Order Confirmed: #${order.display_id} - The Blissful Soul`,
              html_body: clientHtmlBody,
              pdf_attachments: pdfBase64 ? [
                {
                  content: pdfBase64,
                  encoding: "base64",
                  filename: `invoice_${order.display_id}.pdf`,
                  contentType: "application/pdf",
                },
              ] : [],
            },
          },
          ...adminEmails.map((adminEmail) => ({
            to: adminEmail,
            channel: "email",
            template: "order-placed-admin",
            data: {
              subject: isSession ? `New Session Booking: #${order.display_id} from ${customerName}` : `New order: #${order.display_id} from ${customerName}`,
              html_body: adminHtmlBody,
            },
          })),
        ])
        console.log(`[Order Processing] Emails queued for #${order.display_id} in ${Date.now() - emailStart}ms — client: ${order.email} | admins: ${adminEmails.join(", ")}`)
      } catch (emailErr: any) {
        console.error(`[Order Processing] Email notification failed for #${order.display_id}:`, emailErr.message)
      }

      // Send WhatsApp confirmation (non-blocking)
      const phone = (isSession ? items[0]?.metadata?.patient_phone : null) || order.shipping_address?.phone || ""
      if (phone) {
        const firstName = order.shipping_address?.first_name || "Customer"
        const countryCode = order.shipping_address?.country_code || "in"
        const orderId = order.display_id || order.id

        if (isSession && bookingDate && bookingTime) {
          // Session/service booking → booking_confirmation template (date + time)
          sendBookingConfirmationWhatsApp({
            phone, countryCode, firstName, orderId,
            serviceTitle: items[0]?.title,
            bookingDate,
            bookingTime,
            amount: calculatedTotal,
            calMeetUrl: calMeetUrl || undefined,
          }).catch((err: Error) => console.error(`[WhatsApp] Booking confirmation failed for #${order.display_id}:`, err.message))
        } else if (driveFolderId) {
          // Course purchase → course_confirmation template (drive link)
          sendCourseConfirmationWhatsApp({
            phone, countryCode, firstName, orderId,
            driveLink: `https://drive.google.com/drive/folders/${driveFolderId}`,
          }).catch((err: Error) => console.error(`[WhatsApp] Course confirmation failed for #${order.display_id}:`, err.message))
        } else {
          // Regular product order → order_confirmation template (order date only)
          const itemTitles = items.map((i: any) => i.title).join(", ")
          sendOrderConfirmationWhatsApp({
            phone, countryCode, firstName, orderId,
            productTitle: itemTitles,
            orderDate,
            amount: calculatedTotal,
          }).catch((err: Error) => console.error(`[WhatsApp] Order confirmation failed for #${order.display_id}:`, err.message))
        }
      }
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
