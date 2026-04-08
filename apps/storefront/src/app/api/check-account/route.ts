import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email")

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    const backendUrl = process.env.STOREFRONT_MEDUSA_URL || "http://localhost:9000"
    const response = await fetch(`${backendUrl}/custom/check-account?email=${encodeURIComponent(email)}`)
    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error("[API Proxy] check-account error:", error.message)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
