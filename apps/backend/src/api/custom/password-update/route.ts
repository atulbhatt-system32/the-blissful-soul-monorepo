import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { emailVariants } from "../../../lib/email"
import { validatePassword } from "../../../lib/password"

/**
 * POST /custom/password-update
 * 
 * Updates a logged-in customer's password after verifying their current password.
 * Expects: { email, old_password, new_password }
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { email, old_password, new_password } = req.body as any

  if (!email || !old_password || !new_password) {
    return res.status(400).json({
      message: "Email, current password, and new password are required.",
    })
  }

  if (new_password === old_password) {
    return res.status(400).json({
      message: "New password must be different from your current password.",
    })
  }

  const weakPassword = validatePassword(new_password)
  if (weakPassword) {
    return res.status(400).json({ message: weakPassword })
  }

  try {
    const authModuleService = req.scope.resolve(Modules.AUTH) as any

    // 1. Verify the old password by attempting authentication through the provider.
    //    entity_id keeps the casing used at registration, so try the submitted
    //    form before the lowercased one rather than assuming normalisation.
    let normalizedEmail = ""

    for (const candidate of emailVariants(email)) {
      const { success } = await authModuleService.authenticate("emailpass", {
        body: { email: candidate, password: old_password },
      })

      if (success) {
        normalizedEmail = candidate
        break
      }
    }

    if (!normalizedEmail) {
      return res.status(400).json({
        message: "Current password is incorrect.",
      })
    }

    // 2. Update to the new password via the emailpass provider
    //    This calls the provider's update() method which hashes the password properly
    const { success: updateSuccess } = await authModuleService.updateProvider(
      "emailpass",
      {
        entity_id: normalizedEmail,
        password: new_password,
      }
    )

    if (!updateSuccess) {
      return res.status(500).json({
        message: "Failed to update password. Please try again.",
      })
    }

    console.log(`[Password Update] Password updated successfully for: ${normalizedEmail}`)
    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    })
  } catch (error: any) {
    console.error("[Password Update] Error:", error.message)
    return res.status(500).json({
      message: "Failed to update password.",
      error: error.message,
    })
  }
}
