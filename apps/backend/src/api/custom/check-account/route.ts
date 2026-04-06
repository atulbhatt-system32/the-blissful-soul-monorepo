import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const email = req.query.email as string

  if (!email) {
    return res.status(400).json({ message: "Email is required" })
  }

  try {
    const authModuleService = req.scope.resolve(Modules.AUTH) as any
    const customerModuleService = req.scope.resolve(Modules.CUSTOMER) as any
    
    // 1. Check if customer exists
    const [customers] = await customerModuleService.listAndCountCustomers({ email })
    
    if (customers.length === 0) {
      return res.status(200).json({ exists: false })
    }

    // 2. Check if an emailpass identity exists for this email
    // In Medusa v2 emailpass, entity_id is the email
    const [identities] = await authModuleService.listAndCountAuthIdentities({
      provider_id: "emailpass",
      entity_id: email 
    })

    return res.status(200).json({ exists: identities.length > 0 })
    
  } catch (error: any) {
    console.error("[Check Account] Error:", error.message)
    return res.status(200).json({ exists: false })
  }
}
