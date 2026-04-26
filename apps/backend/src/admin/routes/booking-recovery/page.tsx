import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ArrowPath, ExclamationCircle } from "@medusajs/icons"
import { Button, Heading, Input, Label, Text, Textarea, toast } from "@medusajs/ui"
import { useState } from "react"

const BookingRecoveryPage = () => {
  const [razorpayId, setRazorpayId] = useState("")
  const [payload, setPayload] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; orderId?: string } | null>(null)

  const handleRecover = async () => {
    if (!razorpayId.trim()) {
      toast.error("Razorpay Payment ID is required")
      return
    }

    let parsedPayload: Record<string, any> = {}
    if (payload.trim()) {
      try {
        parsedPayload = JSON.parse(payload)
      } catch {
        toast.error("Invalid JSON in booking details")
        return
      }
    }

    setLoading(true)
    setResult(null)

    try {
      const res = await fetch("/custom/booking-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          razorpayPaymentId: razorpayId.trim(),
          email: parsedPayload.email || "",
          firstName: parsedPayload.firstName || parsedPayload.first_name || "Customer",
          lastName: parsedPayload.lastName || parsedPayload.last_name || "",
          phone: parsedPayload.phone || "",
          countryCode: parsedPayload.countryCode || "in",
          bookingDate: parsedPayload.bookingDate || parsedPayload.booking_date || "",
          bookingTime: parsedPayload.bookingTime || parsedPayload.booking_time || "",
          price: parsedPayload.price || 0,
          calBookingId: parsedPayload.calBookingId || parsedPayload.cal_booking_id || "",
          calMeetUrl: parsedPayload.calMeetUrl || parsedPayload.cal_meet_url || "",
          eventSlug: parsedPayload.eventSlug || parsedPayload.event_slug || "",
          variantId: parsedPayload.variantId || parsedPayload.variant_id || "",
          isPackage: parsedPayload.isPackage || false,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setResult({ success: true, message: data.message, orderId: data.orderId })
        toast.success(data.message)
      } else {
        setResult({ success: false, message: data.message || "Recovery failed" })
        toast.error(data.message || "Recovery failed")
      }
    } catch (err: any) {
      setResult({ success: false, message: err.message })
      toast.error("Request failed: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-y-4 p-8 max-w-2xl">
      <div className="flex items-center gap-x-3">
        <ArrowPath className="text-ui-fg-subtle" />
        <Heading level="h1">Booking Recovery</Heading>
      </div>
      <Text className="text-ui-fg-subtle">
        Use this when a customer paid via Razorpay but their booking confirmation or order was not created.
        If the order already exists, it will resend the confirmation email instead of creating a duplicate.
      </Text>

      <div className="bg-ui-bg-base border-ui-border-base mt-2 flex flex-col gap-y-4 rounded-xl border p-6 shadow-elevation-card-rest">
        <div className="flex flex-col gap-y-1">
          <Label htmlFor="razorpay-id">Razorpay Payment ID *</Label>
          <Input
            id="razorpay-id"
            placeholder="pay_XXXXXXXXXXXXXXXXXX"
            value={razorpayId}
            onChange={(e) => setRazorpayId(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-y-1">
          <Label htmlFor="payload">Booking Details (JSON)</Label>
          <Text size="small" className="text-ui-fg-subtle">
            Paste the booking details from Razorpay notes or Cal.com. Required fields: email, firstName, bookingDate, bookingTime, price.
          </Text>
          <Textarea
            id="payload"
            placeholder={`{
  "email": "customer@example.com",
  "firstName": "Priya",
  "lastName": "Sharma",
  "phone": "+919876543210",
  "bookingDate": "2026-05-01",
  "bookingTime": "10:00 AM",
  "price": 150000,
  "calBookingId": "abc123",
  "calMeetUrl": "https://cal.com/...",
  "variantId": "variant_...",
  "eventSlug": "kundli-reading"
}`}
            rows={12}
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
          />
        </div>

        <Button onClick={handleRecover} isLoading={loading} className="w-fit">
          <ArrowPath />
          Run Recovery
        </Button>
      </div>

      {result && (
        <div className={`flex items-start gap-x-3 rounded-xl border p-4 ${result.success ? "bg-ui-bg-positive border-ui-border-positive" : "bg-ui-bg-error border-ui-border-error"}`}>
          <ExclamationCircle className={result.success ? "text-ui-fg-positive mt-0.5" : "text-ui-fg-error mt-0.5"} />
          <div>
            <Text weight="plus">{result.success ? "Success" : "Failed"}</Text>
            <Text size="small">{result.message}</Text>
            {result.orderId && <Text size="small" className="text-ui-fg-subtle mt-1">Order ID: {result.orderId}</Text>}
          </div>
        </div>
      )}
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Booking Recovery",
})

export default BookingRecoveryPage
