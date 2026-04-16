import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const token = authHeader.replace("Bearer ", "")
    const backendUrl = process.env.MEDUSA_URL || "http://localhost:9000"

    // Get customer from token
    const customerResponse = await fetch(`${backendUrl}/store/customers/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!customerResponse.ok) {
      return res.status(500).json({ error: "Failed to fetch customer" })
    }

    const customerData = await customerResponse.json()
    const customer = customerData.customer

    // Get wishlist from customer metadata
    const wishlist = customer?.metadata?.wishlist || []

    return res.json({ wishlist })
  } catch (error) {
    console.error("Error fetching wishlist:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const token = authHeader.replace("Bearer ", "")
    const backendUrl = process.env.MEDUSA_URL || "http://localhost:9000"
    const body = req.body as any || {}
    const { wishlist } = body

    if (!Array.isArray(wishlist)) {
      return res.status(400).json({ error: "Invalid wishlist format" })
    }

    // Get customer first
    const customerResponse = await fetch(`${backendUrl}/store/customers/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!customerResponse.ok) {
      return res.status(500).json({ error: "Failed to fetch customer" })
    }

    const customerData = await customerResponse.json()
    const customer = customerData.customer

    // Update customer metadata with wishlist
    const updateResponse = await fetch(`${backendUrl}/store/customers/me`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        metadata: {
          ...customer.metadata,
          wishlist,
        },
      }),
    })

    if (!updateResponse.ok) {
      return res.status(500).json({ error: "Failed to update wishlist" })
    }

    return res.json({ success: true, wishlist })
  } catch (error) {
    console.error("Error updating wishlist:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}
