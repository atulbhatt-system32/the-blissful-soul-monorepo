import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { generateInvoice } from "../../../../../lib/invoice"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params
  const orderService = req.scope.resolve("order")

  try {
    const order = await orderService.retrieveOrder(id, {
      relations: ["items", "shipping_address", "billing_address"]
    })

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
