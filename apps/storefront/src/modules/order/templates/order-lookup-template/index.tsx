"use client"

import { useActionState } from "react"
import { lookupOrder } from "@lib/data/orders"
import { Heading, Text, Button } from "@medusajs/ui"
import Input from "@modules/common/components/input"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import ErrorMessage from "@modules/checkout/components/error-message"
import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import SessionBooking from "@modules/order/components/session-booking"

const OrderLookupTemplate = () => {
  const [state, formAction] = useActionState(lookupOrder, {
    success: false,
    error: null,
    order: null,
  })

  const router = useRouter()
  const params = useParams()
  const countryCode = params.countryCode as string

  if (state.success && state.order) {
    const order = state.order
    
    // Check if order contains a session
    const sessionItems = order.items?.filter((item: any) => {
      const product = item.variant?.product
      return (
        product?.type?.value === "session" || 
        product?.tags?.some((t: any) => t.value === "session") ||
        product?.metadata?.is_service === true ||
        product?.metadata?.is_service === "true"
      )
    })

    const hasSession = sessionItems && sessionItems.length > 0
    const firstSession = hasSession ? sessionItems[0] : null
    const calLink = (firstSession?.variant?.metadata?.cal_link || firstSession?.variant?.product?.metadata?.cal_link) as string | undefined

    return (
      <div className="py-6 min-h-[calc(100vh-64px)] w-full flex justify-center px-8">
        <div className="content-container flex flex-col justify-center items-center gap-y-10 max-w-4xl h-full w-full">
          {hasSession && calLink && (
            <div className="w-full bg-pink-50/50 p-8 rounded-2xl border border-pink-100 shadow-sm mb-6 mt-10">
              <Heading level="h2" className="text-pink-900 font-serif mb-4 text-center">
                Schedule Your Session
              </Heading>
              <p className="text-pink-700 text-center mb-8 italic">
                Please select a convenient time slot below to finalize your booking.
              </p>
              <SessionBooking 
                calLink={calLink} 
                customerName={`${order.shipping_address?.first_name} ${order.shipping_address?.last_name}`}
                customerEmail={order.email || ""}
              />
            </div>
          )}

          <div
            className="flex flex-col gap-4 max-w-4xl h-full bg-white w-full py-10"
            data-testid="order-complete-container"
          >
            <Heading
              level="h1"
              className="flex flex-col gap-y-3 text-ui-fg-base text-3xl mb-4"
            >
              Order Details
            </Heading>
            <OrderDetails order={order} showStatus />
            <Heading level="h2" className="flex flex-row text-3xl-regular mt-6">
              Summary
            </Heading>
            <Items order={order} />
            <CartTotals totals={order} />
            <ShippingDetails order={order} />
            <PaymentDetails order={order} />
            <Help />

            <div className="mt-10 pt-6">
              <Button 
                variant="secondary" 
                onClick={() => window.location.reload()}
              >
                Track Another Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex justify-center px-8 py-16 min-h-[60vh]">
      <div className="max-w-sm w-full flex flex-col items-center">
        <Heading level="h1" className="text-3xl-semi uppercase mb-6 text-center">
          Track Your Order
        </Heading>
        <Text className="text-center text-base-regular text-ui-fg-base mb-8">
          Enter your Order ID and the Email address used during checkout to view your order status and details.
        </Text>
        <form className="w-full flex flex-col gap-y-4" action={formAction}>
          <div className="flex flex-col w-full gap-y-2">
            <Input
              label="Order ID"
              name="display_id"
              type="text"
              required
              data-testid="order-id-input"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              required
              data-testid="email-input"
            />
          </div>
          <ErrorMessage error={state.error} data-testid="lookup-error-message" />
          <SubmitButton data-testid="lookup-button" className="w-full mt-2">
            Track Order
          </SubmitButton>
        </form>
        
        <div className="mt-10 border-t border-ui-border-base pt-6 w-full text-center">
          <Text className="text-small-regular text-ui-fg-subtle mb-4">
            Have an account?
          </Text>
          <Button 
            variant="secondary" 
            className="w-full"
            onClick={() => router.push(`/${countryCode}/account`)}
          >
            Sign in to see full history
          </Button>
        </div>
      </div>
    </div>
  )
}

export default OrderLookupTemplate
