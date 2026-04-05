import { 
  MedusaContainer
} from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

/**
 * Scheduled job to send session reminders 1 hour before the booking.
 * Checks for sessions starting in the next 1 hour (+/- 15 mins window).
 */
export default async function sessionReminderJob(container: MedusaContainer) {
  const orderModuleService = container.resolve(Modules.ORDER) as any;
  const notificationService = container.resolve("notification") as any;

  console.log("[Reminder Job] Checking for upcoming sessions...");

  try {
    // 1. Get all pending orders with session metadata
    const orders = await orderModuleService.listOrders(
      { 
        status: "pending",
        metadata: { is_session: true }
      },
      { 
        relations: ["items"],
        take: 100 
      }
    );

    const now = new Date();
    // Target window: 45 to 75 minutes from now
    const windowStart = new Date(now.getTime() + 45 * 60 * 1000);
    const windowEnd = new Date(now.getTime() + 75 * 60 * 1000);

    for (const order of orders) {
      // Skip if reminder already sent
      if (order.metadata?.reminder_sent) continue;

      const bookingDate = order.metadata?.booking_date; // e.g. "2026-04-06"
      const bookingTime = order.metadata?.booking_time; // e.g. "10:30 AM"

      if (!bookingDate || !bookingTime) continue;

      try {
        // Parse "10:30 AM" into hours and minutes
        const [time, modifier] = bookingTime.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        // Create Date object for session start explicitly in IST (+05:30)
        const sessionDateUTC = new Date(`${bookingDate}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00+05:30`);

        // Check if session falls within our 1-hour reminder window
        if (sessionDateUTC >= windowStart && sessionDateUTC <= windowEnd) {
          console.log(`[Reminder Job] Sending reminder for Order #${order.display_id} (Session at ${bookingTime})`);

          const reminderData = {
            to: order.email,
            channel: "email",
            template: "session-reminder",
            data: {
              subject: `Reminder: Your Session at ${bookingTime} - The Blissful Soul`,
              customerName: order.shipping_address?.first_name || "Customer",
              bookingDate,
              bookingTime,
              orderId: order.display_id || order.id,
              html_body: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #fffaf0; border-radius: 8px; border: 1px solid #ffe4b5;">
                  <h1 style="color: #d2691e; font-size: 20px; margin-bottom: 4px;">Session Reminder ⏳</h1>
                  <p style="color: #555; font-size: 14px; margin-bottom: 24px;">The Blissful Soul</p>
                  
                  <p style="color: #333;">Hi <strong>${order.shipping_address?.first_name || "there"}</strong>,</p>
                  <p style="color: #333;">This is a friendly reminder that your session is starting in about **1 hour**.</p>
                  
                  <div style="background: #fff; border: 1px solid #ffd39b; border-radius: 8px; padding: 15px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Session Time:</strong> ${bookingTime} Today</p>
                    <p style="margin: 5px 0;"><strong>Date:</strong> ${bookingDate}</p>
                  </div>
                  
                  <p style="color: #333;">Please ensure you are in a quiet space and ready for your journey. 🙏</p>
                  <p style="color: #333;">If you have any last-minute questions, feel free to reply to this email.</p>
                  
                  <p style="color: #333; margin-top: 24px;">See you soon!</p>
                  <p style="color: #d2691e; font-weight: bold;">The Blissful Soul Team</p>
                </div>
              `
            }
          };

          // 1. Send to Customer
          await notificationService.createNotifications([reminderData]);

          // 2. Send to Admin (User)
          await notificationService.createNotifications([{
            ...reminderData,
            to: "mratulbhatt97@gmail.com", // Admin Email
            data: {
              ...reminderData.data,
              subject: `[ADMIN REMINDER] Session with ${order.shipping_address?.first_name} at ${bookingTime}`,
              html_body: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f0f8ff; border-radius: 8px;">
                  <h2>Host Reminder: Upcoming Session</h2>
                  <p>You have a session starting in 1 hour.</p>
                  <ul>
                    <li><strong>Customer:</strong> ${order.shipping_address?.first_name} ${order.shipping_address?.last_name}</li>
                    <li><strong>Email:</strong> ${order.email}</li>
                    <li><strong>Time:</strong> ${bookingTime}</li>
                    <li><strong>Order ID:</strong> #${order.display_id}</li>
                  </ul>
                  <p>Preparation is key. Good luck! 🙏</p>
                </div>
              `
            }
          }]);

          // 3. Mark as sent in metadata
          await orderModuleService.updateOrders([{
            id: order.id,
            metadata: {
              ...order.metadata,
              reminder_sent: true,
              reminder_sent_at: new Date().toISOString()
            }
          }]);

          console.log(`[Reminder Job] Sent successfully for Order #${order.display_id}`);
        }
      } catch (parseErr: any) {
        console.error(`[Reminder Job] Error parsing time for Order #${order.id}:`, parseErr.message);
      }
    }
  } catch (error: any) {
    console.error("[Reminder Job] Error executing job:", error.message);
  }
}

export const config = {
  name: "session-reminder-1h",
  schedule: "*/15 * * * *", // Every 15 minutes
};
