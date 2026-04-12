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
      const paymentCollectionResp = await initiatePaymentSession(freshCart, {
        provider_id: providerId,
        data: { cart: freshCart },
      } as any)

      // Extract Razorpay order ID from the payment session
      const paymentSession = (paymentCollectionResp as any)?.payment_collection?.payment_sessions?.find(
        (s: any) => s.provider_id?.toLowerCase().includes("razorpay")
      )
      const razorpayOrderId = paymentSession?.data?.id

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
        order_id: razorpayOrderId,
        amount: (cart.total || 0) * 100,
        currency: cart.currency_code?.toUpperCase() || "INR",
        name: "The Blissful Soul",
        description: "Order Payment",
        prefill: {
          name: ((cart.shipping_address?.first_name || "") + " " + (cart.shipping_address?.last_name || "")).trim(),
          email: cart.email || "",
          contact: cart.shipping_address?.phone || "",
        },
        theme: { color: "#2C1E36" },
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
    <div className="bg-transparent">
      <div className="flex flex-row items-center justify-between mb-8">
        <div className="flex flex-col gap-y-1">
           <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#C5A059]">Step III</span>
           <Heading
             level="h2"
             className={clx(
               "flex flex-row text-3xl font-serif text-[#2C1E36] font-bold gap-x-2 items-center",
               {
                 "opacity-50": !isOpen,
               }
             )}
           >
             Exchange
             {paymentDone && (
               <div className="bg-[#C5A059]/10 p-1.5 rounded-full">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
               </div>
             )}
           </Heading>
        </div>
      </div>

      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-500 pb-8">
          <div className="mb-8 p-8 bg-[#2C1E36]/5 rounded-[2.5rem] border border-[#2C1E36]/10 flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-black italic">
                 Energy Exchange Total
              </span>
              <span className="text-3xl font-serif font-black text-[#2C1E36]">
                {total}
              </span>
            </div>
            <p className="text-sm text-gray-500 italic leading-relaxed">
              Your transaction is encrypted and secure. We accept UPI, Cards, and Netbanking through our trusted partner, Razorpay.
            </p>
          </div>

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          <Button
            size="large"
            className="w-full rounded-xl py-4 h-auto text-[11px] uppercase tracking-[0.2em] font-black transition-all shadow-xl active:scale-95 shadow-purple-900/10 bg-[#2C1E36] text-white hover:opacity-90"
            onClick={handlePayNow}
            isLoading={isLoading}
            data-testid="submit-payment-button"
          >
            Finalize Sacred Order
          </Button>
          
          <div className="mt-6 flex items-center justify-center gap-x-4 opacity-40">
             <span className="text-[8px] uppercase tracking-[0.3em] font-bold">Encrypted Connection</span>
             <div className="h-px w-8 bg-black/20" />
             <span className="text-[8px] uppercase tracking-[0.3em] font-bold">Trusted Exchange</span>
          </div>
        </div>
      )}

      <div className="h-px w-full bg-gray-100 mt-12 mb-12" />
    </div>
  )
}

export default Payment
