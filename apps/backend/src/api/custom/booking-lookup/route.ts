import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const email = req.query.email as string
  const displayId = req.query.displayId as string

  if (!email || !displayId) {
    return res.status(400).json({ message: "Email and Booking ID are required" })
  }

  try {
    const orderModuleService = req.scope.resolve(Modules.ORDER) as any

    // Find the specific order by display_id (Booking ID)
    // In Medusa v2, we list with filter on display_id
    const [orders] = await orderModuleService.listAndCountOrders(
      { 
        display_id: parseInt(displayId),
        email: email
      },
      { 
        relations: ["items"],
      }
    )

    if (orders.length === 0) {
      return res.status(404).json({ message: "No session found with these details." })
    }

    const order = orders[0]

    // Verify it's a session (security measure)
    if (order.metadata?.is_session !== true) {
      return res.status(404).json({ message: "This booking ID is not a healing session." })
    }

    // Map to the same structure as history API
    const session = {
      id: order.id,
      display_id: order.display_id,
      email: order.email,
      booking_date: order.metadata?.booking_date || "",
      booking_time: order.metadata?.booking_time || "",
      razorpay_id: order.metadata?.razorpay_id || "",
      cal_booking_id: order.metadata?.cal_booking_id || "",
      event_slug: order.metadata?.cal_event_slug || "",
      status: order.status,
      created_at: order.created_at,
      items: order.items?.map((item: any) => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        product_id: item.product_id,
      })) || [],
    }

    return res.status(200).json({ session })
  } catch (error: any) {
    console.error("[Booking Lookup] Error:", error.message)
    return res.status(500).json({ message: "Lookup failed", error: error.message })
  }
}
