import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

export default async function calcomBookingHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const query = container.resolve("query")
  
  try {
    // Fetch full order details
    const { data: orders } = await (query as any).graph({
      entity: "order",
      fields: ["*", "items.*", "shipping_address.*", "billing_address.*"],
      filters: { id: data.id },
    })

    const order = orders?.[0]
    if (!order) return

    console.log(`[Cal.com] Checking Order #${data.id} for session bookings...`)

    // Skip if the webhook already created the Cal.com booking
    if (order.metadata?.cal_booking_uid) {
      console.log(`[Cal.com] Booking already exists for order #${data.id} — skipping`)
      return
    }

    const apiKey = process.env.CAL_API_KEY
    if (!apiKey) {
      console.warn("[Cal.com] CAL_API_KEY is not set. Cannot create bookings.")
      return
    }

    const authHeaders = {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    }

    // Process each item
    for (const item of order.items || []) {
      const metadata = item.metadata || {}

      if (metadata.is_session && !metadata.is_package && metadata.slot_iso_start && metadata.event_slug) {
        console.log(`[Cal.com] Found session booking for event slug: ${metadata.event_slug}`)

        try {
          // Try to map event_slug to eventTypeId
          let eventTypeId: number | undefined
          try {
            const typesAbort = new AbortController()
            const typesTimeout = setTimeout(() => typesAbort.abort(), 10000)
            const typesRes = await fetch("https://api.cal.com/v2/event-types", {
              headers: { ...authHeaders, "cal-api-version": "2024-06-14" },
              signal: typesAbort.signal,
            }).finally(() => clearTimeout(typesTimeout))
            if (typesRes.ok) {
              const typesData = await typesRes.json()
              const types = typesData.data || typesData || []
              const matched = types.find((t: any) => t.slug === metadata.event_slug)
              if (matched) {
                eventTypeId = matched.id
                console.log(`[Cal.com] Resolved eventTypeId=${eventTypeId} for slug="${metadata.event_slug}"`)
              } else {
                console.warn(`[Cal.com] No eventType matched slug="${metadata.event_slug}"`)
              }
            } else {
              console.warn(`[Cal.com] event-types lookup returned ${typesRes.status}`)
            }
          } catch (e: any) {
            console.error("[Cal.com] Failed to resolve event type ID:", e?.name === "AbortError" ? "TIMEOUT" : e?.message)
          }

          const attendeeName = `${metadata.patient_firstName || order.shipping_address?.first_name || ''} ${metadata.patient_lastName || order.shipping_address?.last_name || ''}`.trim()
          const attendeeEmail = metadata.patient_email || order.email
          const bookingPayload: any = {
            start: metadata.slot_iso_start,
            attendee: {
              name: attendeeName || "Valued Client",
              email: attendeeEmail,
              timeZone: "Asia/Kolkata",
            },
            bookingFieldsResponses: { title: "Session Booking" },
          }

          if (eventTypeId) {
            bookingPayload.eventTypeId = eventTypeId
          } else {
            bookingPayload.eventTypeSlug = metadata.event_slug
            bookingPayload.username = process.env.CAL_USERNAME || ""
          }

          console.log(`[Cal.com] Creating booking for ${attendeeEmail} | eventTypeId=${eventTypeId ?? "slug-fallback"}`)

          const bookAbort = new AbortController()
          const bookTimeout = setTimeout(() => bookAbort.abort(), 10000)
          const bookStart = Date.now()
          const bookRes = await fetch("https://api.cal.com/v2/bookings", {
            method: "POST",
            headers: { ...authHeaders, "cal-api-version": "2026-02-25" },
            body: JSON.stringify(bookingPayload),
            signal: bookAbort.signal,
          }).finally(() => clearTimeout(bookTimeout))
          console.log(`[Cal.com] Booking response: ${bookRes.status} in ${Date.now() - bookStart}ms`)

          if (!bookRes.ok) {
            const errText = await bookRes.text()
            console.error(`[Cal.com] Booking failed for item ${item.title}:`, errText)
          } else {
            const resJson = await bookRes.json()
            const calBookingUid = resJson.data?.uid || resJson.data?.id
            const meetUrl = resJson.data?.meetingUrl
              || resJson.data?.references?.find((r: any) => r.meetingUrl)?.meetingUrl
              || null

            console.log(`[Cal.com] Booking success for ${item.title}. UID: ${calBookingUid} | Meet URL: ${meetUrl}`)

            // Save the Cal Video meet URL back to order metadata so reminders and WhatsApp can use it
            if (meetUrl) {
              const orderModuleService = container.resolve("order") as any
              try {
                await orderModuleService.updateOrders([{
                  id: order.id,
                  metadata: {
                    ...order.metadata,
                    cal_meet_url: meetUrl,
                    cal_booking_uid: calBookingUid,
                  }
                }])
                console.log(`[Cal.com] Saved meet URL to order ${order.id}: ${meetUrl}`)
              } catch (updateErr: any) {
                console.error(`[Cal.com] Failed to save meet URL to order:`, updateErr.message)
              }
            }
          }

        } catch (bookingErr) {
          console.error(`[Cal.com] Exception while creating booking for ${item.title}:`, bookingErr)
        }
      }
    }
  } catch (error) {
    console.error(`[Cal.com] Subscriber error for order #${data.id}:`, error)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
