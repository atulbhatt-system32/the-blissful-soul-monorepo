import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { generateInvoice } from "../../../lib/invoice"

type ItemPayload = {
  title: string
  variant_id?: string
  quantity: number
  unit_price: number
  metadata?: any
}

type BookingOrderPayload = {
  variantId: string
  serviceTitle?: string
  email: string
  firstName: string
  lastName: string
  phone: string
  countryCode: string
  razorpayPaymentId: string
  bookingDate: string
  bookingTime: string
  price: number
  calBookingId?: string | null
  calMeetUrl?: string
  eventSlug: string
  isPackage?: boolean
  hasSession?: boolean
  items?: ItemPayload[]
  shippingAddress?: {
    address1: string
    city: string
    state: string
    postalCode: string
  }
}

async function sendConfirmationEmail({
  notificationService,
  email,
  firstName,
  lastName,
  phone,
  serviceTitle,
  bookingDate,
  bookingTime,
  price,
  razorpayPaymentId,
  calMeetUrl,
  isPackage,
  orderId,
  pdfBase64,
  hamperGiftTitle,
  items,
  hasSession,
}: {
  notificationService: any
  email: string
  firstName: string
  lastName: string
  phone: string
  serviceTitle?: string
  bookingDate: string
  bookingTime: string
  price: number
  razorpayPaymentId: string
  calMeetUrl?: string
  isPackage?: boolean
  orderId: string | number
  pdfBase64: string | null
  hamperGiftTitle?: string | null
  items?: ItemPayload[]
  hasSession?: boolean
}) {
  const pdfAttachments = pdfBase64
    ? [{ content: pdfBase64, encoding: "base64", filename: `invoice_${orderId}.pdf`, contentType: "application/pdf" }]
    : []

  const displayItems = items?.length ? items : [
    {
      title: serviceTitle || "Session Booking",
      quantity: 1,
      unit_price: price,
      metadata: { booking_date: bookingDate, booking_time: bookingTime }
    }
  ]

  const subtotal = displayItems.reduce((acc, item) => acc + (item.unit_price * item.quantity), 0)
  
  // Calculate shipping if there are physical items
  const hasPhysicalItems = displayItems.some(item => !item.metadata?.is_booking && !item.metadata?.booking_date)
  const shippingTotal = hasPhysicalItems ? 99 : 0
  const grandTotal = subtotal + shippingTotal

  const orderDate = new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })
  
  const itemRowsHtml = displayItems.map((item: any) => {
    const isSession = !!item.metadata?.booking_date || !!item.metadata?.is_booking
    return `
      <tr>
        <td style="padding: 18px 0; vertical-align: top; border-bottom: 1px solid #F0EDE8;">
          <div style="font-size: 14px; font-weight: 600; color: #2C1E36; margin-bottom: 4px;">${item.title}</div>
          ${isSession && item.metadata?.booking_date ? `<div style="font-size: 11px; color: #9B949F;">${item.metadata.booking_date} at ${item.metadata.booking_time || ''}</div>` : ''}
          <div style="font-size: 11px; color: #9B949F;">3% GST Included</div>
        </td>
        <td style="padding: 18px 10px; vertical-align: top; border-bottom: 1px solid #F0EDE8; text-align: center; color: #665D6B; font-size: 14px;">×${item.quantity}</td>
        <td style="padding: 18px 0; vertical-align: top; border-bottom: 1px solid #F0EDE8; text-align: right; font-size: 14px; font-weight: 600; color: #2C1E36; white-space: nowrap;">₹${(item.unit_price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      </tr>`
  }).join('')

  const sessionDetailsHtml = hasSession ? `
    <div style="background: #F9F7F9; padding: 25px; border-left: 4px solid #C5A059; border-radius: 4px; margin: 25px 0;">
      <p style="margin: 0 0 10px 0; font-weight: bold; color: #2C1E36;">🗓️ Session Appointment:</p>
      <p style="margin: 0; font-size: 18px; color: #2C1E36;">${bookingDate} at ${bookingTime}</p>
      ${calMeetUrl ? `
        <div style="margin-top: 20px; text-align: center; background: #2C1E36; padding: 20px; border-radius: 12px; border: 1px solid #C5A059;">
          <p style="margin-top: 0; color: #C5A059; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Your Meeting Link</p>
          <a href="${calMeetUrl}" style="background: #C5A059; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 15px; margin: 5px 0;">Join Live Session</a>
        </div>
      ` : isPackage ? "" : `
        <p style="margin-top: 15px; font-size: 12px; color: #665D6B;">Note: Your meeting link will be sent separately before the session.</p>
      `}
    </div>
  ` : ""

  const commonBodyPrefix = `
    <div style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; background-color: #FBFAF8; padding: 40px 30px; color: #110E17; max-width: 620px; margin: 0 auto; border: 1px solid #E1DFE3; border-radius: 24px;">
      <div style="text-align: center; margin-bottom: 35px;">
        <h1 style="font-family: Georgia, serif; font-size: 20px; color: #2C1E36; margin: 0 0 4px; font-weight: 700; letter-spacing: 0.05em;">The Blissful Soul</h1>
        <p style="text-transform: uppercase; font-size: 9px; letter-spacing: 0.4em; color: #C5A059; margin: 0;">Healing &amp; Crystals</p>
      </div>`

  const commonBodySuffix = `
      <div style="margin-bottom: 30px;">
        <h3 style="font-size: 18px; font-weight: 700; color: #2C1E36; margin: 0 0 6px;">Order summary</h3>
        <span style="font-size: 13px; color: #C5A059; font-weight: bold;">Order #${orderId}</span>
        <span style="font-size: 13px; color: #9B949F; margin-left: 4px;">(${orderDate})</span>
      </div>

      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 10px;">
        <tbody>
          ${itemRowsHtml}
        </tbody>
      </table>

      <div style="border-top: 2px solid #E1DFE3; padding-top: 20px; margin-bottom: 10px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
          <tr>
            <td style="font-size: 14px; color: #665D6B; padding: 5px 0;">Subtotal:</td>
            <td style="font-size: 14px; color: #2C1E36; text-align: right; padding: 5px 0; font-weight: 500;">₹${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>
          ${shippingTotal > 0 ? `
          <tr>
            <td style="font-size: 14px; color: #665D6B; padding: 5px 0;">Shipping: Standard Delivery</td>
            <td style="font-size: 14px; color: #2C1E36; text-align: right; padding: 5px 0; font-weight: 500;">₹${shippingTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="font-size: 16px; color: #2C1E36; padding: 14px 0 5px; font-weight: 800; border-top: 1px solid #2C1E36;">Total:</td>
            <td style="font-size: 20px; color: #2C1E36; text-align: right; padding: 14px 0 5px; font-weight: 800; border-top: 1px solid #2C1E36;">₹${grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td style="font-size: 13px; color: #665D6B; padding: 5px 0;">Payment method:</td>
            <td style="font-size: 13px; color: #2C1E36; text-align: right; padding: 5px 0;">Razorpay (${razorpayPaymentId})</td>
          </tr>
        </table>
      </div>

      <div style="border-top: 1px solid #E1DFE3; padding-top: 25px; margin-bottom: 25px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
          <tr>
            <td style="width: 100%; vertical-align: top;">
              <p style="font-size: 14px; font-weight: 700; color: #2C1E36; margin: 0 0 10px;">Customer details</p>
              <span style="display: block; font-size: 13px; color: #665D6B; line-height: 1.6;">${firstName} ${lastName}</span>
              <span style="display: block; font-size: 13px; color: #665D6B; line-height: 1.6;">${phone}</span>
              <span style="display: block; font-size: 13px; color: #665D6B; line-height: 1.6;">${email}</span>
            </td>
          </tr>
        </table>
      </div>

      <div style="border-top: 1px solid #E1DFE3; padding-top: 25px; text-align: center;">
        <p style="font-size: 13px; color: #9B949F; margin: 0 0 8px;">
          Your GST invoice is attached to this email.<br/>
          May the energy of these crystals find you well.
        </p>
        <p style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 18px; font-style: italic; color: #2C1E36; margin: 18px 0 4px;">Stay Blissful,</p>
        <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.3em; color: #C5A059; margin: 0;">The Blissful Soul Team</p>
      </div>
    </div>`

  const hamperHtml = hamperGiftTitle ? `
    <div style="margin: 20px 0; text-align: center; background: linear-gradient(135deg, #2C1E36, #4a2d5e); padding: 25px; border-radius: 12px; border: 1px solid #C5A059;">
      <p style="margin: 0 0 6px; color: #C5A059; font-weight: bold; font-size: 18px;">🎁 You've earned a Free Gift!</p>
      <p style="margin: 0; color: #fff; font-size: 14px;">${hamperGiftTitle}</p>
      <p style="margin: 8px 0 0; color: rgba(255,255,255,0.6); font-size: 11px;">This complimentary hamper will be shipped to you separately.</p>
    </div>
  ` : ""

  const notifications: any[] = [
    {
      to: email,
      channel: "email",
      template: "booking-confirmed",
      data: {
        subject: `Order Confirmed: #${orderId}`,
        html_body: `
          ${commonBodyPrefix}
          <h2 style="font-size: 26px; font-weight: 800; color: #2C1E36; margin: 0 0 10px;">Order Confirmed: #${orderId}</h2>
          <p style="font-size: 15px; line-height: 1.5; color: #665D6B; margin: 0 0 30px;">
            Hi ${firstName}, We have received your order. It shall be energised and dispatched soon.
          </p>
          ${sessionDetailsHtml}
          ${hamperHtml}
          ${commonBodySuffix}
        `,
        pdf_attachments: pdfAttachments,
      },
    },
  ]

  const adminEmails = [...new Set([
    process.env.ADMIN_NOTIFICATION_EMAIL,
    process.env.GOOGLE_SMTP_USER,
  ].filter(Boolean) as string[])]

  for (const adminEmail of adminEmails) {
    notifications.push({
      to: adminEmail,
      channel: "email",
      template: "booking-admin-notification",
      data: {
        subject: `NEW ${hasSession ? 'BOOKING' : 'ORDER'}: ${firstName} | #${orderId}`,
        html_body: `
          ${commonBodyPrefix}
          <h2 style="font-size: 26px; font-weight: 800; color: #2C1E36; margin: 0 0 10px;">New ${hasSession ? 'Booking' : 'Order'} Received</h2>
          <p style="font-size: 15px; line-height: 1.5; color: #665D6B; margin: 0 0 30px;">
            You have received a new ${hasSession ? 'booking' : 'order'} from ${firstName} ${lastName}.
          </p>
          ${sessionDetailsHtml}
          ${commonBodySuffix}
        `,
      },
    })
  }

  await notificationService.createNotifications(notifications)
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const {
    variantId,
    serviceTitle,
    email,
    firstName,
    lastName,
    phone,
    countryCode,
    razorpayPaymentId,
    bookingDate,
    bookingTime,
    price,
    calBookingId,
    calMeetUrl,
    eventSlug,
    isPackage,
    items,
    hasSession,
    shippingAddress,
  } = req.body as BookingOrderPayload

  console.log(`[Booking Confirmation] Processing for ${email} | Razorpay: ${razorpayPaymentId} | Cal: ${calBookingId}`)

  if (!email || !razorpayPaymentId) {
    return res.status(400).json({ message: "Missing email or payment ID" })
  }

  try {
    const orderModuleService = req.scope.resolve(Modules.ORDER) as any
    const notificationService = req.scope.resolve("notification") as any
    const regionModuleService = req.scope.resolve(Modules.REGION) as any
    const customerModuleService = req.scope.resolve(Modules.CUSTOMER) as any
    const paymentModuleService = req.scope.resolve(Modules.PAYMENT) as any
    const remoteLink = req.scope.resolve(ContainerRegistrationKeys.LINK) as any
    const productModuleService = req.scope.resolve(Modules.PRODUCT) as any
    const taxModuleService = req.scope.resolve(Modules.TAX) as any

    // Idempotency — if an order already exists for this Razorpay payment, just resend the email
    const [existingOrders] = await orderModuleService.listAndCountOrders(
      { metadata: { razorpay_id: razorpayPaymentId } },
      { select: ["id", "display_id", "metadata"] }
    )
    if (existingOrders.length > 0) {
      const existing = existingOrders[0]
      console.log(`[Booking Confirmation] Order ${existing.id} already exists for Razorpay ${razorpayPaymentId} — resending email`)
      await sendConfirmationEmail({
        notificationService, email, firstName, lastName, phone,
        serviceTitle, bookingDate, bookingTime, price: price || 0,
        razorpayPaymentId, calMeetUrl, isPackage,
        orderId: existing.display_id || existing.id, pdfBase64: null,
        items, hasSession,
      })
      return res.status(200).json({ success: true, orderId: existing.id, message: "Order already existed — confirmation email resent." })
    }

    // 1. Get default region
    const [regions] = await regionModuleService.listAndCountRegions({})
    const region = regions[0]
    if (!region) {
      console.error("[Booking Order] No regions found.")
      return res.status(400).json({ message: "No region found" })
    }

    // 2. Resolve customer if exists
    let customerId: string | undefined
    try {
      const [customers] = await customerModuleService.listAndCountCustomers({ email })
      if (customers.length > 0) customerId = customers[0].id
    } catch (e: any) {
      console.warn("[Booking Order] Could not resolve customer:", e.message)
    }

    // 3. Create order — use real address when physical products present
    const hasPhysicalItems = (items ?? []).some(i => !i.metadata?.is_booking && !i.metadata?.booking_date)
    const addressPayload = hasPhysicalItems && shippingAddress?.address1
      ? {
          first_name: firstName,
          last_name: lastName || "Customer",
          phone: phone || "",
          address_1: shippingAddress.address1,
          city: shippingAddress.city,
          province: shippingAddress.state || "",
          country_code: countryCode || "in",
          postal_code: shippingAddress.postalCode,
        }
      : {
          first_name: firstName,
          last_name: lastName || "Customer",
          phone: phone || "",
          address_1: "Digital Delivery",
          city: "Online",
          country_code: countryCode || "in",
          postal_code: "000000",
        }

    const order = await orderModuleService.createOrders({
      region_id: region.id,
      customer_id: customerId,
      email,
      currency_code: region.currency_code || "inr",
      shipping_address: addressPayload,
      billing_address: addressPayload,
      metadata: {
        is_session: true,
        razorpay_id: razorpayPaymentId,
        booking_date: bookingDate,
        booking_time: bookingTime,
        cal_booking_id: calBookingId,
        cal_meet_url: calMeetUrl,
        cal_event_slug: eventSlug,
      },
    })

    console.log(`[Booking Order] Created order ${order.id} for ${email}`)

    // 4. Add line items
    if (items?.length) {
      await orderModuleService.createOrderLineItems(order.id, items.map(item => ({
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        requires_shipping: !item.metadata?.is_booking,
        is_discountable: false,
        metadata: { ...item.metadata, razorpay_id: razorpayPaymentId },
      })))
    } else {
      await orderModuleService.createOrderLineItems(order.id, [
        {
          title: serviceTitle ? `${serviceTitle} - ${bookingDate} ${bookingTime}` : `Session Booking - ${bookingDate} ${bookingTime}`,
          quantity: 1,
          unit_price: price || 0,
          requires_shipping: false,
          is_discountable: false,
          metadata: { booking_date: bookingDate, booking_time: bookingTime, razorpay_id: razorpayPaymentId, variant_id: variantId },
        },
      ])
    }

    // 4b. Auto-add gift hamper — same logic as the cart subscriber but applied
    //     to the booking order which bypasses the Medusa cart entirely.
    let hamperGiftTitle: string | null = null
    try {
      const query = req.scope.resolve(ContainerRegistrationKeys.QUERY) as any
      const { data: hamperProducts } = await query.graph({
        entity: "product",
        fields: ["id", "variants.id", "metadata", "title"],
        filters: { status: "published", tags: { value: "gift-hamper" } },
      })

      const hamperTiers = (hamperProducts ?? [])
        .filter((p: any) => p.metadata?.hamper_threshold != null && p.variants?.[0]?.id)
        .map((p: any) => ({
          productId: p.id,
          variantId: p.variants[0].id,
          threshold: Number(p.metadata.hamper_threshold),
          title: p.title,
          gift_label: p.metadata?.gift_label as string | undefined,
        }))
        .filter((t: any) => !isNaN(t.threshold))
        .sort((a: any, b: any) => b.threshold - a.threshold)

      const sessionPrice = price || 0
      const qualifiedTier = hamperTiers.find((t: any) => sessionPrice >= t.threshold) ?? null

      if (qualifiedTier) {
        await orderModuleService.createOrderLineItems(order.id, [
          {
            title: `🎁 ${qualifiedTier.title}`,
            quantity: 1,
            unit_price: 0,
            requires_shipping: true,
            is_discountable: false,
            metadata: { is_auto_gift: true, hamper_product_id: qualifiedTier.productId },
          },
        ])
        hamperGiftTitle = qualifiedTier.gift_label || qualifiedTier.title
        console.log(`[Booking Order] Gift hamper "${qualifiedTier.title}" added to order ${order.id} (session price: ${sessionPrice} >= threshold: ${qualifiedTier.threshold})`)
      } else {
        console.log(`[Booking Order] No hamper tier qualifies for session price ${sessionPrice}`)
      }
    } catch (hamperErr: any) {
      console.error(`[Booking Order] Could not add gift hamper (non-blocking):`, hamperErr.message)
    }

    // 5. Register payment collection
    try {
      const currencyCode = region.currency_code || "inr"
      const paymentCollection = await paymentModuleService.createPaymentCollections({
        currency_code: currencyCode,
        amount: price || 0,
        region_id: region.id,
      })
      const paymentSession = await paymentModuleService.createPaymentSession(paymentCollection.id, {
        provider_id: "pp_system_default",
        amount: price || 0,
        currency_code: currencyCode,
        data: { razorpay_payment_id: razorpayPaymentId },
      })
      const payment = await paymentModuleService.authorizePaymentSession(paymentSession.id, {})
      await paymentModuleService.capturePayment({ payment_id: payment.id, amount: price || 0 })
      await remoteLink.create({
        [Modules.ORDER]: { order_id: order.id },
        [Modules.PAYMENT]: { payment_collection_id: paymentCollection.id },
      })
      console.log(`[Booking Order] Payment captured and linked to order ${order.id}`)
    } catch (paymentError: any) {
      console.error(`[Booking Order] Could not register payment for order ${order.id}:`, paymentError.message)
    }

    // 6. Fetch tax lines for invoice
    let invoiceTaxLines: { rate: number }[] = []
    try {
      const [variants] = await productModuleService.listProductVariants({ id: variantId }, { relations: ["product"] })
      const variant = variants?.[0]
      if (variant?.product_id) {
        const taxLines = await taxModuleService.getTaxLines(
          [{ id: "booking-item", product_id: variant.product_id, product_type_id: variant.product?.type_id ?? undefined, quantity: 1, unit_price: price || 0, currency_code: region.currency_code || "inr" }],
          { address: { country_code: countryCode || "in" } }
        )
        invoiceTaxLines = taxLines.map((t: any) => ({ rate: t.rate }))
      }
    } catch (taxErr: any) {
      console.warn("[Booking Order] Could not fetch tax lines, using fallback rate:", taxErr.message)
    }

    // 7. Generate PDF invoice
    const invoiceOrder = {
      created_at: order.created_at || new Date().toISOString(),
      display_id: order.display_id || order.id,
      shipping_address: {
        first_name: firstName, last_name: lastName || "Customer",
        address_1: "Digital Delivery", address_2: "",
        city: "Online", postal_code: "000000",
        phone: phone || "", province: null, country_code: countryCode || "in",
      },
      items: items?.length 
        ? items.map(item => ({
            title: item.title,
            quantity: item.quantity,
            unit_price: item.unit_price,
            adjustments: [],
            tax_lines: [], // In multi-item, we'd ideally fetch all taxes, but for now we keep it simple or fallback
            metadata: item.metadata || {},
          }))
        : [
          {
            title: serviceTitle ? `${serviceTitle} - ${bookingDate} ${bookingTime}` : `Session Booking - ${bookingDate} ${bookingTime}`,
            quantity: 1, unit_price: price || 0, adjustments: [],
            tax_lines: invoiceTaxLines, metadata: { hs_code: "9983" },
          },
        ],
      shipping_total: 0,
      shipping_methods: [],
      payment_collections: [{ payments: [{ provider_id: "razorpay" }] }],
    }

    const pdfBuffer = await generateInvoice(invoiceOrder)
    const pdfBase64 = pdfBuffer.toString("base64")

    // 8. Send confirmation emails
    await sendConfirmationEmail({
      notificationService, email, firstName, lastName, phone,
      serviceTitle, bookingDate, bookingTime, price: price || 0,
      razorpayPaymentId, calMeetUrl, isPackage,
      orderId: order.display_id || order.id, pdfBase64, hamperGiftTitle,
      items, hasSession,
    })

    console.log(`[Booking Confirmation] Email sent successfully to ${email}`)
    return res.status(200).json({ success: true, orderId: order.id, message: "Booking recorded and email sent." })
  } catch (error: any) {
    console.error("[Booking Confirmation] Error:", error.message)
    console.error("[Booking Confirmation] Stack:", error.stack)
    return res.status(500).json({ message: "Failed to process booking", error: error.message })
  }
}
