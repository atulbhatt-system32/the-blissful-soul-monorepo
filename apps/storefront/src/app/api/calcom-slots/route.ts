import { NextRequest, NextResponse } from "next/server"

const CAL_API_BASE = "https://api.cal.com/v2"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const date = searchParams.get("date")
  const timeZone = searchParams.get("timeZone") || "Asia/Kolkata"
  const eventSlug = searchParams.get("eventSlug")

  if (!date) {
    return NextResponse.json({ message: "Date is required" }, { status: 400 })
  }

  const username = process.env.NEXT_PUBLIC_CAL_USERNAME
  const targetSlug = eventSlug || process.env.NEXT_PUBLIC_CAL_EVENT_SLUG

  if (!username || !targetSlug) {
    return NextResponse.json(
      { message: "Cal.com username or event slug not configured." },
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
    return NextResponse.json(json)
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
