"use client"

import React, { useState, useEffect } from "react"
import ErrorMessage from "@modules/checkout/components/error-message"
import { Button } from "@medusajs/ui"
import { createCalBooking } from "@lib/data/calcom"

export default function MedusaCheckoutPayment({
  serviceId,
  variantId,
  details,
  date,
  time,
  slotIsoStart,
  countryCode,
  eventSlug,
  price,
  onSuccess,
  onBack
}: {
  serviceId: string
  variantId: string
  details: { firstName: string, lastName: string, email: string, phone: string }
  date: string
  time: string
  slotIsoStart: string
  countryCode: string
  eventSlug?: string
  price: number
  onSuccess: () => void
  onBack: () => void
}) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load Razorpay SDK on mount
  useEffect(() => {
    if (!(window as any).Razorpay) {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  const handleBookingPayment = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      if (!(window as any).Razorpay) {
        throw new Error("Razorpay SDK not loaded. Please refresh and try again.")
      }

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY
      if (!razorpayKey) {
        throw new Error("Razorpay key not configured.")
      }

      const options = {
        key: razorpayKey,
        amount: price * 100,
        currency: "INR",
        name: "The Blissful Soul",
        description: `Session Booking - ${date} ${time}`,
        prefill: {
          name: `${details.firstName} ${details.lastName}`,
          email: details.email,
          contact: details.phone,
        },
        theme: { color: "#2C1E36" },
        handler: async function (response: any) {
          console.log("Payment successful:", response.razorpay_payment_id)
          
          // Always call onSuccess — never let Cal.com or backend errors block the user
          try {
            let calBookingId = null
            // 1. Create Cal.com booking only if we have a slug
            if (eventSlug) {
              try {
                const calResult = await createCalBooking({
                  startTime: slotIsoStart,
                  attendeeName: `${details.firstName} ${details.lastName}`,
                  attendeeEmail: details.email,
                  attendeeTimeZone: "Asia/Kolkata",
                  eventSlug: eventSlug,
                  notes: `Payment ID: ${response.razorpay_payment_id} | Phone: ${details.phone}`,
                })
                calBookingId = calResult?.uid
                console.log("Cal.com booking created successfully:", calBookingId)
              } catch (calErr: any) {
                console.error("Cal.com booking failed (non-blocking):", calErr?.message)
              }
            } else {
              console.warn("No eventSlug for this product — Cal.com booking skipped.")
            }

            // 2. Send confirmation email via Next.js API proxy (avoids CORS)
            try {
              await fetch(`/api/booking-confirmation`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  variantId,
                  email: details.email,
                  firstName: details.firstName,
                  lastName: details.lastName,
                  phone: details.phone,
                  countryCode,
                  razorpayPaymentId: response.razorpay_payment_id,
                  bookingDate: date,
                  bookingTime: time,
                  price: price,
                  calBookingId,
                  eventSlug, // Pass the event slug for rescheduling
                }),
              })
              console.log("Confirmation email triggered.")
            } catch (emailErr: any) {
              console.error("Email trigger failed (non-blocking):", emailErr?.message)
            }
          } catch (err: any) {
            console.error("Post-payment processing error:", err?.message)
          } finally {
            // Always advance to success screen
            onSuccess()
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false)
          }
        }
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.on("payment.failed", function (response: any) {
        setError("Payment failed: " + (response?.error?.description || "Unknown error"))
        setIsProcessing(false)
      })
      rzp.open()

    } catch (err: any) {
      console.error(err)
      setError(err?.message || "There was an error starting the payment.")
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Button
          variant="secondary"
          size="large"
          className="w-1/3 py-3"
          onClick={onBack}
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button
          className="w-2/3 py-3 bg-[#2C1E36] hover:opacity-90 border-none text-white text-md uppercase font-bold"
          size="large"
          onClick={handleBookingPayment}
          isLoading={isProcessing}
          data-testid="booking-payment-button"
        >
          Pay & Confirm Booking
        </Button>
      </div>

      {error && <ErrorMessage error={error} data-testid="booking-payment-error" />}
    </div>
  )
}
