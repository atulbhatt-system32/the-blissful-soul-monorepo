import {
  MedusaContainer
} from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import { sendSessionReminder15MinWhatsApp } from "../lib/interakt";

/**
 * Scheduled job to send session reminders 15 minutes before the booking.
 * Checks for sessions starting in 4–26 min (±11 min window around the 15-min target).
 * Uses reminder_15min_sent flag so it fires independently of the 1-hour reminder.
 */
export default async function sessionReminder15MinJob(container: MedusaContainer) {
  const orderModuleService = container.resolve(Modules.ORDER) as any;
  const notificationService = container.resolve("notification") as any;

  console.log(`[Reminder-15min Job] Running at ${new Date().toISOString()}`);

  try {
    const orders = await orderModuleService.listOrders(
      {},
      { select: ["id", "display_id", "status", "email", "metadata"], relations: ["shipping_address", "items"], take: 200 }
    );

    const sessionOrders = orders.filter((o: any) => o.metadata?.is_session)
    console.log(`[Reminder-15min Job] Found ${sessionOrders.length} session order(s) to check.`)

    const now = new Date();
    // Window: 4 to 26 minutes from now
    const windowStart = new Date(now.getTime() + 4 * 60 * 1000);
    const windowEnd = new Date(now.getTime() + 26 * 60 * 1000);

    console.log(`[Reminder-15min Job] Now (IST): ${now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`)
    console.log(`[Reminder-15min Job] Window: ${windowStart.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} → ${windowEnd.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`)

    for (const order of sessionOrders) {
      if (!order.metadata?.is_session) continue;
      if (order.status === "canceled") continue;
      if (order.metadata?.reminder_15min_sent) {
        console.log(`[Reminder-15min Job] Order #${order.display_id} — already reminded (15min), skipping`)
        continue;
      }

      const bookingDate = order.metadata?.booking_date;
      const bookingTime = order.metadata?.booking_time;

      if (!bookingDate || !bookingTime) {
        console.log(`[Reminder-15min Job] Order #${order.display_id} — no booking_date/time, skipping`)
        continue;
      }

      try {
        const parts = bookingTime.trim().split(' ')
        const timeParts = (parts[0] || '').split(':').map(Number)
        let hours = timeParts[0]
        const minutes = timeParts[1]
        const modifier = parts[1]?.toUpperCase()

        if (isNaN(hours) || isNaN(minutes)) {
          console.warn(`[Reminder-15min Job] Unrecognised time format "${bookingTime}" for Order #${order.display_id} — skipping`)
          continue
        }

        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        const sessionDateUTC = new Date(`${bookingDate}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00+05:30`);

        console.log(`[Reminder-15min Job] Order #${order.display_id} — session: ${bookingDate} ${bookingTime} | in window: ${sessionDateUTC >= windowStart && sessionDateUTC <= windowEnd}`)

        if (sessionDateUTC >= windowStart && sessionDateUTC <= windowEnd) {
          console.log(`[Reminder-15min Job] Sending 15-min reminder for Order #${order.display_id}`);

          const reminderData = {
            to: order.email,
            channel: "email",
            template: "session-reminder",
            data: {
              subject: `Starting Soon: Your Session at ${bookingTime} - The Blissful Soul`,
              customerName: order.shipping_address?.first_name || "Customer",
              bookingDate,
              bookingTime,
              orderId: order.display_id || order.id,
              html_body: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #fffaf0; border-radius: 8px; border: 1px solid #ffe4b5;">
                  <h1 style="color: #d2691e; font-size: 20px; margin-bottom: 4px;">Starting in 15 Minutes ⏰</h1>
                  <p style="color: #555; font-size: 14px; margin-bottom: 24px;">The Blissful Soul</p>

                  <p style="color: #333;">Hi <strong>${order.shipping_address?.first_name || "there"}</strong>,</p>
                  <p style="color: #333;">Your session is starting in just <strong>15 minutes</strong>. Please make sure you are ready!</p>

                  <div style="background: #fff; border: 1px solid #ffd39b; border-radius: 8px; padding: 15px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Session Time:</strong> ${bookingTime} Today</p>
                    <p style="margin: 5px 0;"><strong>Date:</strong> ${bookingDate}</p>
                  </div>

                  <p style="color: #333;">Find a quiet, comfortable space and take a few deep breaths. We'll see you very soon! 🙏</p>

                  <p style="color: #d2691e; font-weight: bold; margin-top: 24px;">The Blissful Soul Team</p>
                </div>
              `
            }
          };

          // 1. Send to Customer (email + WhatsApp)
          await notificationService.createNotifications([reminderData]);
          sendSessionReminder15MinWhatsApp({
            phone: order.items?.[0]?.metadata?.patient_phone || order.shipping_address?.phone || "",
            countryCode: order.shipping_address?.country_code || "in",
            firstName: order.shipping_address?.first_name || "Customer",
            bookingDate,
            bookingTime,
            orderId: order.display_id || order.id,
            calMeetUrl: order.metadata?.cal_meet_url as string | undefined,
          }).catch((err: Error) => console.error(`[Reminder-15min Job] WhatsApp failed for Order #${order.display_id}:`, err.message));

          // 2. Send to Admin(s)
          const adminEmails = [...new Set([
            process.env.ADMIN_NOTIFICATION_EMAIL,
            process.env.GOOGLE_SMTP_USER,
          ].filter(Boolean) as string[])]
          if (adminEmails.length > 0) {
            await notificationService.createNotifications(
              adminEmails.map((adminEmail: string) => ({
                ...reminderData,
                to: adminEmail,
                data: {
                  ...reminderData.data,
                  subject: `[ADMIN] Session with ${order.shipping_address?.first_name} starting in 15 min`,
                  html_body: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f0f8ff; border-radius: 8px;">
                      <h2>Host Reminder: Session Starting in 15 Minutes</h2>
                      <ul>
                        <li><strong>Customer:</strong> ${order.shipping_address?.first_name} ${order.shipping_address?.last_name}</li>
                        <li><strong>Email:</strong> ${order.email}</li>
                        <li><strong>Time:</strong> ${bookingTime}</li>
                        <li><strong>Order ID:</strong> #${order.display_id}</li>
                      </ul>
                      <p>Get ready! 🙏</p>
                    </div>
                  `
                }
              }))
            );
          }

          // 3. Mark as sent
          await orderModuleService.updateOrders([{
            id: order.id,
            metadata: {
              ...order.metadata,
              reminder_15min_sent: true,
              reminder_15min_sent_at: new Date().toISOString()
            }
          }]);

          console.log(`[Reminder-15min Job] Sent successfully for Order #${order.display_id}`);
        }
      } catch (parseErr: any) {
        console.error(`[Reminder-15min Job] Error parsing time for Order #${order.id}:`, parseErr.message);
      }
    }
  } catch (error: any) {
    console.error("[Reminder-15min Job] Error executing job:", error.message);
  }
}

export const config = {
  name: "session-reminder-15min",
  schedule: "*/15 * * * *", // Every 15 minutes
};
