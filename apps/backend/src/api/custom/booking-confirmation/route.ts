import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

type BookingOrderPayload = {
  variantId: string
  email: string
  firstName: string
  lastName: string
  phone: string
  countryCode: string
  razorpayPaymentId: string
  bookingDate: string
  bookingTime: string
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const {
    email,
    firstName,
    phone,
    razorpayPaymentId,
    bookingDate,
    bookingTime,
  } = req.body as BookingOrderPayload

  if (!email || !razorpayPaymentId) {
    return res.status(400).json({ message: "Missing email or payment ID" })
  }

  try {
    console.log(
      `[Booking Confirmation] Sending email to ${email} for booking on ${bookingDate} at ${bookingTime} | Razorpay: ${razorpayPaymentId}`
    )

    const notificationService = req.scope.resolve("notification") as any
    await notificationService.createNotifications([
      {
        to: email,
        channel: "email",
        template: "booking-confirmed",
        data: {
          subject: `Session Booking Confirmed - The Blissful Soul`,
          html_body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #fafafa; border-radius: 8px;">
              <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 4px;">Booking Confirmed! ✓</h1>
              <p style="color: #555; font-size: 14px; margin-bottom: 24px;">The Blissful Soul</p>
              
              <p style="color: #333;">Hi <strong>${firstName}</strong>,</p>
              <p style="color: #333;">Your session booking has been confirmed. Here are your booking details:</p>
              
              <div style="background: #fff; border: 1px solid #e5e5e5; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #f0f0f0;">
                    <td style="padding: 10px 0; color: #666; font-size: 14px;">Date</td>
                    <td style="padding: 10px 0; color: #1a1a1a; font-weight: bold; text-align: right;">${bookingDate}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f0f0f0;">
                    <td style="padding: 10px 0; color: #666; font-size: 14px;">Time</td>
                    <td style="padding: 10px 0; color: #1a1a1a; font-weight: bold; text-align: right;">${bookingTime}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f0f0f0;">
                    <td style="padding: 10px 0; color: #666; font-size: 14px;">Payment ID</td>
                    <td style="padding: 10px 0; color: #1a1a1a; font-size: 12px; text-align: right;">${razorpayPaymentId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666; font-size: 14px;">Contact</td>
                    <td style="padding: 10px 0; color: #1a1a1a; text-align: right;">${phone}</td>
                  </tr>
                </table>
              </div>
              
              <p style="color: #333;">One of our masters will reach out to you soon to share session details and any preparation tips.</p>
              <p style="color: #333;">Thank you for trusting <strong>The Blissful Soul</strong> on your journey. 🙏</p>
              
              <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
              <p style="color: #999; font-size: 12px;">If you have any questions, please contact us at support@theblissfulsoil.com</p>
            </div>
          `,
        },
      },
    ])

    console.log(`[Booking Confirmation] Email sent successfully to ${email}`)
    return res.status(200).json({ success: true, message: "Confirmation email sent." })
  } catch (error: any) {
    console.error("[Booking Confirmation] Error:", error.message)
    return res.status(500).json({ message: "Failed to send confirmation email", error: error.message })
  }
}
