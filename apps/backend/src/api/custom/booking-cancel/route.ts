import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { orderId, email } = req.body as { orderId: string, email: string }

  if (!orderId || !email) {
    return res.status(400).json({ message: "Order ID and email are required" })
  }

  try {
    const orderModuleService = req.scope.resolve(Modules.ORDER) as any
    const notificationService = req.scope.resolve("notification") as any

    // 1. Fetch the order
    const order = await orderModuleService.retrieveOrder(orderId)

    if (!order || order.email !== email) {
      return res.status(404).json({ message: "Order not found" })
    }

    if (order.status === "canceled") {
      return res.status(400).json({ message: "This session is already canceled" })
    }

    // 2. Check cancellation policy (24 hours notice)
    const bookingDate = order.metadata?.booking_date
    const bookingTime = order.metadata?.booking_time
    
    if (bookingDate && bookingTime) {
      // Parse "10:30 AM" into hours and minutes
      const [time, modifier] = bookingTime.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;

      // Create Date object for session start explicitly in IST (+05:30)
      const sessionDate = new Date(`${bookingDate}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00+05:30`);
      const now = new Date();
      const diffInHours = (sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (diffInHours < 24) {
        return res.status(400).json({ 
          message: "Cancellations must be requested at least 24 hours before the session start time." 
        })
      }
    }

    // 3. Cancel on Cal.com if ID exists
    const calBookingId = order.metadata?.cal_booking_id
    if (calBookingId) {
      try {
        const calApiKey = process.env.CAL_API_KEY
        await fetch(`https://api.cal.com/v2/bookings/${calBookingId}/cancel`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${calApiKey}`,
            "cal-api-version": "2024-08-13",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cancellationReason: "Cancelled by customer via dashboard" })
        })
        console.log(`[Booking Cancel] Cal.com event ${calBookingId} cancelled.`)
      } catch (calErr: any) {
        console.error(`[Booking Cancel] Failed to cancel Cal.com event:`, calErr.message)
        // We continue even if Cal.com fails, but we log it
      }
    }

    // 4. Update Medusa Order Status
    await orderModuleService.updateOrders([{
      id: order.id,
      status: "canceled",
      metadata: {
        ...order.metadata,
        canceled_at: new Date().toISOString(),
        canceled_by: "customer"
      }
    }])

    // 5. Notify Customer & Admin
    const notificationData = {
      channel: "email",
      template: "booking-cancelled",
      data: {
        subject: `Session Cancelled - #${order.display_id}`,
        customerName: order.shipping_address?.first_name || "Customer",
        bookingDate,
        bookingTime,
        orderId: order.display_id,
        html_body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #fff; border: 1px solid #eee; border-radius: 8px;">
            <h1 style="color: #e53e3e;">Session Cancelled ❌</h1>
            <p>Your session booking for <strong>${bookingDate} at ${bookingTime}</strong> has been successfully cancelled.</p>
            <p>If a refund is applicable, our team will process it within 5-7 business days.</p>
            <p>Thank you,</p>
            <p>The Blissful Soul</p>
          </div>
        `
      }
    }

    const adminEmails = [...new Set([
      process.env.ADMIN_NOTIFICATION_EMAIL,
      process.env.GOOGLE_SMTP_USER,
    ].filter(Boolean) as string[])]

    await notificationService.createNotifications([
      { ...notificationData, to: order.email },
      ...adminEmails.map((adminEmail: string) => ({
        ...notificationData,
        to: adminEmail,
        data: {
          ...notificationData.data,
          subject: `[ADMIN ALERT] Session Cancelled by Customer - #${order.display_id}`,
          html_body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #fff5f5; border-radius: 8px;">
              <h2>Cancellation Alert</h2>
              <p>Customer <strong>${order.email}</strong> has cancelled their session.</p>
              <ul>
                <li><strong>Order:</strong> #${order.display_id}</li>
                <li><strong>Planned Time:</strong> ${bookingDate} ${bookingTime}</li>
              </ul>
              <p>Please process any necessary refunds in Razorpay.</p>
            </div>
          `
        }
      })),
    ])

    return res.status(200).json({ success: true, message: "Booking cancelled successfully." })
  } catch (error: any) {
    console.error("[Booking Cancel] Error:", error.message)
    return res.status(500).json({ message: "Failed to cancel booking", error: error.message })
  }
}
