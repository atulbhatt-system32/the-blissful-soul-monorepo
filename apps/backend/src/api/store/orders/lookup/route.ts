import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { display_id, email } = req.body as { display_id: string; email: string }

  if (!display_id || !email) {
    return res.status(400).json({ message: "Order ID and Email are required" })
  }

  const query = req.scope.resolve("query")

  try {
    // Sanitize display_id (remove # if present). Defensively cast to string in case it's sent as a number.
    const sanitizedId = String(display_id).replace("#", "").trim()
    console.log(`[Order Lookup] Searching for sanitized display_id: ${sanitizedId}, email: ${email}`)

    const { data: orders } = await (query as any).graph({
      entity: "order",
      fields: ["*", "items.*", "shipping_address.*", "billing_address.*", "payment_collections.*", "payment_collections.payments.*", "shipping_methods.*"],
      filters: {
        display_id: parseInt(sanitizedId),
      },
    })

    console.log(`[Order Lookup] Found orders for sanitized display_id ${sanitizedId}: ${orders?.length || 0}`)

    if (!orders || orders.length === 0) {
      // Diagnostic: Log a few existing orders to see what display_ids look like
      const { data: allOrders } = await (query as any).graph({
        entity: "order",
        fields: ["display_id", "email"],
        pagination: { take: 5 }
      })
      console.log(`[Order Lookup] Diagnostic - Sample orders:`, allOrders?.map((o: any) => ({ id: o.display_id, email: o.email })))
      
      return res.status(404).json({ message: "Order not found" })
    }

    // Filter by email manually to ensure exact match and avoid case-sensitivity issues
    const order = orders.find((o: any) => o.email.toLowerCase() === email.toLowerCase())

    if (!order) {
      console.log(`[Order Lookup] No order match for email: ${email}. Available emails: ${orders.map((o: any) => o.email).join(", ")}`)
      return res.status(404).json({ message: "Order not found" })
    }

    // Return the matching order
    res.json({ order })
  } catch (error) {
    console.error("Error looking up order:", error)
    res.status(500).json({ message: "Error looking up order" })
  }
}
