import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { email, password, firstName, lastName } = req.body as any

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" })
  }

  console.log(`[Guest Register] Processing registration for: ${email}`)

  try {
    const authModuleService = req.scope.resolve(Modules.AUTH) as any
    const customerModuleService = req.scope.resolve(Modules.CUSTOMER) as any
    const remoteLink = req.scope.resolve("remoteLink") as any

    // 1. Create or Get Customer
    let [customers] = await customerModuleService.listAndCountCustomers({ email })
    let customer
    
    if (customers.length > 0) {
      customer = customers[0]
      console.log(`[Guest Register] Found existing customer record for ${email}`)
    } else {
      customer = await customerModuleService.createCustomers({
        email,
        first_name: firstName || "",
        last_name: lastName || "",
      })
      console.log(`[Guest Register] Created new customer record for ${email}`)
    }

    // 2. Create Auth Identity with password
    // In Medusa v2 emailpass, entity_id is the email
    let authIdentity
    try {
      authIdentity = await authModuleService.createAuthIdentities({
        provider_id: "emailpass",
        entity_id: email,
        scope: "customer",
        provider_metadata: {
          password: password
        }
      })
      console.log(`[Guest Register] Created auth identity for ${email}`)
    } catch (authError: any) {
      console.error("[Guest Register] Auth identity creation error:", authError.message)
      if (authError.message.includes("already exists")) {
        return res.status(400).json({ message: "An account with this email already exists. Please log in." })
      }
      throw authError
    }

    // 3. Link Auth Identity to Customer
    // This uses the Link Module system
    try {
      await remoteLink.create({
        [Modules.AUTH]: {
          auth_identity_id: authIdentity.id,
        },
        [Modules.CUSTOMER]: {
          customer_id: customer.id,
        },
      })
      console.log(`[Guest Register] Successfully linked auth and customer for ${email}`)
    } catch (linkError: any) {
      console.error("[Guest Register] Linking error:", linkError.message)
      // If link exists, we ignore. Otherwise, this is a critical failure.
      if (!linkError.message.includes("already exists")) {
        throw linkError
      }
    }

    return res.status(200).json({ 
      success: true, 
      message: "Account created successfully! You can now log in."
    })

  } catch (error: any) {
    console.error(`[Guest Register] Final Catch Error for ${email}:`, error.message)
    return res.status(500).json({ 
      message: "Failed to register. Please try again.", 
      error: error.message 
    })
  }
}
