import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const textBody = await request.text();
    let body = {};
    try {
      body = JSON.parse(textBody);
    } catch (e) {
      console.error("[API Proxy] JSON Parse error on incoming body:", e);
      return NextResponse.json({ message: "Invalid JSON in request body" }, { status: 400 });
    }

    const backendUrl = process.env.STOREFRONT_MEDUSA_URL || "http://localhost:9000"
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

    const response = await fetch(`${backendUrl}/store/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": publishableKey,
      },
      body: JSON.stringify(body),
    })

    const textResponse = await response.text();
    let data;
    try {
      data = JSON.parse(textResponse);
    } catch (e) {
      console.error("[API Proxy] Upstream returned non-JSON:", textResponse);
      return NextResponse.json({ message: "Upstream returned invalid response", detail: textResponse }, { status: 502 });
    }
    
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error("[API Proxy] contact error:", error.message)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
