import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { sendOrderConfirmationWhatsApp } from "../../../lib/interakt"

/**
 * GET /admin/test-whatsapp?phone=9876543210
 *
 * Sends a test order-confirmation WhatsApp message.
 * Requires admin auth (Medusa admin session cookie).
 * Uses WHATSAPP_DRY_RUN=true for safe testing without wallet balance.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const phone = (req.query.phone as string) || ""

  if (!phone) {
    return res.status(400).json({
      error: "Please provide a phone number, e.g. /admin/test-whatsapp?phone=9876543210",
    })
  }

  const isDryRun = process.env.WHATSAPP_DRY_RUN === "true"

  try {
    await sendOrderConfirmationWhatsApp({
      phone,
      countryCode: "in",
      firstName: "Test User",
      orderId: "TEST-001",
      serviceTitle: "Test Product – WhatsApp Integration Check",
      bookingDate: "",
      bookingTime: "",
      amount: 999,
    })

    return res.json({
      success: true,
      dry_run: isDryRun,
      message: isDryRun
        ? "Dry-run successful — payload logged to backend console. Check docker logs."
        : "WhatsApp message sent successfully via Interakt.",
      phone,
    })
  } catch (error: any) {
    return res.status(502).json({
      success: false,
      dry_run: isDryRun,
      error: error.message,
      hint: error.message.includes("wallet")
        ? "Your Interakt wallet balance is zero. Recharge at https://app.interakt.ai or set WHATSAPP_DRY_RUN=true for testing."
        : undefined,
    })
  }
}
