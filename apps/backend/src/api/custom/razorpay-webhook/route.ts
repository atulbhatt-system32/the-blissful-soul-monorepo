import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import * as crypto from "crypto"
import { toInternationalPhone } from "../../../lib/phone"
import { shareDriveFolder, revokeDriveAccess } from "../../../lib/google-drive"

const CAL_API_BASE = "https://api.cal.com/v2"
const CAL_TIMEOUT_MS = 10000

function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex")
  return expected === signature
}


async function createCalComBooking(params: {
  apiKey: string
  username: string
  eventSlug: string
  slotIsoStart: string
  attendeeName: string
  attendeeEmail: string
  phone?: string
  countryCode?: string
  orderId?: string | number
}): Promise<{ uid?: string; meetUrl?: string }> {
  // Resolve eventTypeId from slug
  let eventTypeId: number | undefined
  try {
    const abort = new AbortController()
    const t = setTimeout(() => abort.abort(), CAL_TIMEOUT_MS)
    const res = await fetch(`${CAL_API_BASE}/event-types`, {
      headers: {
        "Authorization": `Bearer ${params.apiKey}`,
        "cal-api-version": "2024-06-14",
        "Content-Type": "application/json",
      },
      signal: abort.signal,
    }).finally(() => clearTimeout(t))
    if (res.ok) {
      const json = await res.json()
      const types = json.data || []
      const match = Array.isArray(types) ? types.find((t: any) => t.slug === params.eventSlug) : null
      if (match) eventTypeId = match.id
    }
  } catch (e: any) {
    console.warn("[Razorpay Webhook] Cal.com event-types lookup failed:", e.message)
  }

  const payload: any = {
    start: params.slotIsoStart,
    attendee: {
      name: params.attendeeName,
      email: params.attendeeEmail,
      timeZone: "Asia/Kolkata",
      ...(params.phone ? { phoneNumber: toInternationalPhone(params.phone, params.countryCode || "in") } : {}),
    },
    bookingFieldsResponses: {
      title: params.orderId ? `Order #${params.orderId}` : "Session Booking",
    },
  }

  if (eventTypeId) {
    payload.eventTypeId = eventTypeId
  } else {
    payload.eventTypeSlug = params.eventSlug
    payload.username = params.username
  }

  const abort = new AbortController()
  const t = setTimeout(() => abort.abort(), CAL_TIMEOUT_MS)
  const res = await fetch(`${CAL_API_BASE}/bookings`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${params.apiKey}`,
      "cal-api-version": "2026-02-25",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: abort.signal,
  }).finally(() => clearTimeout(t))

  let json: any = {}
  try { json = JSON.parse(await res.text()) } catch { /* non-JSON response */ }

  if (!res.ok) {
    console.error("[Razorpay Webhook] Cal.com booking error:", res.status, json)
    return {}
  }

  return {
    uid: json.data?.uid || json.data?.id,
    meetUrl: json.data?.meetingUrl
      || json.data?.references?.find((r: any) => r.meetingUrl)?.meetingUrl,
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const signature = req.headers["x-razorpay-signature"] as string
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error("[Razorpay Webhook] RAZORPAY_WEBHOOK_SECRET not set")
    return res.status(500).json({ message: "Webhook secret not configured" })
  }

  const rawBody = JSON.stringify(req.body)
  if (!signature || !verifySignature(rawBody, signature, webhookSecret)) {
    console.warn("[Razorpay Webhook] Invalid signature — rejecting")
    return res.status(400).json({ message: "Invalid signature" })
  }

  const event = (req.body as any)?.event
  const payment = (req.body as any)?.payload?.payment?.entity

  if (event === "refund.created") {
    return handleRefund(req, res)
  }

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
    console.warn(`[Razorpay Webhook] Payment ${razorpayPaymentId} missing notes — skipping`)
    return res.status(200).json({ message: "No booking notes found — skipping" })
  }

  console.log(`[Razorpay Webhook] payment.captured for ${email} | ${razorpayPaymentId}`)

  try {
    const orderModuleService = req.scope.resolve(Modules.ORDER) as any
    const regionModuleService = req.scope.resolve(Modules.REGION) as any
    const customerModuleService = req.scope.resolve(Modules.CUSTOMER) as any
    const paymentModuleService = req.scope.resolve(Modules.PAYMENT) as any
    const remoteLink = req.scope.resolve(ContainerRegistrationKeys.LINK) as any
    const salesChannelModuleService = req.scope.resolve(Modules.SALES_CHANNEL) as any

    // Idempotency — skip if order already exists
    const [existingOrders] = await orderModuleService.listAndCountOrders(
      { metadata: { razorpay_id: razorpayPaymentId } },
      { select: ["id", "display_id"] }
    )
    if (existingOrders.length > 0) {
      console.log(`[Razorpay Webhook] Order already exists for ${razorpayPaymentId} — skipping`)
      return res.status(200).json({ message: "Order already exists" })
    }

    // Get region
    const [regions] = await regionModuleService.listAndCountRegions({})
    const region = regions[0]
    if (!region) {
      console.error(`[Razorpay Webhook] No region found — cannot create order for ${email} | ${razorpayPaymentId}`)
      return res.status(200).json({ message: "No region found" })
    }

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
        is_session: hasSession,
        is_package: isPackage,
        razorpay_id: razorpayPaymentId,
        booking_date: bookingDate,
        booking_time: bookingTime,
        cal_event_slug: eventSlug,
        created_by: "razorpay_webhook",
      },
    })

    // Add line item — include session metadata so calcom-booking subscriber can use it as fallback
    await orderModuleService.createOrderLineItems(order.id, [
      {
        title: serviceTitle
          ? `${serviceTitle}${bookingDate ? ` - ${bookingDate} ${bookingTime}` : ""}`
          : `Session Booking - ${bookingDate} ${bookingTime}`,
        quantity: 1,
        unit_price: price,
        requires_shipping: false,
        is_discountable: false,
        metadata: {
          is_session: hasSession,
          is_package: isPackage,
          slot_iso_start: slotIsoStart,
          event_slug: eventSlug,
          booking_date: bookingDate,
          booking_time: bookingTime,
          razorpay_id: razorpayPaymentId,
          variant_id: variantId,
        },
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
      console.error("[Razorpay Webhook] Could not register payment:", paymentError.message)
    }

    // Create Cal.com booking before emitting order.placed so the email includes the meet URL
    if (hasSession && !isPackage && slotIsoStart && eventSlug) {
      const calApiKey = process.env.CAL_API_KEY
      const calUsername = process.env.CAL_USERNAME
      if (calApiKey && calUsername) {
        try {
          console.log(`[Razorpay Webhook] Creating Cal.com booking for ${email} | ${eventSlug} | ${slotIsoStart}`)
          const calResult = await createCalComBooking({
            apiKey: calApiKey,
            username: calUsername,
            eventSlug,
            slotIsoStart,
            attendeeName: `${firstName} ${lastName}`.trim(),
            attendeeEmail: email,
            phone: phone || undefined,
            countryCode: countryCode || "in",
            orderId: order.display_id || order.id,
          })

          if (calResult.uid || calResult.meetUrl) {
            await orderModuleService.updateOrders([{
              id: order.id,
              metadata: {
                ...order.metadata,
                cal_meet_url: calResult.meetUrl || null,
                cal_booking_uid: calResult.uid || null,
              },
            }])
            console.log(`[Razorpay Webhook] Cal.com booking created — UID: ${calResult.uid} | Meet: ${calResult.meetUrl}`)
          }
        } catch (calErr: any) {
          console.error("[Razorpay Webhook] Cal.com booking failed (non-blocking):", calErr.message)
        }
      } else {
        console.warn("[Razorpay Webhook] CAL_API_KEY or CAL_USERNAME not set — skipping Cal.com booking")
      }
    }

    // Share Google Drive folder if product has drive_folder_id in metadata (course purchase)
    if (variantId) {
      try {
        const productModuleService = req.scope.resolve(Modules.PRODUCT) as any
        const variant = await productModuleService.retrieveProductVariant(variantId, { relations: ["product"] })
        const driveFolderId = variant?.product?.metadata?.drive_folder_id
        if (driveFolderId) {
          const permissionId = await shareDriveFolder(driveFolderId, email)
          if (permissionId) {
            await orderModuleService.updateOrders([{
              id: order.id,
              metadata: { ...order.metadata, drive_folder_id: driveFolderId }
            }])
          }
        }
      } catch (driveErr: any) {
        console.error("[Razorpay Webhook] Google Drive sharing failed (non-blocking):", driveErr.message)
      }
    }

    // Emit order.placed — triggers order-invoice subscriber (branded email + PDF + WhatsApp)
    try {
      const eventBusService = req.scope.resolve(Modules.EVENT_BUS) as any
      await eventBusService.emit({ name: "order.placed", data: { id: order.id } })
      console.log(`[Razorpay Webhook] Emitted order.placed for order ${order.id}`)
    } catch (eventErr: any) {
      console.error("[Razorpay Webhook] Failed to emit order.placed:", eventErr.message)
    }

    console.log(`[Razorpay Webhook] Order ${order.id} created for ${email}`)
    return res.status(200).json({ success: true, orderId: order.id })

  } catch (error: any) {
    console.error("[Razorpay Webhook] Error:", error.message)
    return res.status(200).json({ message: "Processed with error", error: error.message })
  }
}

async function handleRefund(req: MedusaRequest, res: MedusaResponse) {
  try {
    const refund = (req.body as any)?.payload?.refund?.entity
    const paymentId = refund?.payment_id

    if (!paymentId) {
      console.warn("[Razorpay Webhook] refund.created missing payment_id")
      return res.status(200).json({ received: true })
    }

    console.log(`[Razorpay Webhook] Refund received for payment: ${paymentId}`)

    const orderModuleService = req.scope.resolve(Modules.ORDER) as any
    const [orders] = await orderModuleService.listAndCountOrders(
      { metadata: { razorpay_id: paymentId } },
      { select: ["id", "display_id", "email", "metadata", "status"] }
    )

    const order = orders?.[0]
    if (!order) {
      console.warn(`[Razorpay Webhook] No order found for payment ${paymentId}`)
      return res.status(200).json({ received: true })
    }

    // Revoke Google Drive access if order had a course folder
    const driveFolderId = order.metadata?.drive_folder_id
    if (driveFolderId && order.email) {
      await revokeDriveAccess(driveFolderId, order.email)
    }

    // Update order status to canceled
    if (order.status !== "canceled") {
      await orderModuleService.updateOrders([{
        id: order.id,
        metadata: {
          ...order.metadata,
          refunded_at: new Date().toISOString(),
          refunded_via: "razorpay_webhook",
        }
      }])
    }

    console.log(`[Razorpay Webhook] Refund handled for Order #${order.display_id}`)
    return res.status(200).json({ received: true })
  } catch (error: any) {
    console.error("[Razorpay Webhook] Error handling refund:", error.message)
    return res.status(200).json({ received: true })
  }
}
