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
  const username = process.env.NEXT_PUBLIC_CAL_USERNAME
  const targetSlug = eventSlug || process.env.NEXT_PUBLIC_CAL_EVENT_SLUG

  if (!username || !targetSlug) {
    throw new Error(
      "Cal.com username or event slug not configured. Ensure NEXT_PUBLIC_CAL_USERNAME is set and an event slug is provided."
    )
  }

  const params = new URLSearchParams({
    eventTypeSlug: targetSlug,
    username: username,
    start: date,
    end: date,
    timeZone: timeZone,
  })

  const response = await fetch(`${CAL_API_BASE}/slots?${params.toString()}`, {
    method: "GET",
    headers: getCalHeaders("2024-09-04"),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Cal.com slots API error:", response.status, errorText)
    throw new Error(`Failed to fetch slots: ${response.status}`)
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
  eventSlug?: string // Added support for passing the slug directly
  notes?: string
}): Promise<{ uid: string; status: string } | null> {
  const {
    startTime,
    attendeeName,
    attendeeEmail,
    attendeeTimeZone = "Asia/Kolkata",
    eventSlug,
    notes,
  } = params

  // We need the eventTypeId for booking creation.
  // If not provided, we need to resolve it from the slug.
  let eventTypeId = params.eventTypeId
  if (!eventTypeId) {
    const resolvedId = await resolveEventTypeId(eventSlug)
    eventTypeId = resolvedId ? resolvedId : undefined
  }

  if (!eventTypeId) {
    throw new Error("Cal.com event type ID could not be resolved. Please configure it.")
  }

  const body: any = {
    start: startTime,
    eventTypeId: eventTypeId,
    attendee: {
      name: attendeeName,
      email: attendeeEmail,
      timeZone: attendeeTimeZone,
    },
  }

  if (notes) {
    body.metadata = { notes }
  }

  const response = await fetch(`${CAL_API_BASE}/bookings`, {
    method: "POST",
    headers: getCalHeaders("2024-08-13"),
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Cal.com booking API error:", response.status, errorText)
    throw new Error(`Failed to create booking: ${response.status}`)
  }

  const json = await response.json()
  return {
    uid: json.data?.uid || json.data?.id || "",
    status: json.status || "unknown",
  }
}

/**
 * Resolve the event type ID from the slug + username by fetching event types.
 * This is cached per session.
 */
// Cache mapping eventSlug -> eventId
const cachedEventTypeIds: Record<string, number> = {}

async function resolveEventTypeId(eventSlug?: string): Promise<number | null> {
  const targetSlug = eventSlug || process.env.NEXT_PUBLIC_CAL_EVENT_SLUG
  if (!targetSlug) return null
    
  if (cachedEventTypeIds[targetSlug]) return cachedEventTypeIds[targetSlug]

  const username = process.env.NEXT_PUBLIC_CAL_USERNAME

  if (!username) return null

  try {
    const response = await fetch(
      `${CAL_API_BASE}/event-types?username=${username}`,
      {
        method: "GET",
        headers: getCalHeaders("2024-09-04"),
      }
    )

    if (!response.ok) return null

    const json = await response.json()
    const eventTypes = json.data?.eventTypeGroups?.[0]?.eventTypes || json.data || []

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
