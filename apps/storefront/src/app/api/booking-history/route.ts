import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email")

    if (!email) {
      return NextResponse.json({ sessions: [] })
    }

    const backendUrl = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
    const response = await fetch(
      `${backendUrl}/custom/booking-history?email=${encodeURIComponent(email)}`,
      { cache: "no-store" }
    )

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error("[API Proxy] booking-history error:", error.message)
    return NextResponse.json({ sessions: [] }, { status: 500 })
  }
}
