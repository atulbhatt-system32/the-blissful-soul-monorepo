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

    const normalizedEmail = email.toLowerCase()

    // 3. Update password via the emailpass provider which handles hashing (scrypt-kdf).
    //    updateProvider calls the provider's update() method, which hashes the password
    //    and stores it in provider_metadata.password on the ProviderIdentity.
    const { success: updateSuccess } = await (authModuleService as any).updateProvider(
      "emailpass",
      { entity_id: normalizedEmail, password }
    )

    const remoteLink = req.scope.resolve("remoteLink") as any

    if (!updateSuccess) {
      // 4a. Guest User Upgrade: No emailpass ProviderIdentity exists yet.
      //     Create the AuthIdentity with the correct structure, then immediately
      //     call updateProvider so the password is hashed by the provider.
      const newAuthIdentity = await (authModuleService as any).createAuthIdentities({
        provider_identities: [
          {
            entity_id: normalizedEmail,
            provider: "emailpass",
          },
        ],
      })

      // Now set the password through the provider so it is properly hashed
      await (authModuleService as any).updateProvider("emailpass", {
        entity_id: normalizedEmail,
        password,
      })

      // Set app_metadata.customer_id so Medusa can build a valid JWT (actor_id).
      // Without this, login succeeds but the token has actor_id: "" and
      // GET /store/customers/me returns 401.
      await (authModuleService as any).updateAuthIdentities({
        id: newAuthIdentity.id,
        app_metadata: { customer_id: customer.id },
      })

      try {
        await remoteLink.create({
          [Modules.AUTH]: { auth_identity_id: newAuthIdentity.id },
          [Modules.CUSTOMER]: { customer_id: customer.id }
        })
      } catch (linkError: any) {
        // Safe to ignore if the link already exists
      }
      console.log(`[Password Reset Update] Guest user upgraded to registered user: ${email}`)
    } else {
      // 4b. Auth identity exists. Ensure app_metadata.customer_id is set —
      //     it may be missing for users whose auth identity was created by older
      //     broken code (missing link causes actor_id: "" in the JWT).
      const [existingIdentities] = await (authModuleService as any).listAndCountAuthIdentities(
        { provider_identities: { entity_id: normalizedEmail, provider: "emailpass" } },
        { relations: ["provider_identities"] }
      )
      const existingIdentity = existingIdentities?.[0]
      if (existingIdentity && !existingIdentity.app_metadata?.customer_id) {
        await (authModuleService as any).updateAuthIdentities({
          id: existingIdentity.id,
          app_metadata: { customer_id: customer.id },
        })
        try {
          await remoteLink.create({
            [Modules.AUTH]: { auth_identity_id: existingIdentity.id },
            [Modules.CUSTOMER]: { customer_id: customer.id }
          })
        } catch (linkError: any) {
          // Safe to ignore if the link already exists
        }
        console.log(`[Password Reset Update] Fixed missing customer link for: ${email}`)
      }
      console.log(`[Password Reset Update] Updated existing password for: ${email}`)
    }

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
