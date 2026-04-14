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
    
    // Auth Identity check
    let authExists = false
    try {
      const authIdentities = await authModuleService.listAuthIdentities({
        provider_identities: { 
          entity_id: email, 
          provider_id: "emailpass" 
        }
      })
      if (authIdentities && authIdentities.length > 0) authExists = true
    } catch (e) {}

    // Customer check
    let customerHasAccount = false
    try {
      const customers = await customerModuleService.listCustomers({ email })
      if (customers && customers.length > 0) {
        // Customer exists, check if they have has_account flag set to true
        customerHasAccount = customers.some((c: any) => c.has_account === true)
      }
    } catch (e) {}

    console.log(`[Check Account] Email: ${email} | Auth Exists: ${authExists} | Customer has_account: ${customerHasAccount}`)
    
    // It's considered an existing account if EITHER the auth identity exists 
    // OR the customer profile has the has_account flag explicitly set
    return res.status(200).json({ exists: authExists || customerHasAccount })

  } catch (error: any) {
    console.error("[Check Account] Error:", error.message)
    return res.status(200).json({ exists: false })
  }
}
