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

    const apiKey = process.env.CAL_API_KEY || process.env.NEXT_PUBLIC_CAL_API_KEY
    if (!apiKey) {
      console.warn("[Cal.com] CAL_API_KEY is not set. Cannot create bookings.")
      return
    }

    const headers = {
      "Authorization": `Bearer ${apiKey}`,
      "cal-api-version": "2024-09-04",
      "Content-Type": "application/json",
    }

    // Process each item
    for (const item of order.items || []) {
      const metadata = item.metadata || {}
      
      if (metadata.is_session && !metadata.is_package && metadata.slot_iso_start && metadata.event_slug) {
        console.log(`[Cal.com] Found session booking for event slug: ${metadata.event_slug}`)
        
        try {
          // Try to map event_slug to eventTypeId
          let eventTypeId = undefined
          try {
            const typesRes = await fetch("https://api.cal.com/v2/event-types", { headers })
            if (typesRes.ok) {
              const typesData = await typesRes.json()
              const types = typesData.data || typesData || []
              const matched = types.find((t: any) => t.slug === metadata.event_slug)
              if (matched) {
                eventTypeId = matched.id
              }
            }
          } catch (e) {
            console.error("[Cal.com] Failed to resolve event type ID", e)
          }

          const attendeeName = `${metadata.patient_firstName || order.shipping_address?.first_name || ''} ${metadata.patient_lastName || order.shipping_address?.last_name || ''}`.trim()
          const attendeeEmail = metadata.patient_email || order.email
          const phone = metadata.patient_phone || order.shipping_address?.phone || ''

          const bookingPayload = {
            start: metadata.slot_iso_start,
            eventTypeId: eventTypeId, // Recommended if resolving works
            attendee: {
              name: attendeeName || "Valued Client",
              email: attendeeEmail,
              timeZone: "Asia/Kolkata",
            },
            notes: `Phone: ${phone} | Order ID: ${order.display_id}`,
          }

          console.log("[Cal.com] Payload:", bookingPayload)

          const bookRes = await fetch("https://api.cal.com/v2/bookings", {
            method: "POST",
            headers,
            body: JSON.stringify(bookingPayload)
          })

          if (!bookRes.ok) {
            const errText = await bookRes.text()
            console.error(`[Cal.com] Booking failed for item ${item.title}:`, errText)
          } else {
            const resJson = await bookRes.json()
            console.log(`[Cal.com] Booking success for ${item.title}. UID:`, resJson.data?.uid || resJson.data?.id)
            
            // We could theoretically update the order item with the Cal.com meeting URL here,
            // but since invoices are sent immediately, it's a bit tricky to sync perfectly.
            // The user will get the Cal.com email separately anyway.
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
