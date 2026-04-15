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
    const productTitle = order.items?.[0]?.variant?.product?.title || "Session"
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
          <div style="font-family: 'Playfair Display', serif, Arial; max-width: 600px; margin: 0 auto; padding: 0; background: #fff; border: 1px solid #f0f0f0; border-radius: 12px; overflow: hidden;">
            <div style="background: #2C1E36; padding: 40px 20px; text-align: center;">
              <h1 style="color: #C5A059; margin: 0; font-size: 28px; letter-spacing: 1px;">Session Rescheduled 🗓️</h1>
            </div>
            
            <div style="padding: 30px; line-height: 1.6; color: #4A4A4A;">
              <p style="font-size: 16px;">Dear ${order.shipping_address?.first_name || "Customer"},</p>
              <p>Your session for <strong>${productTitle}</strong> (Order #${order.display_id}) has been successfully moved to a new time slot.</p>
              
              <div style="background: #F9F7F9; padding: 25px; border-left: 4px solid #C5A059; border-radius: 4px; margin: 25px 0;">
                <p style="margin: 0 0 10px 0; font-weight: bold; color: #2C1E36;">🗓️ New Appointment Time:</p>
                <p style="margin: 0; font-size: 18px; color: #2C1E36;">${newDate} at ${newTime}</p>
                <p style="margin: 10px 0 0 0; color: #888; font-size: 13px;">Original Time: ${oldDate} at ${oldTime}</p>
              </div>
              
              ${calMeetUrl ? `
              <div style="margin: 35px 0; text-align: center; border-top: 1px solid #EEE; pt-30px;">
                <p style="margin-bottom: 20px; color: #4A4A4A; font-size: 15px;">You can join your session directly using the link below:</p>
                <a href="${calMeetUrl}" style="background-color: #C5A059; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px; box-shadow: 0 4px 12px rgba(197, 160, 89, 0.2);">Join Live Session</a>
                <p style="margin-top: 15px; font-size: 12px; color: #999;">Meeting ID/Link: ${calMeetUrl}</p>
              </div>
              ` : `
              <div style="margin: 25px 0; padding: 15px; background: #FFF9EB; border: 1px solid #FFE6A8; border-radius: 8px; color: #856404; font-size: 14px;">
                <strong>Note:</strong> Your meeting link will be sent in a separate email shortly before the session starts.
              </div>
              `}

              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #EEE; font-size: 14px; text-align: center;">
                <p style="margin-bottom: 5px;">Need to manage your booking?</p>
                <a href="${process.env.STOREFRONT_URL}/account/sessions" style="color: #2C1E36; text-decoration: underline; font-weight: 600;">Visit your Dashboard</a>
              </div>

              <p style="margin-top: 40px; text-align: center; font-style: italic;">With Love,<br/><strong>The Blissful Soul</strong></p>
            </div>
            
            <div style="background: #F4F4F4; padding: 20px; text-align: center; font-size: 11px; color: #999;">
              © ${new Date().getFullYear()} The Blissful Soul. All rights reserved.
            </div>
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
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 12px; background: #FDFBFF; border: 1px solid #E9D5FF;">
              <h2 style="color: #6B21A8;">Internal Alert: Reschedule</h2>
              <p>Customer <strong>${order.email}</strong> has rescheduled their session.</p>
              <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #eee;">
                <p style="margin: 5px 0;"><strong>Product:</strong> ${productTitle}</p>
                <p style="margin: 5px 0;"><strong>Order:</strong> #${order.display_id}</p>
                <p style="margin: 5px 0;"><strong>New Time:</strong> ${newDate} at ${newTime}</p>
                <p style="margin: 5px 0;"><strong>Original Time:</strong> ${oldDate} at ${oldTime}</p>
              </div>
              <p style="font-size: 12px; margin-top: 20px; color: #777;">Auto-sync with Cal.com complete.</p>
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
