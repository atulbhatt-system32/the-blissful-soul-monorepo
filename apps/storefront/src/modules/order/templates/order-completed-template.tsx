import { Heading } from "@medusajs/ui"
import { cookies as nextCookies } from "next/headers"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import { HttpTypes } from "@medusajs/types"
import SessionBooking from "@modules/order/components/session-booking"
import GuestAutoRegister from "@modules/order/components/guest-auto-register"
import { retrieveCustomer } from "@lib/data/customer"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"
  const customer = await retrieveCustomer()

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
    <div className="py-6 min-h-[calc(100vh-64px)]">
      <div className="content-container flex flex-col justify-center items-center gap-y-10 max-w-4xl h-full w-full">
        {isOnboarding && <OnboardingCta orderId={order.id} />}
        
        {!customer && (
          <GuestAutoRegister 
            email={order.email || ""} 
            firstName={order.shipping_address?.first_name || ""} 
            lastName={order.shipping_address?.last_name || ""}
            phone={order.shipping_address?.phone || ""}
          />
        )}
        
        {hasSession && calLink && (
          <div className="w-full bg-pink-50/50 p-8 rounded-2xl border border-pink-100 shadow-sm mb-6">
            <Heading level="h2" className="text-pink-900 font-serif mb-4 text-center">
              Schedule Your Session
            </Heading>
            <p className="text-pink-700 text-center mb-8 italic">
              Thank you for your purchase! Please select a convenient time slot below to finalize your booking.
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
            className="flex flex-col gap-y-3 text-ui-fg-base text-3xl mb-4 text-center"
          >
            <span>Thank you!</span>
            <span>Your order was placed successfully.</span>
          </Heading>
          <OrderDetails order={order} />
          <Heading level="h2" className="flex flex-row text-3xl-regular">
            Summary
          </Heading>
          <Items order={order} />
          <CartTotals totals={order} />
          <ShippingDetails order={order} />
          <PaymentDetails order={order} />
          <Help />
        </div>
      </div>
    </div>
  )
}
