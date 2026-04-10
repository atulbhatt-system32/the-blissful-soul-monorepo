import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import crypto from "crypto"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { email } = req.body as { email: string }

  if (!email) {
    return res.status(400).json({ message: "Email is required" })
  }

  try {
    console.log(`[Password Reset Proxy] Initiating reset for: ${email}`)
    
    const customerModuleService = req.scope.resolve(Modules.CUSTOMER) as any
    const notificationModuleService = req.scope.resolve(Modules.NOTIFICATION) as any

    // 1. Fetch customer by email
    const [customers] = await customerModuleService.listAndCountCustomers({
      email: email.toLowerCase()
    })

    if (!customers || customers.length === 0) {
      console.log(`[Password Reset Proxy] No customer found for ${email}.`)
      return res.status(200).json({ success: true, message: "If an account matches, an email was sent." })
    }

    const customer = customers[0]
    console.log(`[Password Reset Proxy] Found customer id: ${customer.id}`)

    // 2. Generate token and expiry
    const token = crypto.randomBytes(32).toString('hex')
    const expiry = new Date()
    expiry.setMinutes(expiry.getMinutes() + 15)

    // 3. Save token to customer metadata
    try {
      await customerModuleService.updateCustomers(customer.id, {
        metadata: {
          ...(customer.metadata || {}),
          reset_token: token,
          reset_expiry: expiry.toISOString()
        }
      })
      console.log(`[Password Reset Proxy] Reset token saved to customer metadata.`)
    } catch (updateError: any) {
      console.error(`[Password Reset Proxy] Customer update error:`, updateError.message)
      throw new Error(`DB Error: ${updateError.message}`)
    }
    
    // 4. Construct Content
    const storefrontUrl = process.env.STOREFRONT_URL || 'http://localhost:8001'
    const resetUrl = `${storefrontUrl}/account/reset-password?token=${token}&email=${email}`

    const htmlBody = `
      <div style="font-family: 'Inter', sans-serif; background-color: #FBFAF8; padding: 40px; color: #110E17; max-width: 600px; margin: 0 auto; border: 1px solid #E1DFE3; border-radius: 24px;">
         <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-family: 'Cormorant Garamond', serif; font-size: 28px; color: #2C1E36; margin-bottom: 5px;">The Blissful Soul</h1>
            <p style="text-transform: uppercase; font-size: 10px; letter-spacing: 0.3em; color: #C5A059; margin-top: 0;">HEALING & CRYSTALS</p>
         </div>
         <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 20px;">Reset Your Password</h2>
         <p style="font-size: 14px; line-height: 1.6; color: #665D6B; margin-bottom: 30px;">
            We received a request to reset the password for your Blissful Soul account. Click the button below to choose a new one.
         </p>
         <div style="text-align: center; margin-bottom: 40px;">
            <a href="${resetUrl}" style="background-color: #2C1E36; color: #FBFAF8; padding: 14px 32px; border-radius: 9999px; text-decoration: none; font-size: 14px; font-weight: 700; display: inline-block;">
               Reset My Password
            </a>
         </div>
      </div>
    `

    // 5. Trigger Notification
    try {
      console.log(`[Password Reset Proxy] Attempting to create notification via ${Modules.NOTIFICATION}...`)
      await notificationModuleService.createNotifications({
          to: email,
          channel: "email",
          template: "password-reset",
          data: {
            subject: "Reset Your Blissful Soul Password",
            html_body: htmlBody
          },
      })
      console.log(`[Password Reset Proxy] Notification created successfully.`)
    } catch (notifError: any) {
      console.error(`[Password Reset Proxy] Notification error:`, notifError.message)
      throw new Error(`Email Error: ${notifError.message}`)
    }

    return res.status(200).json({ success: true, message: "Reset email process completed." })
  } catch (error: any) {
    console.error("[Password Reset Proxy] Critical Failure:", error.message)
    return res.status(500).json({ 
      message: "Failed to process reset request via backend proxy.",
      error: error.message 
    })
  }
}
