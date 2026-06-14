import { NextRequest, NextResponse } from "next/server"

const CAL_API_BASE = "https://api.cal.com/v2"

// Extra buffer beyond Cal.com's minimum booking notice to cover the
// checkout/payment roundtrip, so a slot that's valid when shown doesn't
// become invalid by the time the booking is actually created.
const CHECKOUT_BUFFER_MINUTES = 15

async function getMinimumBookingNotice(eventSlug: string, apiKey: string): Promise<number> {
  try {
    const res = await fetch(`${CAL_API_BASE}/event-types`, {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "cal-api-version": "2024-06-14",
      },
      next: { revalidate: 0 },
    })
    if (!res.ok) return 0

    const json = await res.json()
    const types = json.data || json || []
    const match = types.find((t: any) => t.slug === eventSlug)
    return match?.minimumBookingNotice ?? 0
  } catch {
    return 0
  }
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const date = searchParams.get("date")
  const timeZone = searchParams.get("timeZone") || "Asia/Kolkata"
  const eventSlug = searchParams.get("eventSlug")

  if (!date) {
    return NextResponse.json({ message: "Date is required" }, { status: 400 })
  }

  const username = process.env.NEXT_PUBLIC_CAL_USERNAME
  const targetSlug = eventSlug

  if (!username || !targetSlug) {
    return NextResponse.json(
      { message: "Cal.com username or event slug not configured. Please ensure the product has a valid handle." },
      { status: 500 }
    )
  }

  const apiKey = process.env.NEXT_PUBLIC_CAL_API_KEY
  if (!apiKey) {
    return NextResponse.json({ message: "Cal.com API key not configured." }, { status: 500 })
  }

  const params = new URLSearchParams({
    eventTypeSlug: targetSlug,
    username: username,
    start: `${date}T00:00:00Z`,
    end: `${date}T23:59:59Z`,
    timeZone: timeZone,
  })

  try {
    const response = await fetch(`${CAL_API_BASE}/slots?${params.toString()}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "cal-api-version": "2024-09-04",
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 } // No caching
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ message: `Cal.com slots API error: ${response.status} ${errorText}` }, { status: response.status })
    }

    const json = await response.json()

    if (json?.data && typeof json.data === "object") {
      const minimumBookingNotice = await getMinimumBookingNotice(targetSlug, apiKey)
      const cutoff = Date.now() + (minimumBookingNotice + CHECKOUT_BUFFER_MINUTES) * 60 * 1000

      for (const dateKey of Object.keys(json.data)) {
        const slotsForDate = json.data[dateKey]
        if (Array.isArray(slotsForDate)) {
          json.data[dateKey] = slotsForDate.filter(
            (slot: any) => new Date(slot.start).getTime() >= cutoff
          )
        }
      }
    }

    return NextResponse.json(json)
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
