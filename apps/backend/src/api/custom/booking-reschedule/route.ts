import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { orderId, email, newDate, newTime, slotIsoStart } = req.body as { 
    orderId: string, 
    email: string,
    newDate: string,
    newTime: string,
    slotIsoStart: string
  }

  if (!orderId || !email || !newDate || !newTime || !slotIsoStart) {
    return res.status(400).json({ message: "Missing required rescheduling data" })
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
      return res.status(400).json({ message: "Cannot reschedule a canceled session" })
    }

    // 2. Check policy (24 hours notice for rescheduling)
    const oldDate = order.metadata?.booking_date
    const oldTime = order.metadata?.booking_time
    
    if (oldDate && oldTime) {
      const [time, modifier] = oldTime.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;

      const sessionDate = new Date(`${oldDate}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00+05:30`);
      const now = new Date();
      const diffInHours = (sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (diffInHours < 24) {
        return res.status(400).json({ 
          message: "Rescheduling must be done at least 24 hours before the original session start time." 
        })
      }
    }

    // 3. Reschedule on Cal.com if ID exists
    const calBookingId = order.metadata?.cal_booking_id
    let calMeetUrl = order.metadata?.cal_meet_url

    if (calBookingId) {
      try {
        const calApiKey = process.env.CAL_API_KEY
        const rescheduleRes = await fetch(`https://api.cal.com/v2/bookings/${calBookingId}/reschedule`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${calApiKey}`,
            "cal-api-version": "2024-08-13",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            start: slotIsoStart,
            reason: "Rescheduled by customer via dashboard" 
          })
        })
        
        const rescheduleData = await rescheduleRes.json()
        
        // Fetch the updated booking to get the meet url if it's not in the reschedule response
        // Usually, the meet link remains the same for the booking ID, but it's safer to check
        if (rescheduleData?.data?.meetingUrl) {
          calMeetUrl = rescheduleData.data.meetingUrl
        } else {
          const bookingRes = await fetch(`https://api.cal.com/v2/bookings/${calBookingId}`, {
            headers: {
              "Authorization": `Bearer ${calApiKey}`,
              "cal-api-version": "2024-08-13",
            }
          })
          const bookingData = await bookingRes.json()
          calMeetUrl = bookingData?.data?.meetingUrl || bookingData?.data?.location
        }

        console.log(`[Booking Reschedule] Cal.com event ${calBookingId} rescheduled. Meet URL: ${calMeetUrl}`)
      } catch (calErr: any) {
        console.error(`[Booking Reschedule] Failed to reschedule Cal.com event:`, calErr.message)
      }
    }

    // 4. Update Medusa Order Metadata
    await orderModuleService.updateOrders([{
      id: order.id,
      metadata: {
        ...order.metadata,
        booking_date: newDate,
        booking_time: newTime,
        cal_meet_url: calMeetUrl, // Store the (possibly updated) URL
        rescheduled_at: new Date().toISOString(),
        original_date: oldDate,
        original_time: oldTime
      }
    }])

    // 5. Notify Customer & Admin
    const notificationData = {
      channel: "email",
      template: "booking-rescheduled",
      data: {
        subject: `Session Rescheduled - #${order.display_id}`,
        customerName: order.shipping_address?.first_name || "Customer",
        oldDate,
        oldTime,
        newDate,
        newTime,
        calMeetUrl,
        orderId: order.display_id,
        html_body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #fff; border: 1px solid #eee; border-radius: 8px;">
            <h1 style="color: #3182ce;">Session Rescheduled 🗓️</h1>
            <p>Your session has been moved to a new time slot.</p>
            <div style="background: #ebf8ff; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <p style="margin: 5px 0;"><strong>New Time:</strong> ${newDate} at ${newTime}</p>
              <p style="margin: 5px 0; color: #718096; font-size: 13px;">Original Time: ${oldDate} at ${oldTime}</p>
            </div>
            
            ${calMeetUrl ? `
            <div style="margin: 25px 0; text-align: center;">
              <p style="margin-bottom: 15px; color: #4a5568;">You can join the session using the button below at the scheduled time:</p>
              <a href="${calMeetUrl}" style="background-color: #3182ce; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Join Meeting</a>
              <p style="margin-top: 10px; font-size: 11px; color: #a0aec0;">Link: ${calMeetUrl}</p>
            </div>
            ` : ""}

            <p>See you then!</p>
            <p>The Blissful Soul</p>
          </div>
        `
      }
    }

    await notificationService.createNotifications([
      { ...notificationData, to: order.email },
      { 
        ...notificationData, 
        to: "mratulbhatt97@gmail.com",
        data: {
          ...notificationData.data,
          subject: `[ADMIN ALERT] Session Rescheduled - #${order.display_id}`,
          html_body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 8px; background: #f0fff4;">
              <h2>Reschedule Alert</h2>
              <p>Customer <strong>${order.email}</strong> has rescheduled their session.</p>
              <ul>
                <li><strong>Order:</strong> #${order.display_id}</li>
                <li><strong>New Time:</strong> ${newDate} at ${newTime}</li>
                <li><strong>Original Time:</strong> ${oldDate} at ${oldTime}</li>
              </ul>
            </div>
          `
        }
      }
    ])

    return res.status(200).json({ success: true, message: "Booking rescheduled successfully." })
  } catch (error: any) {
    console.error("[Booking Reschedule] Error:", error.message)
    return res.status(500).json({ message: "Failed to reschedule booking", error: error.message })
  }
}
