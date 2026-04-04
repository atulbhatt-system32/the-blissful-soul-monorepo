"use client"

import { XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import OrderSummary from "@modules/order/components/order-summary"
import ShippingDetails from "@modules/order/components/shipping-details"
import SessionBooking from "@modules/order/components/session-booking"
import React from "react"

type OrderDetailsTemplateProps = {
  order: HttpTypes.StoreOrder
}

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
}) => {
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
    <div className="flex flex-col justify-center gap-y-4">
      <div className="flex gap-2 justify-between items-center">
        <h1 className="text-2xl-semi">Order details</h1>
        <LocalizedClientLink
          href="/account/orders"
          className="flex gap-2 items-center text-ui-fg-subtle hover:text-ui-fg-base"
          data-testid="back-to-overview-button"
        >
          <XMark /> Back to overview
        </LocalizedClientLink>
      </div>

      {hasSession && calLink && (
        <div className="w-full bg-pink-50/50 p-8 rounded-2xl border border-pink-100 shadow-sm mb-2 mt-4">
          <Heading level="h2" className="text-pink-900 font-serif mb-4 text-center">
            Your Session Booking
          </Heading>
          <p className="text-pink-700 text-center mb-8 italic">
            You can view or reschedule your booked time slot directly from below.
          </p>
          <SessionBooking 
            calLink={calLink} 
            customerName={`${order.shipping_address?.first_name || ""} ${order.shipping_address?.last_name || ""}`.trim()}
            customerEmail={order.email || ""}
          />
        </div>
      )}

      <div
        className="flex flex-col gap-4 h-full bg-white w-full"
        data-testid="order-details-container"
      >
        <OrderDetails order={order} showStatus />
        <Items order={order} />
        <ShippingDetails order={order} />
        <OrderSummary order={order} />
        <Help />
      </div>
    </div>
  )
}

export default OrderDetailsTemplate
