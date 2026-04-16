import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const token = authHeader.replace("Bearer ", "")
    const backendUrl = process.env.MEDUSA_URL || "http://localhost:9000"

    const publishableKey = (req.headers["x-publishable-api-key"] as string) || process.env.MEDUSA_PUBLISHABLE_KEY || ""
    
    // 1. Get Customer ID
    const customerResponse = await fetch(`${backendUrl}/store/customers/me`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "x-publishable-api-key": publishableKey
      }
    })

    if (!customerResponse.ok) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const { customer } = await customerResponse.json()
    if (!customer?.id) {
       return res.status(400).json({ error: "Customer not found" })
    }

    // 2. Resolve Cart Module and securely query for this customer's active carts
    const cartModuleService = req.scope.resolve(Modules.CART)
    const carts = await cartModuleService.listCarts({
      customer_id: customer.id,
    })

    if (carts && carts.length > 0) {
      // Filter out completed carts and return the most recently updated cart
      const activeCarts = carts.filter((c: any) => !c.completed_at)
      if (activeCarts.length > 0) {
        const latestCart = activeCarts.sort((a: any, b: any) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime())[0]
        return res.json({ cart_id: latestCart.id })
      }
    }

    return res.json({ cart_id: null })
  } catch (error) {
    console.error("Error fetching latest cart:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}
