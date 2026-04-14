import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

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

  try {
    const authModuleService = req.scope.resolve(Modules.AUTH) as any
    const normalizedEmail = email.toLowerCase()

    // 1. Verify the old password by attempting authentication through the provider
    const { success: authSuccess } = await authModuleService.authenticate(
      "emailpass",
      {
        body: {
          email: normalizedEmail,
          password: old_password,
        },
      }
    )

    if (!authSuccess) {
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
