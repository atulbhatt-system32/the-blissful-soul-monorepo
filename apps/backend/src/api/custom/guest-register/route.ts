import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { email, password, firstName, lastName } = req.body as any

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" })
  }

  console.log(`[Guest Register] Processing registration for: ${email}`)

  try {
    // Step 1: Use Medusa's built-in auth registration endpoint
    // This correctly hashes the password and creates auth identity
    const registerRes = await fetch(`http://localhost:9000/auth/customer/emailpass/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const registerData = await registerRes.json()
    console.log(`[Guest Register] Auth register response:`, registerData)

    if (!registerRes.ok) {
      // If account already exists
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

    // Step 2: Create customer profile linked to the new auth identity
    // Get publishable key: try request header, env var, or fetch from API key module
    let publishableKey = (req.headers["x-publishable-api-key"] as string) || process.env.MEDUSA_PUBLISHABLE_KEY || ""
    
    if (!publishableKey) {
      // Fallback: fetch from API key module
      try {
        const apiKeyModule = req.scope.resolve("api_key") as any
        const [keys] = await apiKeyModule.listApiKeys({ type: "publishable" })
        if (keys && keys.length > 0) {
          publishableKey = keys[0].token
          console.log(`[Guest Register] Retrieved publishable key from database`)
        }
      } catch (e) {
        console.warn("[Guest Register] Could not fetch publishable key from database")
      }
    }
    
    if (!publishableKey) {
      console.error("[Guest Register] No publishable key available — customer profile will fail")
    }
    
    const customerRes = await fetch(`http://localhost:9000/store/customers`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "x-publishable-api-key": publishableKey,
      },
      body: JSON.stringify({
        email,
        first_name: firstName || "",
        last_name: lastName || "",
      }),
    })

    if (customerRes.ok) {
      console.log(`[Guest Register] Customer profile created for ${email}`)
    } else {
      const customerData = await customerRes.json()
      console.warn(`[Guest Register] Customer creation warning for ${email}:`, customerData.message)
      // Not fatal - auth is set up, user can still log in
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
