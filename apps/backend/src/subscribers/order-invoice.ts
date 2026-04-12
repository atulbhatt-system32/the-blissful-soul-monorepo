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
        "items.adjustments.*",
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
    const storefrontUrl = process.env.STOREFRONT_URL || 'https://klickvert.com'
    
    if (notificationService) {
      await (notificationService as any).createNotifications([
        {
          to: order.email,
          channel: "email",
          template: "order-placed",
          data: {
            subject: `Order Confirmation #${order.display_id}`,
            html_body: `
              <p>Hi ${order.shipping_address?.first_name || 'there'}, thank you for your order!</p>
              <p><strong>Order ID: #${order.display_id}</strong></p>
              <p>To track your order status, <a href="${storefrontUrl}/order/lookup">click here</a>.</p>
              <p>Your invoice is attached to this email.</p>
            `,
          },
          attachments: [
            {
              content: pdfBase64, 
              encoding: "base64",
              filename: `invoice_${order.display_id}.pdf`,
              type: "application/pdf",
              disposition: "attachment"
            }
          ]
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
