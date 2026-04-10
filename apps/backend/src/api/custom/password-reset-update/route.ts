import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { email, token, password } = req.body as any

  if (!email || !token || !password) {
    return res.status(400).json({ message: "Email, token, and new password are required." })
  }

  try {
    const customerModuleService = req.scope.resolve(Modules.CUSTOMER)
    const authModuleService = req.scope.resolve(Modules.AUTH)

    // 1. Find Customer
    const [customers] = await (customerModuleService as any).listAndCountCustomers({
      email: email.toLowerCase()
    })

    if (!customers || customers.length === 0) {
      return res.status(400).json({ message: "Invalid reset attempt." })
    }

    const customer = customers[0]
    
    console.log(`[Password Reset Update] validating token for: ${email}`)

    // 2. Verify Token and Expiry securely
    const resetToken = customer.metadata?.reset_token
    const resetExpiry = customer.metadata?.reset_expiry

    if (!resetToken || resetToken !== token) {
      console.log(`[Password Reset Update] Token mismatch.`)
      return res.status(400).json({ message: "Invalid or expired reset token." })
    }

    if (resetExpiry) {
      const expiry = new Date(resetExpiry as string)
      if (new Date() > expiry) {
        return res.status(400).json({ message: "This password reset link has expired." })
      }
    } else {
      return res.status(400).json({ message: "Invalid reset token structure." })
    }

    // 3. Find Auth Identity
    const identities = await (authModuleService as any).listAuthIdentities({
      provider_identities: {
        entity_id: email.toLowerCase()
      }
    })

    if (!identities || identities.length === 0 || !identities[0]?.id) {
      return res.status(400).json({ message: "No valid email/password configured for this account.", details: identities })
    }

    // 4. Update the password
    await (authModuleService as any).updateAuthIdentities({
      id: identities[0].id,
      provider_metadata: {
        password: password
      }
    })

    // 5. Clear the token so it cannot be reused
    await customerModuleService.updateCustomers(customer.id, {
      metadata: {
        ...(customer.metadata || {}),
        reset_token: null,
        reset_expiry: null
      }
    })

    console.log(`[Password Reset Update] Success for ${email}`)
    return res.status(200).json({ success: true, message: "Password updated successfully." })
  } catch (error: any) {
    console.error("[Password Reset Update Proxy] Critical Error:", error.message)
    return res.status(500).json({ message: "Failed to update password.", error: error.message })
  }
}
