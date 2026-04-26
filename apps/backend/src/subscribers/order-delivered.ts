import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

export default async function orderDeliveredHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const query = container.resolve("query")
  const notificationService = container.resolve("notification")

  try {
    // data.id is the fulfillment ID — look up the linked order ID first
    const { data: fulfillments } = await (query as any).graph({
      entity: "fulfillment",
      fields: ["id", "order.id"],
      filters: { id: data.id },
    })

    const orderId = fulfillments?.[0]?.order?.id
    if (!orderId) {
      console.error(`[Order Delivered] No order linked to fulfillment #${data.id}.`)
      return
    }

    const { data: orders } = await (query as any).graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "created_at",
        "status",
        "email",
        "metadata",
        "items.*",
        "shipping_address.*",
        "fulfillments.*",
        "fulfillments.items.*",
      ],
      filters: { id: orderId },
    })

    const order = orders?.[0]
    if (!order) {
      console.error(`[Order Delivered] Order #${orderId} not found.`)
      return
    }

    // Skip session/digital orders — nothing physically delivered
    if (order.metadata?.is_session === true || order.metadata?.is_session === "true") {
      return
    }

    if (!notificationService) {
      console.warn("[Order Delivered] Notification service not available.")
      return
    }

    const storefrontUrl = process.env.STOREFRONT_URL || "http://localhost:8001"
    const firstName = order.shipping_address?.first_name || "Customer"

    const items = order.items || []
    const itemRowsHtml = items
      .map(
        (item: any) => `
        <tr>
          <td style="padding: 14px 0; border-bottom: 1px solid #F0EDE8; font-size: 14px; color: #2C1E36; font-weight: 600;">
            ${item.title}
          </td>
          <td style="padding: 14px 10px; border-bottom: 1px solid #F0EDE8; text-align: center; color: #665D6B; font-size: 14px;">×${item.quantity}</td>
        </tr>`
      )
      .join("")

    const buildAddress = (addr: any) => {
      if (!addr) return '<span style="color: #9B949F;">N/A</span>'
      const name = `${addr.first_name || ""} ${addr.last_name || ""}`.trim()
      const lines = [
        name,
        addr.address_1,
        addr.address_2,
        `${addr.city || ""} ${addr.postal_code || ""}`.trim(),
        addr.province,
      ].filter(Boolean)
      return lines
        .map(
          (l) =>
            `<span style="display: block; font-size: 13px; color: #665D6B; line-height: 1.6;">${l}</span>`
        )
        .join("")
    }

    const htmlBody = `
      <div style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; background-color: #FBFAF8; padding: 40px 30px; color: #110E17; max-width: 620px; margin: 0 auto; border: 1px solid #E1DFE3; border-radius: 24px;">

        <!-- HEADER -->
        <div style="text-align: center; margin-bottom: 35px;">
          <h1 style="font-family: Georgia, serif; font-size: 20px; color: #2C1E36; margin: 0 0 4px; font-weight: 700; letter-spacing: 0.05em;">The Blissful Soul</h1>
          <p style="text-transform: uppercase; font-size: 9px; letter-spacing: 0.4em; color: #C5A059; margin: 0;">Healing &amp; Crystals</p>
        </div>

        <!-- TITLE -->
        <h2 style="font-size: 26px; font-weight: 800; color: #2C1E36; margin: 0 0 10px;">Your order has been delivered! 🎉</h2>
        <p style="font-size: 15px; line-height: 1.5; color: #665D6B; margin: 0 0 25px;">
          Hi ${firstName}, your order <a href="${storefrontUrl}/order/lookup?display_id=${order.display_id}&email=${order.email}" style="color: #7C3AED; text-decoration: none; font-weight: 600;">#${order.display_id}</a> has been delivered. We hope you love your crystals!
        </p>

        <!-- ITEMS -->
        <div style="margin-bottom: 25px;">
          <h3 style="font-size: 16px; font-weight: 700; color: #2C1E36; margin: 0 0 12px;">Items delivered</h3>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
            <tbody>${itemRowsHtml}</tbody>
          </table>
        </div>

        <!-- SHIPPING ADDRESS -->
        <div style="border-top: 1px solid #E1DFE3; padding-top: 20px; margin-bottom: 25px;">
          <p style="font-size: 14px; font-weight: 700; color: #2C1E36; margin: 0 0 10px;">Delivered to</p>
          ${buildAddress(order.shipping_address)}
        </div>

        <!-- VIEW ORDER BUTTON -->
        <div style="margin: 28px 0;">
          <a href="${storefrontUrl}/order/lookup?display_id=${order.display_id}&email=${order.email}" style="display: inline-block; background: #2C1E36; color: #C5A059; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 13px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; box-shadow: 0 4px 15px rgba(44,30,54,0.25);">View Order</a>
        </div>

        <!-- FOOTER -->
        <div style="border-top: 1px solid #E1DFE3; padding-top: 25px; text-align: center;">
          <p style="font-size: 13px; color: #9B949F; margin: 0 0 8px;">
            May the energy of these crystals find you well.
          </p>
          <p style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 18px; font-style: italic; color: #2C1E36; margin: 18px 0 4px;">Stay Blissful,</p>
          <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.3em; color: #C5A059; margin: 0;">The Blissful Soul Team</p>
        </div>

      </div>`

    await (notificationService as any).createNotifications([
      {
        to: order.email,
        channel: "email",
        template: "order-delivered",
        data: {
          subject: `Your order #${order.display_id} has been delivered – The Blissful Soul`,
          html_body: htmlBody,
        },
      },
    ])

    console.log(`[Order Delivered] Delivery notification sent for Order #${order.display_id} to ${order.email}`)
  } catch (error: any) {
    console.error(`[Order Delivered] Error for fulfillment #${data.id}:`, error.message || error)
  }
}

export const config: SubscriberConfig = {
  event: "delivery.created",
}
