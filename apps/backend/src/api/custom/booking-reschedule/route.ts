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
    if (calBookingId) {
      try {
        const calApiKey = process.env.NEXT_PUBLIC_CAL_API_KEY
        await fetch(`https://api.cal.com/v2/bookings/${calBookingId}/reschedule`, {
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
        console.log(`[Booking Reschedule] Cal.com event ${calBookingId} rescheduled to ${slotIsoStart}.`)
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
        orderId: order.display_id,
        html_body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #fff; border: 1px solid #eee; border-radius: 8px;">
            <h1 style="color: #3182ce;">Session Rescheduled 🗓️</h1>
            <p>Your session has been moved to a new time slot.</p>
            <div style="background: #ebf8ff; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <p style="margin: 5px 0;"><strong>New Time:</strong> ${newDate} at ${newTime}</p>
              <p style="margin: 5px 0; color: #718096; font-size: 13px;">Original Time: ${oldDate} at ${oldTime}</p>
            </div>
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
