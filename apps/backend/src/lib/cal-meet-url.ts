/**
 * Shared helper to resolve a Cal.com meeting URL for an order.
 *
 * If the order already has `cal_meet_url` in its metadata, returns it immediately.
 * Otherwise, if `cal_booking_uid` exists, fetches the booking from Cal.com API
 * to extract the meeting URL and persists it back to the order metadata.
 */

const CAL_API_BASE = "https://api.cal.com/v2"
const CAL_TIMEOUT_MS = 10_000

/**
 * Attempts to resolve the Cal.com meeting URL for an order.
 *
 * @param order          – The order object (must include `metadata`)
 * @param orderModule    – The Medusa order module service (for updating metadata)
 * @returns              – The meeting URL string, or undefined if unavailable
 */
export async function resolveCalMeetUrl(
  order: { id: string; display_id?: string | number; metadata?: Record<string, any> },
  orderModule: any
): Promise<string | undefined> {
  // 1. Already have the URL — return immediately
  const existingUrl = order.metadata?.cal_meet_url
  if (existingUrl && typeof existingUrl === "string" && existingUrl.startsWith("http")) {
    return existingUrl
  }

  // 2. No booking UID — nothing to look up
  const bookingUid = order.metadata?.cal_booking_uid || order.metadata?.cal_booking_id
  if (!bookingUid) {
    console.log(`[CalMeetUrl] Order #${order.display_id ?? order.id} — no cal_booking_uid, cannot fetch meet URL`)
    return undefined
  }

  // 3. Need the API key
  const apiKey = process.env.CAL_API_KEY
  if (!apiKey) {
    console.warn(`[CalMeetUrl] CAL_API_KEY not set — cannot fetch meet URL for Order #${order.display_id ?? order.id}`)
    return undefined
  }

  // 4. Fetch from Cal.com
  try {
    console.log(`[CalMeetUrl] Fetching meet URL for Order #${order.display_id ?? order.id} (booking UID: ${bookingUid})`)

    const abort = new AbortController()
    const timeout = setTimeout(() => abort.abort(), CAL_TIMEOUT_MS)

    const res = await fetch(`${CAL_API_BASE}/bookings/${bookingUid}`, {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "cal-api-version": "2024-08-13",
        "Content-Type": "application/json",
      },
      signal: abort.signal,
    }).finally(() => clearTimeout(timeout))

    if (!res.ok) {
      const errText = await res.text()
      console.error(`[CalMeetUrl] Cal.com returned ${res.status} for booking ${bookingUid}: ${errText}`)
      return undefined
    }

    const json = await res.json()
    const booking = json.data || json

    // Cal.com may store the URL in different locations depending on the integration
    const meetUrl =
      booking?.meetingUrl ||
      booking?.metadata?.videoCallUrl ||
      booking?.references?.find((r: any) => r.meetingUrl)?.meetingUrl ||
      booking?.location ||
      undefined

    // Only accept URLs that look like actual meeting links
    const isValidUrl = meetUrl && typeof meetUrl === "string" && meetUrl.startsWith("http")

    if (isValidUrl) {
      console.log(`[CalMeetUrl] Found meet URL for Order #${order.display_id ?? order.id}: ${meetUrl}`)

      // Save it back to order metadata so we don't fetch again next time
      try {
        await orderModule.updateOrders([{
          id: order.id,
          metadata: {
            ...order.metadata,
            cal_meet_url: meetUrl,
          }
        }])
        console.log(`[CalMeetUrl] Saved meet URL to order metadata`)
      } catch (saveErr: any) {
        console.error(`[CalMeetUrl] Failed to save meet URL to metadata:`, saveErr.message)
      }

      return meetUrl
    } else {
      console.warn(`[CalMeetUrl] No valid meet URL found in Cal.com response for booking ${bookingUid}`)
      return undefined
    }
  } catch (err: any) {
    if (err.name === "AbortError") {
      console.error(`[CalMeetUrl] Timeout fetching meet URL for booking ${bookingUid}`)
    } else {
      console.error(`[CalMeetUrl] Error fetching meet URL for booking ${bookingUid}:`, err.message)
    }
    return undefined
  }
}
