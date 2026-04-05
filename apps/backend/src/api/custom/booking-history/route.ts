import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const email = req.query.email as string

  if (!email) {
    return res.status(400).json({ message: "Email is required" })
  }

  try {
    const orderModuleService = req.scope.resolve(Modules.ORDER) as any

    // Fetch all orders for this email
    const orders = await orderModuleService.listOrders(
      { email },
      { 
        order: { created_at: "DESC" },
        relations: ["items"],
      }
    )

    // Filter to only session bookings (orders with is_session metadata)
    const sessionOrders = orders.filter(
      (o: any) => o.metadata?.is_session === true
    )

    // Map to a clean response
    const sessions = sessionOrders.map((order: any) => ({
      id: order.id,
      display_id: order.display_id,
      email: order.email,
      booking_date: order.metadata?.booking_date || "",
      booking_time: order.metadata?.booking_time || "",
      razorpay_id: order.metadata?.razorpay_id || "",
      status: order.status,
      created_at: order.created_at,
      items: order.items?.map((item: any) => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })) || [],
    }))

    return res.status(200).json({ sessions })
  } catch (error: any) {
    console.error("[Booking History] Error:", error.message)
    return res.status(500).json({ message: "Failed to fetch booking history", error: error.message })
  }
}
