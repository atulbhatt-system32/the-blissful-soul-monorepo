import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import easyinvoice from 'easyinvoice'

export default async function orderInvoiceHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderService = container.resolve("order")
  const notificationService = container.resolve("notification")

  // 1. Fetch full order details
  const order = await orderService.retrieveOrder(data.id, {
    relations: ["items", "shipping_address", "billing_address", "customer"]
  })

  // 2. Prepare Invoice Data for EasyInvoice
  const invoiceData = {
    "images": {
        "logo": "https://public.easyinvoice.cloud/img/logo_en_72x72.png",
    },
    "sender": {
        "company": "The Blissful Soul",
        "address": "Shakti Nagar",
        "city": "Delhi",
        "country": "India",
        "zip": "110007"
    },
    "client": {
        "company": `${order.shipping_address?.first_name} ${order.shipping_address?.last_name}`,
        "address": order.shipping_address?.address_1 || "",
        "city": order.shipping_address?.city || "",
        "country": order.shipping_address?.country_code || ""
    },
    "information": {
        "number": String(order.display_id),
        "date": new Date(order.created_at).toLocaleDateString(),
    },
    "products": (order.items || []).map(item => ({
        "quantity": String(item.quantity),
        "description": item.title,
        "tax-rate": 18,
        "price": Number(item.unit_price) / 100
    })),
    "bottom-notice": "Thank you for shopping with The Blissful Soul!",
    "settings": { "currency": order.currency_code.toUpperCase() }
  };

  // 3. Generate PDF
  const result = await easyinvoice.createInvoice(invoiceData);

  // 4. Send Notification with Attachment
  await (notificationService as any).createNotifications([
    {
      to: order.email,
      channel: "email",
      template: "order-placed",
      data: {
        subject: `Order Confirmation #${order.display_id}`,
        html_body: `<p>Hi ${order.shipping_address?.first_name}, thank you for your order! Your invoice is attached.</p>`,
      },
      attachments: [
        {
          content: result.pdf, 
          filename: `invoice_${order.display_id}.pdf`,
          type: "application/pdf",
          disposition: "attachment"
        }
      ]
    }
  ]);

  console.log(`[Order Processing] Invoice generated and email queued for Order #${order.display_id}`);
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
