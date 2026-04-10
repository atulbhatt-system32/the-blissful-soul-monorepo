import { 
  type SubscriberConfig, 
  type SubscriberArgs,
} from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function passwordResetHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {
  console.log(`[PASSWORD RESET HANDLER] TRIGGERED with data: ${JSON.stringify(data)}`)
  const notificationService = container.resolve("notification")
  console.log(`[PASSWORD RESET HANDLER] TRIGGERED with data: ${JSON.stringify(data)}`)

  // 1. Extract email and token from the event data
  // Medusa V2 auth events use entity_id for the email/identifier
  const email = data.email || data.identifier || data.entity_id
  const token = data.token
  
  if (!email || !token) {
    console.error("[Password Reset] Missing email or token in event data.")
    return
  }

  // 2. Safety check: verify the customer exists before sending the email
  try {
    const customerModuleService = container.resolve(Modules.CUSTOMER)
    const customers = await customerModuleService.listCustomers({
      email: [email.toLowerCase()]
    })

    if (!customers || customers.length === 0) {
      console.log(`[Password Reset] No customer found for ${email}. Skipping.`)
      return
    }
  } catch (err: any) {
    console.error(`[Password Reset] Error checking customer: ${err.message}`)
    return
  }

  // 3. Prepare the reset URL (Storefront runs on 8001)
  const storefrontUrl = process.env.STOREFRONT_URL || 'http://localhost:8001'
  const resetUrl = `${storefrontUrl}/account/reset-password?token=${token}&email=${email}`

  // 4. Create email body
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
          <a href="${resetUrl}" style="background-color: #2C1E36; color: #FBFAF8; padding: 14px 32px; border-radius: 9999px; text-decoration: none; font-size: 14px; font-weight: 700; display: inline-block; box-shadow: 0 4px 10px rgba(44, 30, 54, 0.2);">
             Reset My Password
          </a>
       </div>
       
       <p style="font-size: 12px; line-height: 1.5; color: #A19AA4;">
          If you didn't request this, you can safely ignore this email. This reset link will remain active for 15 minutes.
       </p>
       
       <hr style="border: none; border-top: 1px solid #E1DFE3; margin: 30px 0;" />
       
       <p style="font-size: 11px; text-align: center; color: #A19AA4; text-transform: uppercase; letter-spacing: 0.1em;">
          © ${new Date().getFullYear()} The Blissful Soul. All rights reserved.
       </p>
    </div>
  `

  // 5. Send the notification (matches booking confirmation pattern)
  await (notificationService as any).createNotifications([
    {
      to: email,
      channel: "email",
      template: "password-reset",
      data: {
        subject: "Reset Your Blissful Soul Password",
        html_body: htmlBody
      },
    },
    {
      to: "mratulbhatt97@gmail.com",
      channel: "email",
      template: "password-reset-admin-alert",
      data: {
        subject: `[ADMIN ALERT] Password Reset Requested - ${email}`,
        html_body: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background: #fff5f5; border-radius: 8px;">
            <h2>Security Alert: Password Reset</h2>
            <p>A password reset link was just sent to: <strong>${email}</strong></p>
            <p>If this was not expected, please check your user management.</p>
          </div>
        `
      }
    }
  ])
}

export const config: SubscriberConfig = {
  event: ["auth.password_reset", "customer.password_reset", "user.password_reset"],
}
