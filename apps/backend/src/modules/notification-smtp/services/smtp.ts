import { 
  AbstractNotificationProviderService, 
} from "@medusajs/framework/utils"
import { 
  ProviderSendNotificationDTO, 
  ProviderSendNotificationResultsDTO, 
} from "@medusajs/framework/types"
import nodemailer from "nodemailer"

export default class SmtpNotificationService extends AbstractNotificationProviderService {
  static identifier = "google-smtp"
  protected transporter: nodemailer.Transporter

  constructor({ logger }: { logger: any }) {
    super()

    // 1. Initialize SMTP Transporter
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, 
      auth: {
        user: process.env.GOOGLE_SMTP_USER,
        pass: process.env.GOOGLE_SMTP_PASS, // App Password
      },
    })
  }

  async send(
    notification: ProviderSendNotificationDTO
  ): Promise<ProviderSendNotificationResultsDTO> {
    const { to, template, data, attachments } = notification
    console.log("[SMTP Provider] Attempting to send email to:", to)

    try {
      // 2. Prepare the email
      // Note: Medusa v2 will automatically store this notification in the DB history
      const mailOptions: any = {
        from: `The Blissful Soul <${process.env.GOOGLE_SMTP_USER}>`,
        to,
        subject: (data as any)?.subject || "Order Update - The Blissful Soul",
        html: (data as any)?.html_body || "<b>Your order has been updated.</b>",
        attachments: (data as any)?.pdf_attachments || []
      }
      
      console.log("[SMTP Provider] Mail options:", JSON.stringify(mailOptions, null, 2))

      // 3. Send email via Google SMTP
      const info = await this.transporter.sendMail(mailOptions)

      console.log(`[Notification Logging] Email successfully sent to ${to}. Message ID: ${info.messageId}`)
      
      return {} 
    } catch (error) {
      console.error(`[Notification Logging] Failed to send email to ${to}:`, error.message)
      throw error
    }
  }
}
