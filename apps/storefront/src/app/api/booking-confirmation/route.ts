import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const backendUrl = process.env.STOREFRONT_MEDUSA_URL || "http://localhost:9000"
    const response = await fetch(`${backendUrl}/custom/booking-confirmation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const data = await response.json().catch(() => ({}))
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error("[API Proxy] booking-confirmation error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
