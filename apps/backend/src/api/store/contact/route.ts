import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { name, email, phone, regarding, message } = req.body as {
    name: string
    email: string
    phone?: string
    regarding: string
    message: string
  }

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Name, email, and message are required" })
  }

  const adminEmail = process.env.GOOGLE_SMTP_USER 

  try {
    const notificationModuleService = req.scope.resolve(Modules.NOTIFICATION) as any
    
    const htmlBodyAdmin = `
      <div style="font-family: 'Inter', sans-serif; background-color: #FBFAF8; padding: 40px; color: #110E17; max-width: 600px; margin: 0 auto; border: 1px solid #E1DFE3; border-radius: 24px;">
         <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-family: 'Cormorant Garamond', serif; font-size: 28px; color: #2C1E36; margin-bottom: 5px;">The Blissful Soul</h1>
            <p style="text-transform: uppercase; font-size: 10px; letter-spacing: 0.3em; color: #C5A059; margin-top: 0;">New Contact Inquiry</p>
         </div>
         <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 20px;">Contact Form Submission</h2>
         <div style="font-size: 14px; line-height: 1.6; color: #665D6B; margin-bottom: 30px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || "N/A"}</p>
            <p><strong>Regarding:</strong> ${regarding}</p>
            <div style="margin-top: 20px;">
              <p><strong>Message:</strong></p>
              <div style="background: #FFF; padding: 15px; border-radius: 8px; border: 1px solid #EEE;">
                ${message.replace(/\n/g, '<br/>')}
              </div>
            </div>
         </div>
         <div style="text-align: center; border-top: 1px solid #E1DFE3; pt: 20px; margin-top: 30px;">
            <p style="font-size: 12px; color: #9B949F;">
              Sent from The Blissful Soul Storefront
            </p>
         </div>
      </div>
    `

    // 1. Send to Admin
    await notificationModuleService.createNotifications({
      to: adminEmail,
      channel: "email",
      template: "contact-form-admin",
      data: {
        subject: `New Inquiry from ${name} - ${regarding}`,
        html_body: htmlBodyAdmin
      },
    })

    // 2. Send confirmation to User
    const htmlBodyUser = `
      <div style="font-family: 'Inter', sans-serif; background-color: #FBFAF8; padding: 40px; color: #110E17; max-width: 600px; margin: 0 auto; border: 1px solid #E1DFE3; border-radius: 24px;">
         <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-family: 'Cormorant Garamond', serif; font-size: 28px; color: #2C1E36; margin-bottom: 5px;">The Blissful Soul</h1>
            <p style="text-transform: uppercase; font-size: 10px; letter-spacing: 0.3em; color: #C5A059; margin-top: 0;">HEALING & CRYSTALS</p>
         </div>
         <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 20px;">Thank you for reaching out</h2>
         <p style="font-size: 14px; line-height: 1.6; color: #665D6B; margin-bottom: 30px;">
            Hello ${name},<br/><br/>
            We have received your message regarding <strong>${regarding}</strong>. 
            Our team will align with your inquiry and get back to you shortly.
         </p>
         <div style="background: #FFF; padding: 15px; border-radius: 8px; border: 1px solid #EEE; margin-bottom: 30px;">
            <p style="font-size: 12px; color: #9B949F; margin-bottom: 5px;">Your message:</p>
            <p style="font-size: 14px; color: #2C1E36;">${message.substring(0, 100)}${message.length > 100 ? '...' : ''}</p>
         </div>
         <div style="text-align: center; border-top: 1px solid #E1DFE3; pt: 20px; margin-top: 30px;">
            <p style="font-size: 12px; color: #9B949F;">
              Stay Blissful,<br/>
              The Blissful Soul Team
            </p>
         </div>
      </div>
    `

    await notificationModuleService.createNotifications({
      to: email,
      channel: "email",
      template: "contact-form-user",
      data: {
        subject: "We've received your inquiry - The Blissful Soul",
        html_body: htmlBodyUser
      },
    })

    return res.status(200).json({ success: true, message: "Message sent successfully" })
  } catch (error: any) {
    return res.status(500).json({ 
      message: "Failed to send message.",
      error: error.message 
    })
  }
}
