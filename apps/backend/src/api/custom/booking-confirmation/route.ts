import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { generateInvoice } from "../../../lib/invoice"

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
  price: number
  calBookingId: string
  calMeetUrl?: string
  eventSlug: string
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
    price,
    calBookingId,
    calMeetUrl,
    eventSlug,
  } = req.body as BookingOrderPayload

  console.log(`[Booking Confirmation] Processing for ${email} | Razorpay: ${razorpayPaymentId} | Cal: ${calBookingId}`)

  if (!email || !razorpayPaymentId) {
    return res.status(400).json({ message: "Missing email or payment ID" })
  }

  try {
    console.log(
      `[Booking Confirmation] Sending email to ${email} for booking on ${bookingDate} at ${bookingTime} | Razorpay: ${razorpayPaymentId}`
    )

    // 1. Resolve services
    const orderModuleService = req.scope.resolve(Modules.ORDER) as any
    const regionModuleService = req.scope.resolve(Modules.REGION) as any
    const customerModuleService = req.scope.resolve(Modules.CUSTOMER) as any

    // 2. Get default region
    const [regions] = await regionModuleService.listAndCountRegions({})
    const region = regions[0]

    if (!region) {
      console.error("[Booking Order] No regions found.")
      return res.status(400).json({ message: "No region found" })
    }

    // 3. Resolve customer if exists
    let customerId: string | undefined
    try {
      const [customers] = await customerModuleService.listAndCountCustomers({ email })
      if (customers.length > 0) {
        customerId = customers[0].id
      }
    } catch (e: any) {
      console.warn("[Booking Order] Could not resolve customer:", e.message)
    }

    // 4. Create Order directly via order module
    const addressPayload = {
      first_name: firstName,
      last_name: lastName || "Customer",
      phone: phone || "",
      address_1: "Digital Delivery",
      city: "Online",
      country_code: countryCode || "in",
      postal_code: "000000",
    }

    const order = await orderModuleService.createOrders({
      region_id: region.id,
      customer_id: customerId,
      email: email,
      currency_code: region.currency_code || "inr",
      shipping_address: addressPayload,
      billing_address: addressPayload,
      metadata: {
        is_session: true,
        razorpay_id: razorpayPaymentId,
        booking_date: bookingDate,
        booking_time: bookingTime,
        cal_booking_id: calBookingId,
        cal_meet_url: calMeetUrl,
        cal_event_slug: eventSlug,
      },
    })

    console.log(`[Booking Order] Created order ${order.id} for ${email}`)

    // 5. Add line item to the order
    await orderModuleService.createOrderLineItems(order.id, [
      {
        title: `Session Booking - ${bookingDate} ${bookingTime}`,
        quantity: 1,
        unit_price: price || 0,
        metadata: {
          booking_date: bookingDate,
          booking_time: bookingTime,
          razorpay_id: razorpayPaymentId,
          variant_id: variantId,
        },
      },
    ])

    console.log(`[Booking Order] Added line item to order ${order.id}`)

    // 6. Generate PDF invoice
    const invoiceOrder = {
      created_at: order.created_at || new Date().toISOString(),
      display_id: order.display_id || order.id,
      shipping_address: {
        first_name: firstName,
        last_name: lastName || "Customer",
        address_1: "Digital Delivery",
        address_2: "",
        city: "Online",
        postal_code: "000000",
        phone: phone || "",
        province: null,
        country_code: countryCode || "in",
      },
      items: [
        {
          title: `Session Booking - ${bookingDate} ${bookingTime}`,
          quantity: 1,
          unit_price: price || 0,
          adjustments: [],
          tax_lines: [],
        },
      ],
      shipping_total: 0,
      shipping_methods: [],
      payment_collections: [
        { payments: [{ provider_id: "razorpay" }] },
      ],
    }

    const pdfBuffer = await generateInvoice(invoiceOrder)
    const pdfBase64 = pdfBuffer.toString("base64")

    // 7. Send a confirmation email via notification service
    const notificationService = req.scope.resolve("notification") as any
    const notifications: any[] = [
      {
        to: email,
        channel: "email",
        template: "booking-confirmed",
        data: {
          subject: `Session Booking Confirmed - The Blissful Soul`,
          html_body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #fafafa; border-radius: 8px;">
              <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 4px;">Booking Confirmed! ✓</h1>
              <p style="color: #555; font-size: 14px; margin-bottom: 8px;">Order ID: ${order.display_id || order.id}</p>
              <p style="color: #555; font-size: 14px; margin-bottom: 24px;">The Blissful Soul</p>
              
              <p style="color: #333;">Hi <strong>${firstName}</strong>,</p>
              <p style="color: #333;">Your session booking has been confirmed. Here are your booking details:</p>
              
              <div style="background: #fff; border: 1px solid #e5e5e5; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #f0f0f0;">
                    <td style="padding: 10px 0; color: #666; font-size: 14px;">Date</td>
                    <td style="padding: 10px 0; color: #1a1a1a; font-weight: bold; text-align: right;">${bookingDate}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f0f0f0;">
                    <td style="padding: 10px 0; color: #666; font-size: 14px;">Time</td>
                    <td style="padding: 10px 0; color: #1a1a1a; font-weight: bold; text-align: right;">${bookingTime}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f0f0f0;">
                    <td style="padding: 10px 0; color: #666; font-size: 14px;">Payment ID</td>
                    <td style="padding: 10px 0; color: #1a1a1a; font-size: 12px; text-align: right;">${razorpayPaymentId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666; font-size: 14px;">Contact</td>
                    <td style="padding: 10px 0; color: #1a1a1a; text-align: right;">${phone}</td>
                  </tr>
                </table>
              </div>

              ${calMeetUrl ? `
              <div style="margin: 30px 0; text-align: center; background: #2C1E36; padding: 25px; border-radius: 12px; border: 1px solid #C5A059;">
                <p style="margin-top: 0; color: #C5A059; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Private Meeting Link</p>
                <a href="${calMeetUrl}" style="background: #C5A059; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px; margin: 10px 0;">Join Live Session</a>
                <p style="margin-bottom: 0; color: rgba(197, 160, 89, 0.6); font-size: 11px;">Direct Link: ${calMeetUrl}</p>
              </div>
              ` : `
              <p style="color: #333; background: #fff9eb; padding: 15px; border-radius: 8px; border: 1px solid #ffe6a8; font-size: 14px;">
                <strong>Note:</strong> Your unique meeting link will be sent to you via email shortly before the session starts.
              </p>
              `}
              
              <p style="color: #333;">Thank you for trusting <strong>The Blissful Soul</strong> on your journey. 🙏</p>
              
              <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
              <p style="color: #999; font-size: 12px;">If you have any questions, please contact us at support@theblissfulsoul.com</p>
            </div>
          `,
          pdf_attachments: [
            {
              content: pdfBase64,
              encoding: "base64",
              filename: `invoice_${order.display_id || order.id}.pdf`,
              contentType: "application/pdf",
            },
          ],
        },
      }
    ]

    if (process.env.ADMIN_NOTIFICATION_EMAIL) {
      notifications.push({
        to: process.env.ADMIN_NOTIFICATION_EMAIL,
        channel: "email",
        template: "booking-admin-notification",
        data: {
          subject: `NEW BOOKING: ${firstName} for ${bookingDate} at ${bookingTime}`,
          html_body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #e0f2f1; border-radius: 8px;">
              <h2>New Session Booked! ✅</h2>
              <p>A new booking has been confirmed via Razorpay.</p>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td><strong>Customer:</strong></td><td>${firstName} ${lastName}</td></tr>
                <tr><td><strong>Email:</strong></td><td>${email}</td></tr>
                <tr><td><strong>Phone:</strong></td><td>${phone}</td></tr>
                <tr><td><strong>Date:</strong></td><td>${bookingDate}</td></tr>
                <tr><td><strong>Time:</strong></td><td>${bookingTime}</td></tr>
                <tr><td><strong>Order ID:</strong></td><td>#${order.display_id || order.id}</td></tr>
                <tr><td><strong>Razorpay ID:</strong></td><td>${razorpayPaymentId}</td></tr>
              </table>
              <p>Please prepare for the session accordingly.</p>
            </div>
          `,
        },
      })
    }

    await notificationService.createNotifications(notifications)

    console.log(`[Booking Confirmation] Email sent successfully to ${email}`)
    return res.status(200).json({ success: true, orderId: order.id, message: "Booking recorded and email sent." })
  } catch (error: any) {
    console.error("[Booking Confirmation] Error:", error.message)
    console.error("[Booking Confirmation] Stack:", error.stack)
    return res.status(500).json({ message: "Failed to process booking", error: error.message })
  }
}
