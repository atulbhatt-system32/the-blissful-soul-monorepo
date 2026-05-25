import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import * as crypto from "crypto"
import { sendBookingConfirmationWhatsApp } from "../../../lib/interakt"
import { generateInvoice } from "../../../lib/invoice"

function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex")
  return expected === signature
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const signature = req.headers["x-razorpay-signature"] as string
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error("[Razorpay Webhook] RAZORPAY_WEBHOOK_SECRET not set")
    return res.status(500).json({ message: "Webhook secret not configured" })
  }

  // Verify signature
  const rawBody = JSON.stringify(req.body)
  if (!signature || !verifySignature(rawBody, signature, webhookSecret)) {
    console.warn("[Razorpay Webhook] Invalid signature — rejecting")
    return res.status(400).json({ message: "Invalid signature" })
  }

  const event = (req.body as any)?.event
  const payment = (req.body as any)?.payload?.payment?.entity

  if (event !== "payment.captured" || !payment) {
    return res.status(200).json({ message: "Event ignored" })
  }

  const razorpayPaymentId: string = payment.id
  const notes: Record<string, string> = payment.notes || {}
  const amountPaise: number = payment.amount || 0
  const price = amountPaise / 100

  const email = notes.email
  const firstName = notes.first_name
  const lastName = notes.last_name || ""
  const phone = notes.phone || ""
  const countryCode = notes.country_code || "in"
  const serviceTitle = notes.service_title || ""
  const bookingDate = notes.booking_date || ""
  const bookingTime = notes.booking_time || ""
  const eventSlug = notes.event_slug || ""
  const isPackage = notes.is_package === "true"
  const hasSession = notes.has_session === "true"
  const variantId = notes.variant_id || ""
  const slotIsoStart = notes.slot_iso || ""

  if (!email || !firstName) {
    console.warn(`[Razorpay Webhook] Payment ${razorpayPaymentId} missing notes — skipping backup order`)
    return res.status(200).json({ message: "No booking notes found — skipping" })
  }

  console.log(`[Razorpay Webhook] payment.captured for ${email} | ${razorpayPaymentId}`)

  try {
    const orderModuleService = req.scope.resolve(Modules.ORDER) as any
    const notificationService = req.scope.resolve("notification") as any
    const regionModuleService = req.scope.resolve(Modules.REGION) as any
    const customerModuleService = req.scope.resolve(Modules.CUSTOMER) as any
    const paymentModuleService = req.scope.resolve(Modules.PAYMENT) as any
    const remoteLink = req.scope.resolve(ContainerRegistrationKeys.LINK) as any
    const salesChannelModuleService = req.scope.resolve(Modules.SALES_CHANNEL) as any

    // Idempotency — skip if order already exists (frontend handled it)
    const [existingOrders] = await orderModuleService.listAndCountOrders(
      { metadata: { razorpay_id: razorpayPaymentId } },
      { select: ["id", "display_id"] }
    )
    if (existingOrders.length > 0) {
      console.log(`[Razorpay Webhook] Order already exists for ${razorpayPaymentId} — skipping`)
      return res.status(200).json({ message: "Order already exists" })
    }

    console.log(`[Razorpay Webhook] No order found for ${razorpayPaymentId} — creating backup order`)

    // Get region
    const [regions] = await regionModuleService.listAndCountRegions({})
    const region = regions[0]
    if (!region) return res.status(200).json({ message: "No region found" })

    // Get sales channel
    let salesChannelId: string | undefined
    try {
      const [salesChannels] = await salesChannelModuleService.listAndCountSalesChannels({})
      if (salesChannels.length > 0) salesChannelId = salesChannels[0].id
    } catch (e: any) {
      console.warn("[Razorpay Webhook] Could not resolve sales channel:", e.message)
    }

    // Resolve or create customer
    let customerId: string | undefined
    try {
      const [customers] = await customerModuleService.listAndCountCustomers({ email })
      if (customers.length > 0) {
        customerId = customers[0].id
      } else {
        const newCustomer = await customerModuleService.createCustomers({
          email,
          first_name: firstName,
          last_name: lastName || undefined,
          phone: phone || undefined,
        })
        customerId = newCustomer.id
      }
    } catch (e: any) {
      console.warn("[Razorpay Webhook] Could not resolve/create customer:", e.message)
    }

    // Create order
    const order = await orderModuleService.createOrders({
      region_id: region.id,
      sales_channel_id: salesChannelId,
      customer_id: customerId,
      email,
      currency_code: region.currency_code || "inr",
      shipping_address: {
        first_name: firstName,
        last_name: lastName || "Customer",
        phone: phone || "",
        address_1: "Digital Delivery",
        city: "Online",
        country_code: countryCode,
        postal_code: "000000",
      },
      billing_address: {
        first_name: firstName,
        last_name: lastName || "Customer",
        phone: phone || "",
        address_1: "Digital Delivery",
        city: "Online",
        country_code: countryCode,
        postal_code: "000000",
      },
      metadata: {
        is_session: true,
        razorpay_id: razorpayPaymentId,
        booking_date: bookingDate,
        booking_time: bookingTime,
        cal_event_slug: eventSlug,
        created_by: "razorpay_webhook_backup",
      },
    })

    // Add line item
    await orderModuleService.createOrderLineItems(order.id, [
      {
        title: serviceTitle ? `${serviceTitle} - ${bookingDate} ${bookingTime}` : `Session Booking - ${bookingDate} ${bookingTime}`,
        quantity: 1,
        unit_price: price,
        requires_shipping: false,
        is_discountable: false,
        metadata: { booking_date: bookingDate, booking_time: bookingTime, razorpay_id: razorpayPaymentId, variant_id: variantId },
      },
    ])

    // Register payment
    try {
      const currencyCode = region.currency_code || "inr"
      const paymentCollection = await paymentModuleService.createPaymentCollections({
        currency_code: currencyCode,
        amount: price,
        region_id: region.id,
      })
      const paymentSession = await paymentModuleService.createPaymentSession(paymentCollection.id, {
        provider_id: "pp_system_default",
        amount: price,
        currency_code: currencyCode,
        data: { razorpay_payment_id: razorpayPaymentId },
      })
      const capturedPayment = await paymentModuleService.authorizePaymentSession(paymentSession.id, {})
      await paymentModuleService.capturePayment({ payment_id: capturedPayment.id, amount: price })
      await remoteLink.create({
        [Modules.ORDER]: { order_id: order.id },
        [Modules.PAYMENT]: { payment_collection_id: paymentCollection.id },
      })
    } catch (paymentError: any) {
      console.error(`[Razorpay Webhook] Could not register payment:`, paymentError.message)
    }

    // Send email
    try {
      const pdfBuffer = await generateInvoice({
        created_at: order.created_at || new Date().toISOString(),
        display_id: order.display_id || order.id,
        shipping_address: { first_name: firstName, last_name: lastName, address_1: "Digital Delivery", address_2: "", city: "Online", postal_code: "000000", phone, province: null, country_code: countryCode },
        items: [{ title: serviceTitle || "Session Booking", quantity: 1, unit_price: price, adjustments: [], tax_lines: [], metadata: {} }],
        shipping_total: 0,
        shipping_methods: [],
        payment_collections: [{ payments: [{ provider_id: "razorpay" }] }],
      })
      const pdfBase64 = pdfBuffer.toString("base64")
      const pdfAttachments = [{ content: pdfBase64, encoding: "base64", filename: `invoice_${order.display_id || order.id}.pdf`, contentType: "application/pdf" }]

      const adminEmails = [...new Set([process.env.ADMIN_NOTIFICATION_EMAIL, process.env.GOOGLE_SMTP_USER].filter(Boolean) as string[])]
      const notifications: any[] = [
        {
          to: email,
          channel: "email",
          template: "booking-confirmed",
          data: {
            subject: `Order Confirmed: #${order.display_id || order.id}`,
            html_body: `<p>Hi ${firstName}, your booking has been confirmed. Booking: ${serviceTitle} on ${bookingDate} at ${bookingTime}. Payment ID: ${razorpayPaymentId}</p>`,
            pdf_attachments: pdfAttachments,
          },
        },
        ...adminEmails.map(adminEmail => ({
          to: adminEmail,
          channel: "email",
          template: "booking-admin-notification",
          data: {
            subject: `NEW BOOKING (webhook backup): ${firstName} | #${order.display_id || order.id}`,
            html_body: `<p>New booking from ${firstName} ${lastName} (${email}). Service: ${serviceTitle}. Date: ${bookingDate} ${bookingTime}. Payment: ${razorpayPaymentId}. Created via webhook backup.</p>`,
          },
        })),
      ]
      await notificationService.createNotifications(notifications)
    } catch (emailErr: any) {
      console.error("[Razorpay Webhook] Email failed:", emailErr.message)
    }

    // Send WhatsApp
    sendBookingConfirmationWhatsApp({
      phone, countryCode: countryCode || "in", firstName,
      orderId: order.display_id || order.id,
      serviceTitle, bookingDate, bookingTime, amount: price,
    }).catch(err => console.error("[Razorpay Webhook] WhatsApp failed:", err.message))

    console.log(`[Razorpay Webhook] Backup order ${order.id} created and notifications sent for ${email}`)
    return res.status(200).json({ success: true, orderId: order.id })

  } catch (error: any) {
    console.error("[Razorpay Webhook] Error:", error.message)
    // Return 200 so Razorpay doesn't retry — log the failure
    return res.status(200).json({ message: "Processed with error", error: error.message })
  }
}
