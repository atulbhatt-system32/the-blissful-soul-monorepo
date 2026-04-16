/**
 * Cal.com API v2 integration utility
 * Fetches real-time availability slots and creates bookings
 */

const CAL_API_BASE = "https://api.cal.com/v2"

function getCalHeaders(apiVersion: string = "2024-09-04") {
  const apiKey = process.env.NEXT_PUBLIC_CAL_API_KEY
  if (!apiKey) {
    throw new Error("Cal.com API key is not configured. Set NEXT_PUBLIC_CAL_API_KEY in .env")
  }
  return {
    "Authorization": `Bearer ${apiKey}`,
    "cal-api-version": apiVersion,
    "Content-Type": "application/json",
  }
}

/**
 * Fetch available time slots from Cal.com for a given date.
 * Returns an array of slot objects with formatted time strings.
 */
export async function fetchAvailableSlots(
  date: string, // YYYY-MM-DD format
  timeZone: string = "Asia/Kolkata",
  eventSlug?: string // Added to support dynamic event types
): Promise<{ time: string; isoStart: string }[]> {
  
  const params = new URLSearchParams({
    date,
    timeZone,
  })
  if (eventSlug) {
    params.set("eventSlug", eventSlug)
  }

  const response = await fetch(`/api/calcom-slots?${params.toString()}`, {
    method: "GET",
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error("Cal.com proxy slots API error:", response.status, errorData)
    throw new Error(errorData.message || `Failed to fetch slots: ${response.status}`)
  }

  const json = await response.json()

  if (json.status !== "success" || !json.data) {
    return []
  }

  // json.data is an object like { "2024-09-05": [{ start: "2024-09-05T09:00:00.000+05:30" }] }
  const allSlots: { time: string; isoStart: string }[] = []

  for (const dateKey of Object.keys(json.data)) {
    const slotsForDate = json.data[dateKey]
    if (Array.isArray(slotsForDate)) {
      for (const slot of slotsForDate) {
        const startTime = new Date(slot.start)
        const formattedTime = startTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: timeZone,
        })
        allSlots.push({
          time: formattedTime,
          isoStart: slot.start,
        })
      }
    }
  }

  return allSlots
}

/**
 * Create a booking on Cal.com after successful payment.
 */
export async function createCalBooking(params: {
  startTime: string // ISO 8601 UTC string
  attendeeName: string
  attendeeEmail: string
  attendeeTimeZone?: string
  eventTypeId?: number
  eventSlug?: string
  notes?: string
}): Promise<{ uid: string; status: string; meetingUrl?: string; location?: string } | null> {
  const response = await fetch(`/api/calcom-book`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Failed proxying to Cal.com:", response.status, errorText)
    throw new Error(`Failed to create booking: ${response.status}`)
  }

  const json = await response.json()
  return {
    uid: json.data?.uid || json.data?.id || "",
    status: json.status || "unknown",
    meetingUrl: json.data?.meetingUrl,
    location: json.data?.location,
  }
}

/**
 * Resolve the event type ID from the slug + username by fetching event types.
 * This is cached per session.
 */
// Cache mapping eventSlug -> eventId
const cachedEventTypeIds: Record<string, number> = {}

export async function resolveEventTypeId(eventSlug?: string): Promise<number | null> {
  const targetSlug = eventSlug
  if (!targetSlug) return null
    
  if (cachedEventTypeIds[targetSlug]) return cachedEventTypeIds[targetSlug]

  const username = process.env.NEXT_PUBLIC_CAL_USERNAME

  if (!username) return null

  try {
    const response = await fetch(
      `${CAL_API_BASE}/event-types`,
      {
        method: "GET",
        headers: getCalHeaders("2024-09-04"),
      }
    )

    if (!response.ok) return null

    const json = await response.json()
    // In v2, the data might be in json.data or directly in json
    const eventTypes = json.data || json || []

    const matched = Array.isArray(eventTypes)
      ? eventTypes.find((et: any) => et.slug === targetSlug)
      : null

    if (matched) {
      cachedEventTypeIds[targetSlug] = matched.id
      return matched.id
    }
  } catch (err) {
    console.error("Failed to resolve Cal.com event type ID:", err)
  }

  return null
}
