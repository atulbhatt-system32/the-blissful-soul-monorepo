import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import sessionReminderJob from "../../../jobs/session-reminder"

/**
 * Manual trigger for the session-reminder job.
 * GET /custom/test-reminder
 *
 * Use this to test the reminder without waiting for the 15-minute cron.
 * ⚠️  Remove this route before deploying to production.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    console.log("[Test Reminder] Manually triggering session-reminder job...")
    await sessionReminderJob(req.scope)
    return res.status(200).json({ success: true, message: "Reminder job executed — check server logs for details." })
  } catch (err: any) {
    console.error("[Test Reminder] Error:", err.message)
    return res.status(500).json({ success: false, error: err.message })
  }
}
