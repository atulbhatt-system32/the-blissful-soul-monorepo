import { NextRequest, NextResponse } from "next/server"

const CAL_API_BASE = "https://api.cal.com/v2"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      startTime,
      attendeeName,
      attendeeEmail,
      attendeeTimeZone,
      eventSlug,
      meetingAbout,
      notes,
      phone
    } = body

    if (!startTime || !attendeeName || !attendeeEmail || !eventSlug) {
      return NextResponse.json({ message: "Missing required booking fields" }, { status: 400 })
    }

    const apiKey = process.env.NEXT_PUBLIC_CAL_API_KEY
    const username = process.env.NEXT_PUBLIC_CAL_USERNAME
    
    if (!apiKey || !username) {
      return NextResponse.json({ message: "Cal.com API key or Username not configured." }, { status: 500 })
    }

    // First, resolve eventTypeId from slug
    let eventTypeId: number | undefined
    try {
      const eventTypesRes = await fetch(`${CAL_API_BASE}/event-types`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "cal-api-version": "2024-09-04",
          "Content-Type": "application/json",
        }
      })
      if (eventTypesRes.ok) {
        const json = await eventTypesRes.json()
        const eventTypes = json.data || json || []
        const matched = Array.isArray(eventTypes) 
          ? eventTypes.find((et: any) => et.slug === eventSlug)
          : null
        if (matched) {
          eventTypeId = matched.id
        }
      }
    } catch (err) {
      console.error("Failed to fetch event types:", err)
    }

    if (!eventTypeId) {
      console.warn("Could not resolve eventTypeId for slug:", eventSlug)
    }

    // Cal.com v2 Booking Payload
    const bookingPayload: any = {
      start: startTime,
      attendee: {
        name: attendeeName,
        email: attendeeEmail,
        timeZone: attendeeTimeZone || "Asia/Kolkata",
      }
    }

    if (eventTypeId) {
      bookingPayload.eventTypeId = eventTypeId
    } else {
      bookingPayload.eventTypeSlug = eventSlug
      bookingPayload.username = username
    }

    if (meetingAbout) {
      bookingPayload.bookingFieldsResponses = {
        title: meetingAbout,
      }
    }

    console.log("Sending booking to Cal.com v2:", JSON.stringify(bookingPayload, null, 2))

    const response = await fetch(`${CAL_API_BASE}/bookings`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "cal-api-version": "2024-08-13",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingPayload),
    })

    const resultText = await response.text()
    let resultJson: any
    try {
      resultJson = JSON.parse(resultText)
    } catch (e) {
      resultJson = { raw: resultText }
    }

    if (!response.ok) {
      console.error("Cal.com v2 API Error:", response.status, resultJson)
      // Return a descriptive error to the frontend if the user is busy
      const errorMsg = resultJson?.error?.message || resultJson?.message || "Failed to create booking"
      return NextResponse.json({ message: errorMsg, details: resultJson }, { status: response.status })
    }

    return NextResponse.json(resultJson)

  } catch (error: any) {
    console.error("Cal.com Proxy Exception:", error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
