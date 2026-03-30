"use client"

import { initiatePaymentSession, placeOrder, retrieveCart } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { Button, Heading, Text, clx } from "@medusajs/ui"
import { CheckCircleSolid } from "@medusajs/icons"
import ErrorMessage from "@modules/checkout/components/error-message"
import Divider from "@modules/common/components/divider"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const Payment = ({
  cart,
  availablePaymentMethods,
  isDigitalOnly = false,
}: {
  cart: any
  availablePaymentMethods: any[]
  isDigitalOnly?: boolean
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentDone, setPaymentDone] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  // Load Razorpay SDK
  useEffect(() => {
    if (typeof window !== "undefined" && !(window as any).Razorpay) {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const handlePayNow = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Get a FRESH cart from the server (the prop may be stale)
      const freshCart = await retrieveCart()
      if (!freshCart) {
        throw new Error("Could not retrieve cart. Please refresh the page.")
      }

      // Find Razorpay provider
      const razorpayProvider = availablePaymentMethods?.find(
        (p: any) => p.id?.toLowerCase().includes("razorpay")
      )
      const providerId = razorpayProvider?.id || availablePaymentMethods?.[0]?.id || "pp_razorpay_razorpay"

      // Initialize payment session with FRESH cart
      await initiatePaymentSession(freshCart, {
        provider_id: providerId,
      })

      // Check Razorpay SDK
      if (typeof window === "undefined" || !(window as any).Razorpay) {
        throw new Error("Razorpay SDK not loaded. Please refresh and try again.")
      }

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY
      if (!razorpayKey) {
        throw new Error("Razorpay key not configured. Add NEXT_PUBLIC_RAZORPAY_KEY to .env.local")
      }

      // Open Razorpay popup
      const options = {
        key: razorpayKey,
        amount: (cart.total || 0) * 100,
        currency: cart.currency_code?.toUpperCase() || "INR",
        name: "The Blissful Soul",
        description: "Order Payment",
        prefill: {
          name: ((cart.shipping_address?.first_name || "") + " " + (cart.shipping_address?.last_name || "")).trim(),
          email: cart.email || "",
          contact: cart.shipping_address?.phone || "",
        },
        theme: { color: "#ec4899" },
        handler: async function () {
          try {
            await placeOrder()
          } catch (err: any) {
            setError(err.message || "Failed to place order.")
            setIsLoading(false)
          }
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false)
          }
        }
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.on("payment.failed", function (response: any) {
        setError("Payment failed: " + (response?.error?.description || "Unknown error"))
        setIsLoading(false)
      })
      rzp.open()

    } catch (err: any) {
      console.error(err)
      setError(err?.message || "An error occurred starting payment.")
      setIsLoading(false)
    }
  }

  const total = convertToLocale({
    amount: cart.total || 0,
    currency_code: cart.currency_code || "INR",
  })

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none": !isOpen,
            }
          )}
        >
          Payment
        </Heading>
        {!isOpen &&
          cart?.shipping_address &&
          cart?.billing_address &&
          cart?.email && (
            <Text>
              <button
                onClick={handleEdit}
                className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
                data-testid="edit-payment-button"
              >
                Edit
              </button>
            </Text>
          )}
      </div>

      {isOpen && (
        <div>
          <div className="mb-6 p-5 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <Text className="txt-medium-plus text-ui-fg-base font-semibold">
                Order Total
              </Text>
              <Text className="text-xl font-bold text-pink-500">
                {total}
              </Text>
            </div>
            <Text className="txt-small text-ui-fg-muted">
              Click below to pay securely via Razorpay (UPI, Cards, Netbanking)
            </Text>
          </div>

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          <Button
            size="large"
            className="mt-4 w-full bg-pink-500 hover:bg-pink-600 border-none text-white font-bold uppercase tracking-wider"
            onClick={handlePayNow}
            isLoading={isLoading}
            data-testid="submit-payment-button"
          >
            Pay Now
          </Button>
        </div>
      )}

      <Divider className="mt-8" />
    </div>
  )
}

export default Payment
