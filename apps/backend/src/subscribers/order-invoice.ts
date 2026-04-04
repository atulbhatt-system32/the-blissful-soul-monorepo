import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import PDFDocument from "pdfkit"

function generateInvoice(order: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 })
      const buffers: Buffer[] = []
      doc.on("data", buffers.push.bind(buffers))
      doc.on("end", () => resolve(Buffer.concat(buffers)))
      doc.on("error", reject)

      doc.fontSize(20).text("INVOICE", { align: "center" })
      doc.moveDown()

      doc.fontSize(10).text(`Order Number: ${order.display_id}`)
      doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`)
      doc.moveDown()

      const name = `${order.shipping_address?.first_name || ""} ${order.shipping_address?.last_name || ""}`.trim()
      doc.text(`Bill To: ${name}`)
      doc.text(`Address: ${order.shipping_address?.address_1 || ""}`)
      doc.text(`City: ${order.shipping_address?.city || ""}`)
      doc.text(`Country: ${order.shipping_address?.country_code || ""}`)
      doc.moveDown(2)

      doc.fontSize(12).text("Items", { underline: true })
      doc.moveDown(0.5)
      
      const items = order.items || []
      items.forEach((item: any) => {
        doc.fontSize(10).text(`${item.title} - Qty: ${item.quantity} - Price: ${(Number(item.unit_price) / 100).toFixed(2)} ${order.currency_code.toUpperCase()}`)
        doc.moveDown(0.5)
      })

      doc.moveDown(2)
      doc.fontSize(12).text("Thank you for shopping with The Blissful Soul!", { align: "center" })
      
      doc.end()
    } catch (e) {
      reject(e)
    }
  })
}

export default async function orderInvoiceHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderService = container.resolve("order")
  const notificationService = container.resolve("notification")

  // 1. Fetch full order details
  const order = await orderService.retrieveOrder(data.id, {
    relations: ["items", "shipping_address", "billing_address"]
  })

  // 2. Generate PDF using pdfkit
  const pdfBuffer = await generateInvoice(order);
  const pdfBase64 = pdfBuffer.toString("base64");

  // 3. Send Notification with Attachment
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
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
