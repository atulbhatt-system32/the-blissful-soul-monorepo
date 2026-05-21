import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { sendSessionCancellationWhatsApp } from "../../../lib/interakt"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const body = req.body as any
  const triggerEvent = body?.triggerEvent || body?.trigger_event

  console.log(`[Cal.com Webhook] Received event: ${triggerEvent}`)

  if (triggerEvent !== "BOOKING_CANCELLED") {
    return res.status(200).json({ received: true })
  }

  try {
    const payload = body.payload || body
    const bookingUid = payload?.uid
    const attendeeEmail = payload?.attendees?.[0]?.email || payload?.attendee?.email

    if (!bookingUid && !attendeeEmail) {
      console.warn("[Cal.com Webhook] No booking UID or email in cancellation payload")
      return res.status(200).json({ received: true })
    }

    console.log(`[Cal.com Webhook] Booking cancelled — UID: ${bookingUid} | Email: ${attendeeEmail}`)

    // Find the matching Medusa order by cal booking UID or email
    const query = req.scope.resolve("query") as any
    const orderModuleService = req.scope.resolve("order") as any
    const notificationService = req.scope.resolve("notification") as any

    const { data: orders } = await query.graph({
      entity: "order",
      fields: ["*", "items.*", "shipping_address.*"],
      filters: bookingUid
        ? { metadata: { cal_booking_id: bookingUid } }
        : { email: attendeeEmail, metadata: { is_session: true } },
    })

    const order = orders?.[0]
    if (!order) {
      console.warn(`[Cal.com Webhook] No order found for booking UID: ${bookingUid}`)
      return res.status(200).json({ received: true })
    }

    const bookingDate = order.metadata?.booking_date || ""
    const bookingTime = order.metadata?.booking_time || ""
    const firstName = order.shipping_address?.first_name || "Customer"
    const serviceTitle = order.items?.[0]?.title

    // 1. Update order status to canceled
    if (order.status !== "canceled") {
      await orderModuleService.updateOrders([{
        id: order.id,
        status: "canceled",
        metadata: {
          ...order.metadata,
          canceled_at: new Date().toISOString(),
          canceled_by: "calcom_webhook",
        }
      }])
      console.log(`[Cal.com Webhook] Order #${order.display_id} marked as canceled`)
    }

    // 2. Send cancellation email to customer
    if (notificationService) {
      const adminEmails = [...new Set([
        process.env.ADMIN_NOTIFICATION_EMAIL,
        process.env.GOOGLE_SMTP_USER,
      ].filter(Boolean) as string[])]

      await notificationService.createNotifications([
        {
          to: order.email,
          channel: "email",
          template: "session-cancelled",
          data: {
            subject: `Session Cancelled — #${order.display_id}`,
            html_body: `
              <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #FBFAF8; border: 1px solid #E1DFE3; border-radius: 16px;">
                <h1 style="font-family: Georgia, serif; font-size: 20px; color: #2C1E36; margin: 0 0 4px;">The Blissful Soul</h1>
                <p style="text-transform: uppercase; font-size: 9px; letter-spacing: 0.4em; color: #C5A059; margin: 0 0 30px;">Healing &amp; Crystals</p>
                <h2 style="color: #c0392b;">Session Cancelled ❌</h2>
                <p>Hi ${firstName}, your session booking <strong>#${order.display_id}</strong> scheduled for <strong>${bookingDate} at ${bookingTime}</strong> has been cancelled.</p>
                <p>If a refund is applicable, it will be processed within 5–7 business days.</p>
                <p style="margin-top: 30px; color: #C5A059; font-weight: bold;">The Blissful Soul Team</p>
              </div>`,
          },
        },
        ...adminEmails.map((adminEmail: string) => ({
          to: adminEmail,
          channel: "email",
          template: "session-cancelled-admin",
          data: {
            subject: `[ADMIN] Session Cancelled via Cal.com — #${order.display_id}`,
            html_body: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #fff5f5; border-radius: 8px;">
                <h2>Session Cancellation (Cal.com)</h2>
                <ul>
                  <li><strong>Order:</strong> #${order.display_id}</li>
                  <li><strong>Customer:</strong> ${firstName} (${order.email})</li>
                  <li><strong>Session:</strong> ${bookingDate} at ${bookingTime}</li>
                  <li><strong>Cal.com UID:</strong> ${bookingUid}</li>
                </ul>
                <p>Please process any applicable refunds in Razorpay.</p>
              </div>`,
          },
        })),
      ])
    }

    // 3. Send WhatsApp cancellation (non-blocking)
    const phone = order.shipping_address?.phone || ""
    if (phone) {
      sendSessionCancellationWhatsApp({
        phone,
        countryCode: order.shipping_address?.country_code || "in",
        firstName,
        orderId: order.display_id || order.id,
        serviceTitle,
        bookingDate,
        bookingTime,
      }).catch((err: Error) => console.error(`[WhatsApp] Session cancellation failed for #${order.display_id}:`, err.message))
    }

    console.log(`[Cal.com Webhook] Cancellation handled for Order #${order.display_id}`)
    return res.status(200).json({ received: true })
  } catch (error: any) {
    console.error("[Cal.com Webhook] Error handling cancellation:", error.message)
    return res.status(200).json({ received: true }) // Always 200 so Cal.com doesn't retry
  }
}
