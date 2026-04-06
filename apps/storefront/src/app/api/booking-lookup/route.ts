import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email")
    const displayId = request.nextUrl.searchParams.get("displayId")

    if (!email || !displayId) {
      return NextResponse.json({ message: "Email and Booking ID are required" }, { status: 400 })
    }

    const backendUrl = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
    const response = await fetch(
      `${backendUrl}/custom/booking-lookup?email=${encodeURIComponent(email)}&displayId=${displayId}`,
      { cache: "no-store" }
    )

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error("[API Proxy] booking-lookup error:", error.message)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
