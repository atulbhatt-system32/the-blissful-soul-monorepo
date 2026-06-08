import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { sendOrderCancellationWhatsApp } from "../lib/interakt"

export default async function orderCancelledHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const query = container.resolve("query")
  const notificationService = container.resolve("notification")

  try {
    const { data: orders } = await (query as any).graph({
      entity: "order",
      fields: ["*", "items.*", "shipping_address.*"],
      filters: { id: data.id },
    })

    const order = orders?.[0]
    if (!order) return

    const isSession = order.metadata?.is_session === true || order.metadata?.is_session === "true"
    if (isSession) return // session cancellations are handled by booking-cancel route

    const customerName = order.shipping_address?.first_name || "Customer"
    const orderDate = new Date(order.created_at).toLocaleDateString("en-IN", {
      month: "long", day: "numeric", year: "numeric",
    })
    const itemTitles = (order.items || []).map((i: any) => i.title).join(", ")

    // Email notification
    if (notificationService) {
      const adminEmails = [...new Set([
        process.env.ADMIN_NOTIFICATION_EMAIL,
        process.env.GOOGLE_SMTP_USER,
      ].filter(Boolean) as string[])]

      await (notificationService as any).createNotifications([
        {
          to: order.email,
          channel: "email",
          template: "order-cancelled",
          data: {
            subject: `Order Cancelled: #${order.display_id} — The Blissful Soul`,
            html_body: `
              <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #FBFAF8; border: 1px solid #E1DFE3; border-radius: 16px;">
                <h1 style="font-family: Georgia, serif; font-size: 20px; color: #2C1E36; margin: 0 0 4px;">The Blissful Soul</h1>
                <p style="text-transform: uppercase; font-size: 9px; letter-spacing: 0.4em; color: #C5A059; margin: 0 0 30px;">Healing &amp; Crystals</p>
                <h2 style="color: #c0392b;">Order Cancelled: #${order.display_id}</h2>
                <p>Hi ${customerName}, your order <strong>#${order.display_id}</strong> for <strong>${itemTitles}</strong> has been cancelled.</p>
                <p>If a refund is applicable, it will be processed within 5–7 business days.</p>
                <p style="margin-top: 30px; color: #C5A059; font-weight: bold;">The Blissful Soul Team</p>
              </div>`,
          },
        },
        ...adminEmails.map((adminEmail) => ({
          to: adminEmail,
          channel: "email",
          template: "order-cancelled-admin",
          data: {
            subject: `[ADMIN] Order Cancelled: #${order.display_id} — ${customerName}`,
            html_body: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #fff5f5; border-radius: 8px;">
                <h2>Order Cancellation Alert</h2>
                <p>Order <strong>#${order.display_id}</strong> was cancelled.</p>
                <ul>
                  <li><strong>Customer:</strong> ${customerName} (${order.email})</li>
                  <li><strong>Items:</strong> ${itemTitles}</li>
                  <li><strong>Order Date:</strong> ${orderDate}</li>
                </ul>
                <p>Please process any applicable refunds in Razorpay.</p>
              </div>`,
          },
        })),
      ])
    }

    // WhatsApp cancellation (non-blocking)
    const phone = order.shipping_address?.phone || ""
    if (phone) {
      sendOrderCancellationWhatsApp({
        phone,
        countryCode: order.shipping_address?.country_code || "in",
        firstName: customerName,
        orderId: order.display_id || order.id,
        productTitle: itemTitles,
        orderDate,
      }).catch((err: Error) => console.error(`[WhatsApp] Order cancellation failed for #${order.display_id}:`, err.message))
    }

    console.log(`[Order Cancelled] Notifications sent for Order #${order.display_id}`)
  } catch (error: any) {
    console.error(`[Order Cancelled] Error for Order #${data.id}:`, error.message)
  }
}

export const config: SubscriberConfig = {
  event: "order.canceled",
}
