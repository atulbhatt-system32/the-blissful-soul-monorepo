import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const backendUrl = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
    
    const response = await fetch(`${backendUrl}/custom/booking-reschedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error("[API Proxy] booking-reschedule error:", error.message)
    return NextResponse.json({ message: "Failed to process rescheduling" }, { status: 500 })
  }
}
