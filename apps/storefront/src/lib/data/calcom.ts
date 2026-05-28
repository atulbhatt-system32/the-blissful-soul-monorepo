/**
 * Cal.com API v2 integration utility
 * Fetches real-time availability slots
 */

/**
 * Fetch available time slots from Cal.com for a given date.
 * Returns an array of slot objects with formatted time strings.
 */
export async function fetchAvailableSlots(
  date: string, // YYYY-MM-DD format
  timeZone: string = "Asia/Kolkata",
  eventSlug?: string
): Promise<{ time: string; isoStart: string }[]> {

  const params = new URLSearchParams({ date, timeZone })
  if (eventSlug) params.set("eventSlug", eventSlug)

  const response = await fetch(`/api/calcom-slots?${params.toString()}`)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error("Cal.com slots API error:", response.status, errorData)
    throw new Error(errorData.message || `Failed to fetch slots: ${response.status}`)
  }

  const json = await response.json()

  if (json.status !== "success" || !json.data) return []

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
          timeZone,
        })
        allSlots.push({ time: formattedTime, isoStart: slot.start })
      }
    }
  }

  return allSlots
}
