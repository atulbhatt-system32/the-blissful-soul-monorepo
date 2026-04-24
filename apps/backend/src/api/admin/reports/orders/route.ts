import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// HSN/SAC Code Mapping (same as invoice.ts)
const HSN_MAPPING: Record<string, string> = {
  "kundli": "9983",
  "astrology": "9983",
  "tarot": "9983",
  "counseling": "9983",
  "healing": "9983",
  "session": "9983",
  "reading": "9983",
  "consultation": "9983",
  "crystal": "7103",
  "gemstone": "7103",
  "jewelry": "7103",
  "book": "7103",
  "incense": "7103",
  "candle": "7103",
  "yoga": "7103",
  "meditation": "7103",
}

function getHSNCode(title: string, handle: string): string {
  const searchTerms = [title.toLowerCase(), handle.toLowerCase()]
  
  for (const term of searchTerms) {
    if (term.includes("kundli") || term.includes("astrology") || term.includes("birth chart")) {
      return HSN_MAPPING["kundli"]
    }
    if (term.includes("tarot")) {
      return HSN_MAPPING["tarot"]
    }
    if (term.includes("counseling") || term.includes("therapy") || term.includes("psychological")) {
      return HSN_MAPPING["counseling"]
    }
    if (term.includes("healing") || term.includes("reiki") || term.includes("energy")) {
      return HSN_MAPPING["healing"]
    }
    if (term.includes("session") || term.includes("reading") || term.includes("consultation")) {
      return HSN_MAPPING["session"]
    }
    if (term.includes("crystal") || term.includes("stone")) {
      return HSN_MAPPING["crystal"]
    }
    if (term.includes("gem")) {
      return HSN_MAPPING["gemstone"]
    }
    if (term.includes("jewelry") || term.includes("pendant") || term.includes("ring")) {
      return HSN_MAPPING["jewelry"]
    }
    if (term.includes("book")) {
      return HSN_MAPPING["book"]
    }
    if (term.includes("incense") || term.includes("agarbatti")) {
      return HSN_MAPPING["incense"]
    }
    if (term.includes("candle")) {
      return HSN_MAPPING["candle"]
    }
  }
  
  return "9983"
}

function computeNetTotal(order: any): number {
  let item_subtotal = 0
  let item_discounts = 0

  for (const item of order.items || []) {
    const unit_price = item.unit_price ?? 0
    const quantity = item.quantity ?? 1
    item_subtotal += unit_price * quantity
    item_discounts += (item.adjustments || []).reduce(
      (sum: number, adj: any) => sum + (adj.amount ?? 0),
      0
    )
  }

  const shipping_total = (order.shipping_methods || []).reduce(
    (sum: number, sm: any) => sum + (sm.amount ?? 0),
    0
  )
  const shipping_discounts = (order.shipping_methods || []).reduce(
    (sum: number, sm: any) =>
      sum + (sm.adjustments || []).reduce((s: number, a: any) => s + (a.amount ?? 0), 0),
    0
  )

  return item_subtotal + shipping_total - item_discounts - shipping_discounts
}

function formatCurrency(amount: number): string {
  return `₹${(amount / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")

  const { from, to } = req.query as { from?: string; to?: string }

  const filters: Record<string, any> = {}
  if (from || to) {
    filters.created_at = {}
    if (from) filters.created_at.$gte = new Date(from).toISOString()
    if (to) filters.created_at.$lte = new Date(to).toISOString()
  }

  try {
    let allOrders: any[] = []
    let offset = 0
    const take = 100

    while (true) {
      const { data: orders } = await (query as any).graph({
        entity: "order",
        fields: [
          "*",
          "items.*",
          "items.adjustments.*",
          "items.tax_lines.*",
          "shipping_methods.*",
          "shipping_methods.adjustments.*",
          "promotions.*",
        ],
        filters,
        pagination: { take, skip: offset },
      })

      if (!orders || orders.length === 0) break
      allOrders = allOrders.concat(orders)
      if (orders.length < take) break
      offset += take
    }

    // Determine customer type: first order by email = "new", else "returning"
    const emailFirstOrderDate: Record<string, string> = {}
    const sortedByDate = [...allOrders].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    for (const order of sortedByDate) {
      if (order.email && !(order.email in emailFirstOrderDate)) {
        emailFirstOrderDate[order.email] = order.created_at
      }
    }

    const headers = [
      "Date",
      "Order #",
      "N. Revenue (formatted)",
      "Status",
      "Customer",
      "Customer type",
      "Product(s)",
      "Items sold",
      "Coupon(s)",
      "HSN Code",
      "Net Sales",
    ]

    const rows = allOrders
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map((order) => {
        const netTotal = computeNetTotal(order)
        const netInRupees = netTotal / 100

        const customerName = [order.shipping_address?.first_name, order.shipping_address?.last_name]
          .filter(Boolean)
          .join(" ") || order.email || ""

        const isNew = emailFirstOrderDate[order.email] === order.created_at ? "new" : "returning"

        const products = (order.items || [])
          .map((item: any) => `${item.quantity}× ${item.title}`)
          .join(", ")

        const itemCount = (order.items || []).reduce(
          (sum: number, item: any) => sum + (item.quantity ?? 1),
          0
        )

        const coupons = (order.promotions || [])
          .map((p: any) => p.code)
          .filter(Boolean)
          .join(", ")

        // Get HSN codes for all items
        const hsnCodes = (order.items || [])
          .map((item: any) => getHSNCode(item.title || "", item.handle || ""))
          .filter((code, index, arr) => arr.indexOf(code) === index) // unique codes
          .join(", ")

        return [
          new Date(order.created_at).toISOString().replace("T", " ").substring(0, 19),
          String(order.display_id),
          formatCurrency(netTotal),
          order.status,
          customerName,
          isNew,
          products,
          String(itemCount),
          coupons,
          hsnCodes,
          netInRupees.toFixed(2),
        ].map(escapeCSV)
      })

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")

    const filename = `medusa-orders-${new Date().toISOString().slice(0, 10)}.csv`
    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`)
    res.send(csv)
  } catch (error) {
    console.error("Error generating orders report:", error)
    res.status(500).json({ message: "Error generating orders report" })
  }
}
