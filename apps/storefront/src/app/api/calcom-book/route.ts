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

    // Cal.com v2 Booking Payload
    // By providing eventTypeSlug + username, we don't need the numeric ID.
    const bookingPayload: any = {
      start: startTime,
      eventTypeSlug: eventSlug,
      username: username,
      attendee: {
        name: attendeeName,
        email: attendeeEmail,
        timeZone: attendeeTimeZone || "Asia/Kolkata",
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
