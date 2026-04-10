import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const email = req.query.email as string

  if (!email) {
    return res.status(400).json({ message: "Email is required" })
  }

  try {
    const customerModuleService = req.scope.resolve(Modules.CUSTOMER) as any
    
    // Check if a customer with this email exists
    const [customers] = await customerModuleService.listAndCountCustomers({ email })
    
    if (customers.length > 0) {
      console.log(`[Check Account] Metadata for ${email}:`, JSON.stringify(customers[0].metadata, null, 2))
    }
    
    return res.status(200).json({ exists: customers.length > 0, metadata: customers[0]?.metadata })
    
  } catch (error: any) {
    console.error("[Check Account] Error:", error.message)
    return res.status(200).json({ exists: false })
  }
}
