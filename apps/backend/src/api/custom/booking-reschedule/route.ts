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
    const oldDate = order.metadata?.booking_date as string | undefined
    const oldTime = order.metadata?.booking_time as string | undefined
    
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

    // 3. Cancel old Cal.com booking and create a NEW one (mirrors booking confirmation flow)
    const calBookingId = order.metadata?.cal_booking_id as string | undefined
    const calEventSlug = (order.metadata?.cal_event_slug as string) || "video-session"
    const calApiKey = process.env.CAL_API_KEY
    const calUsername = "kunal-risaanva-m3jown"
    let newCalBookingId = calBookingId
    let calMeetUrl = order.metadata?.cal_meet_url as string | undefined

    if (!calApiKey) {
      console.error("[Booking Reschedule] CAL_API_KEY is missing from env!")
    }

    if (calApiKey) {
      // Step A: Cancel the old booking (non-blocking)
      if (calBookingId) {
        try {
          const cancelRes = await fetch(`https://api.cal.com/v2/bookings/${calBookingId}/cancel`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${calApiKey}`,
              "cal-api-version": "2024-08-13",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ reason: "Rescheduled by customer via dashboard" })
          })
          const cancelData = await cancelRes.json()
          console.log(`[Booking Reschedule] Old Cal.com booking ${calBookingId} cancelled:`, cancelRes.status)
        } catch (cancelErr: any) {
          console.error(`[Booking Reschedule] Failed to cancel old Cal.com booking:`, cancelErr.message)
        }
      }

      // Step B: Resolve the event type ID from slug (same as booking confirmation)
      let eventTypeId: number | undefined
      try {
        const eventTypesRes = await fetch(`https://api.cal.com/v2/event-types`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${calApiKey}`,
            "cal-api-version": "2024-09-04",
            "Content-Type": "application/json",
          }
        })
        if (eventTypesRes.ok) {
          const json = await eventTypesRes.json()
          const eventTypes = json.data || json || []
          const matched = Array.isArray(eventTypes)
            ? eventTypes.find((et: any) => et.slug === calEventSlug)
            : null
          if (matched) {
            eventTypeId = matched.id
          }
        }
      } catch (err: any) {
        console.error("[Booking Reschedule] Failed to fetch event types:", err.message)
      }

      // Step C: Create a brand new Cal.com booking for the new time slot
      try {
        const bookingPayload: any = {
          start: slotIsoStart,
          attendee: {
            name: order.shipping_address?.first_name 
              ? `${order.shipping_address.first_name} ${order.shipping_address.last_name || ""}`.trim()
              : "Customer",
            email: order.email,
            timeZone: "Asia/Kolkata",
          }
        }

        if (eventTypeId) {
          bookingPayload.eventTypeId = eventTypeId
        } else {
          bookingPayload.eventTypeSlug = calEventSlug
          bookingPayload.username = calUsername
        }

        console.log(`[Booking Reschedule] Creating new Cal.com booking:`, JSON.stringify(bookingPayload))

        const createRes = await fetch(`https://api.cal.com/v2/bookings`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${calApiKey}`,
            "cal-api-version": "2024-08-13",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingPayload),
        })

        const createData = await createRes.json()
        console.log(`[Booking Reschedule] New Cal.com booking response:`, JSON.stringify(createData).substring(0, 500))

        if (createRes.ok && createData?.data) {
          newCalBookingId = createData.data.uid || createData.data.id || calBookingId
          calMeetUrl = createData.data.meetingUrl || createData.data.location || calMeetUrl
          console.log(`[Booking Reschedule] New booking created! ID: ${newCalBookingId}, Meet URL: ${calMeetUrl}`)
        } else {
          console.error(`[Booking Reschedule] Failed to create new Cal.com booking:`, createData)
        }
      } catch (createErr: any) {
        console.error(`[Booking Reschedule] Error creating new Cal.com booking:`, createErr.message)
      }
    }

    // Final fallback: use the storefront sessions dashboard (always valid, never 404s)
    if (!calMeetUrl) {
      const storefrontUrl = process.env.STOREFRONT_URL || "https://theblissfulsoul.in"
      calMeetUrl = `${storefrontUrl}/account/sessions`
      console.log(`[Booking Reschedule] Using storefront sessions page as fallback: ${calMeetUrl}`)
    }

    // 4. Update Medusa Order Metadata
    await orderModuleService.updateOrders([{
      id: order.id,
      metadata: {
        ...order.metadata,
        booking_date: newDate,
        booking_time: newTime,
        cal_booking_id: newCalBookingId, // Store the NEW Cal.com booking ID
        cal_meet_url: calMeetUrl, // Store the NEW meeting URL
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
              <div style="margin: 30px 0; text-align: center; background: #2C1E36; padding: 25px; border-radius: 12px; border: 1px solid #C5A059;">
                <p style="margin-top: 0; color: #C5A059; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Private Meeting Link</p>
                <a href="${calMeetUrl}" style="background: #C5A059; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px; margin: 10px 0;">Join Live Session</a>
                <p style="margin-bottom: 0; color: rgba(197, 160, 89, 0.6); font-size: 11px;">Direct Link: ${calMeetUrl}</p>
              </div>
              ` : `
              <p style="color: #333; background: #fff9eb; padding: 15px; border-radius: 8px; border: 1px solid #ffe6a8; font-size: 14px;">
                <strong>Note:</strong> Your unique meeting link will be sent to you via email shortly before the session starts.
              </p>
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
        to: process.env.ADMIN_NOTIFICATION_EMAIL!,
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
