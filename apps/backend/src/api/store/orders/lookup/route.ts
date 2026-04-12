import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// query.graph() in Medusa v2 does not compute order totals — they are calculated
// dynamically and not stored as flat columns. We derive them from raw item/shipping data.
function computeOrderTotals(order: any): any {
  let item_subtotal = 0
  let item_discounts = 0

  for (const item of order.items || []) {
    const unit_price = item.unit_price ?? 0
    const quantity = item.quantity ?? 1
    const subtotal = unit_price * quantity
    const adjustment_total = (item.adjustments || []).reduce((sum: number, adj: any) => sum + (adj.amount ?? 0), 0)
    
    item.subtotal = subtotal
    item.total = subtotal - adjustment_total
    item_subtotal += subtotal
    item_discounts += adjustment_total
  }

  const shipping_total = (order.shipping_methods || []).reduce(
    (sum: number, sm: any) => sum + (sm.amount ?? 0),
    0
  )
  
  const shipping_discounts = (order.shipping_methods || []).reduce(
    (sum: number, sm: any) => sum + (sm.adjustments || []).reduce((s: number, a: any) => s + (a.amount ?? 0), 0),
    0
  )

  const discount_total = item_discounts + shipping_discounts

  order.subtotal = item_subtotal + shipping_total
  order.shipping_total = shipping_total
  order.discount_total = discount_total
  order.tax_total = 0
  order.total = order.subtotal - discount_total

  return order
}

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
      fields: ["*", "items.*", "items.adjustments.*", "shipping_address.*", "billing_address.*", "payment_collections.*", "payment_collections.payments.*", "shipping_methods.*", "shipping_methods.adjustments.*"],
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

    // Compute totals from raw item/shipping data since query.graph() doesn't return them
    computeOrderTotals(order)

    console.log(`[Order Lookup] Computed totals: subtotal=${order.subtotal}, total=${order.total}, shipping=${order.shipping_total}`)

    // Return the matching order
    res.json({ order })
  } catch (error) {
    console.error("Error looking up order:", error)
    res.status(500).json({ message: "Error looking up order" })
  }
}
