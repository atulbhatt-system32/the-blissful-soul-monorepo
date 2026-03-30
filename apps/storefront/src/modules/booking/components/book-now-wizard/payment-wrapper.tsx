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
  eventSlug?: string // Added support for eventSlug
  price: number // price in smallest unit (paise) e.g. 299900 = ₹2999
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
      // Check if Razorpay SDK loaded
      if (!(window as any).Razorpay) {
        throw new Error("Razorpay SDK not loaded. Please refresh and try again.")
      }

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY
      if (!razorpayKey) {
        throw new Error("Razorpay key not configured.")
      }

      // Open Razorpay popup directly — no cart needed for session bookings
      const options = {
        key: razorpayKey,
        amount: price * 100, // Medusa stores in rupees, Razorpay expects paise
        currency: "INR",
        name: "The Blissful Soul",
        description: `Session Booking - ${date} ${time}`,
        prefill: {
          name: details.firstName + " " + details.lastName,
          email: details.email,
          contact: details.phone,
        },
        theme: { color: "#ec4899" },
        handler: async function (response: any) {
          // Payment successful!
          console.log("Payment successful:", response.razorpay_payment_id)
          
          // Create booking on Cal.com
          try {
            await createCalBooking({
              startTime: slotIsoStart,
              attendeeName: `${details.firstName} ${details.lastName}`,
              attendeeEmail: details.email,
              attendeeTimeZone: "Asia/Kolkata",
              eventSlug: eventSlug, // Use the dynamic slug selected from Medusa
              notes: `Payment ID: ${response.razorpay_payment_id} | Phone: ${details.phone}`,
            })
            console.log("Cal.com booking created successfully")
          } catch (calErr: any) {
            console.error("Cal.com booking creation failed:", calErr)
            // Payment was successful, so still show success but log the error
            // In production, you could queue this for retry
          }

          onSuccess()
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
          className="w-2/3 py-3 bg-pink-500 hover:bg-pink-600 border-none text-white text-md uppercase font-bold"
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
