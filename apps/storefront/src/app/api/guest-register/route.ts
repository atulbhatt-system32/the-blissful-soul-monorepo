import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    const backendUrl = process.env.STOREFRONT_MEDUSA_URL || "http://localhost:9000"

    // Forward to backend custom registration
    const response = await fetch(`${backendUrl}/custom/guest-register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, firstName, lastName }),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error("[API Proxy] guest-register error:", error.message)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
