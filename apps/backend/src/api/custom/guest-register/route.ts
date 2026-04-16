import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { email, password, firstName, lastName } = req.body as any

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" })
  }

  const backendUrl = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
  console.log(`[Guest Register] Processing registration for: ${email}`)

  try {
    // Step 1: Use Medusa's built-in auth registration endpoint
    // We stay with fetch for auth because it handles the complex provider-specific hashing/identity logic
    const registerRes = await fetch(`${backendUrl}/auth/customer/emailpass/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const registerData = await registerRes.json()

    if (!registerRes.ok) {
      if (registerRes.status === 400 || registerData.message?.toLowerCase().includes("exists")) {
        return res.status(400).json({ 
          message: "An account with this email already exists. Please log in instead." 
        })
      }
      return res.status(registerRes.status).json({ 
        message: registerData.message || "Failed to create account." 
      })
    }

    const token = registerData.token
    if (!token) {
      throw new Error("No token returned from auth registration")
    }

    // Step 2: Create customer profile using Medusa's internal Customer Module
    // This is more efficient than making another HTTP call to ourselves
    try {
      const customerModuleService = req.scope.resolve(Modules.CUSTOMER)
      
      // Check if customer already exists (profile-wise)
      const [existing] = await customerModuleService.listCustomers({ email })
      
      if (!existing) {
        await customerModuleService.createCustomers({
          email,
          first_name: firstName || "",
          last_name: lastName || "",
        })
        console.log(`[Guest Register] Customer profile created for ${email}`)
      } else {
        console.log(`[Guest Register] Customer profile already exists for ${email}`)
      }
    } catch (customerError: any) {
      console.warn(`[Guest Register] Customer module warning for ${email}:`, customerError.message)
      // Custom registration is successful even if profile creation fails (user has auth identity now)
    }

    console.log(`[Guest Register] Successfully registered ${email}`)
    return res.status(200).json({ 
      success: true, 
      message: "Account created successfully! You can now log in.",
      token,
    })

  } catch (error: any) {
    console.error(`[Guest Register] Error for ${email}:`, error.message)
    return res.status(500).json({ 
      message: "Failed to register. Please try again.", 
      error: error.message 
    })
  }
}
