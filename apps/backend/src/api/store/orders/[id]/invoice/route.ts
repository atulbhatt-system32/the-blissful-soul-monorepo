import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { generateInvoice } from "../../../../../lib/invoice"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params
  const query = req.scope.resolve("query")

  try {
    const { data: orders } = await (query as any).graph({
      entity: "order",
      fields: ["*", "items.*", "items.adjustments.*", "shipping_address.*", "billing_address.*", "payment_collections.payments.*", "shipping_methods.*", "shipping_methods.adjustments.*", "+total", "+subtotal", "+shipping_total", "+tax_total", "+discount_total"],
      filters: { id },
    })

    const order = orders?.[0]

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    const pdfBuffer = await generateInvoice(order)

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", `attachment; filename=invoice_${order.display_id}.pdf`)
    res.send(pdfBuffer)
  } catch (error) {
    console.error("Error generating invoice:", error)
    res.status(500).json({ message: "Error generating invoice" })
  }
}
