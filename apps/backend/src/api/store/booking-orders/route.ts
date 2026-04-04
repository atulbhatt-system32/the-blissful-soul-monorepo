import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

type BookingOrderPayload = {
  variantId: string
  email: string
  firstName: string
  lastName: string
  phone: string
  countryCode: string
  razorpayPaymentId: string
  bookingDate: string
  bookingTime: string
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const {
    variantId,
    email,
    firstName,
    lastName,
    phone,
    countryCode,
    razorpayPaymentId,
    bookingDate,
    bookingTime,
  } = req.body as BookingOrderPayload

  if (!variantId || !email || !razorpayPaymentId) {
    return res.status(400).json({ message: "Missing required fields" })
  }

  try {
    // Use Medusa SDK or low-level store APIs are not available server-side here,
    // so we use the container to get the services directly.
    const cartService = req.scope.resolve("cart") as any
    const orderService = req.scope.resolve("order") as any
    const regionService = req.scope.resolve("region") as any

    // 1. Find region by country code
    const regionsResult = await regionService.listRegions({ country_code: countryCode.toLowerCase() })
    const region = regionsResult?.[0] || (await regionService.listRegions({}))?.[0]

    if (!region) {
      return res.status(400).json({ message: "No region found" })
    }

    // 2. Create cart with email
    const cart = await cartService.create({
      region_id: region.id,
      email,
    })

    // 3. Add the variant
    await cartService.addOrUpdateLineItems(cart.id, [{ variant_id: variantId, quantity: 1 }])

    // 4. Set addresses (needed for cart completion)
    const addressPayload = {
      first_name: firstName,
      last_name: lastName,
      phone,
      address_1: "Digital Delivery",
      city: "Online",
      country_code: countryCode,
      postal_code: "000000",
    }
    await cartService.update(cart.id, {
      shipping_address: addressPayload,
      billing_address: addressPayload,
    })

    // Log the booking for visibility
    console.log(
      `[Booking Order] Recorded offline order for ${email}: Razorpay ID ${razorpayPaymentId} | Variant ${variantId} | Date: ${bookingDate} ${bookingTime}`
    )

    // TODO: Medusa v2 cart completion with offline payment capture requires a payment session.
    // For now, we log the booking. Full order creation via Admin API is preferable.

    // 5. Send a confirmation email via notification service
    const notificationService = req.scope.resolve("notification") as any
    await notificationService.createNotifications([
      {
        to: email,
        channel: "email",
        template: "booking-confirmed",
        data: {
          subject: `Session Booking Confirmed - The Blissful Soul`,
          html_body: `
            <p>Hi ${firstName},</p>
            <p>Your session booking has been confirmed!</p>
            <ul>
              <li><strong>Date:</strong> ${bookingDate}</li>
              <li><strong>Time:</strong> ${bookingTime}</li>
              <li><strong>Payment ID:</strong> ${razorpayPaymentId}</li>
            </ul>
            <p>We will reach out to you on ${phone} to confirm the details.</p>
            <p>Thank you for booking with The Blissful Soul.</p>
          `,
        },
      },
    ])

    console.log(`[Booking Order] Confirmation email sent to ${email}`)

    return res.status(200).json({ success: true, message: "Booking recorded and email sent." })
  } catch (error: any) {
    console.error("[Booking Order] Error recording booking:", error.message)
    return res.status(500).json({ message: "Failed to record booking", error: error.message })
  }
}
