import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    const backendUrl = process.env.STOREFRONT_MEDUSA_URL || "http://localhost:9000"
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

    // Forward to backend custom registration with publishable key
    const response = await fetch(`${backendUrl}/custom/guest-register`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...(publishableKey ? { "x-publishable-api-key": publishableKey } : {})
      },
      body: JSON.stringify({ email, password, firstName, lastName }),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error("[API Proxy] guest-register error:", error.message)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
