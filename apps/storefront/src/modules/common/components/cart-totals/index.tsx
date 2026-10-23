"use client"

import { isDigitalOnlyCart } from "@lib/util/is-digital-cart"
import { convertToLocale } from "@lib/util/money"
import React from "react"

type CartTotalsProps = {
  totals: {
    total?: number | null
    subtotal?: number | null
    tax_total?: number | null
    currency_code: string
    item_subtotal?: number | null
    shipping_subtotal?: number | null
    discount_subtotal?: number | null
  }
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  const {
    currency_code,
    total,
  } = totals

  const rawShipping = (totals as any).shipping_total ?? totals.shipping_subtotal ?? 0
  // Defensively guard against Medusa negative shipping bugs
  const shipping_subtotal = Math.max(0, rawShipping)
  // For tax-inclusive pricing, ensure we use the inclusive values from items
  const items = (totals as any).items || []
  
  // Detect if cart is digital-only (courses, sessions — no physical shipping needed)
  const isDigitalOnly = isDigitalOnlyCart(items)

  // item_total is the net inclusive total (after discounts)
  const item_total = items.length > 0 
    ? items.reduce((acc: number, item: any) => acc + (item.total ?? 0), 0)
    : ((total ?? 0) - (shipping_subtotal ?? 0))

  // item_subtotal is the gross inclusive total (before discounts)
  const item_subtotal = items.length > 0
    ? items.reduce((acc: number, item: any) => acc + (item.original_total ?? 0), 0)
    : (totals.item_subtotal ?? item_total)

  const discount_subtotal = item_subtotal - item_total
  const item_inclusive = item_subtotal

  // Guard displayTotal: if backend had negative shipping, add it back so the customer total is not reduced
  const safeTotal = rawShipping < 0 ? (total ?? 0) - rawShipping : (total ?? 0)
  const displayShipping = isDigitalOnly ? 0 : shipping_subtotal
  const displayTotal = isDigitalOnly ? (safeTotal - shipping_subtotal) : safeTotal

  const hasShippingMethod = ((totals as any).shipping_methods?.length ?? 0) > 0

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex flex-col gap-y-2 text-[10px] uppercase tracking-widest font-bold opacity-70">
        <div className="flex items-center justify-between">
          <span>Base Value</span>
          <span data-testid="cart-subtotal" data-value={item_inclusive}>
            {convertToLocale({ amount: item_inclusive, currency_code })}
          </span>
        </div>
        {displayShipping > 0 && (
          <div className="flex items-center justify-between">
            <span>Shipping</span>
            <span data-testid="cart-shipping" data-value={displayShipping}>
              {convertToLocale({ amount: displayShipping, currency_code })}
            </span>
          </div>
        )}
        {hasShippingMethod && displayShipping === 0 && !isDigitalOnly && (
          <div className="flex items-center justify-between">
            <span>Shipping</span>
            <span data-testid="cart-shipping" data-value={0} className="text-[#C5A059]">
              FREE
            </span>
          </div>
        )}
        {isDigitalOnly && (
          <div className="flex items-center justify-between text-emerald-400">
            <span>Shipping</span>
            <span>FREE (Digital)</span>
          </div>
        )}
        {!!discount_subtotal && (
          <div className="flex items-center justify-between text-[#C5A059]">
            <span>Discount</span>
            <span
              data-testid="cart-discount"
              data-value={discount_subtotal || 0}
            >
              -{" "}
              {convertToLocale({
                amount: discount_subtotal ?? 0,
                currency_code,
              })}
            </span>
          </div>
        )}
      </div>
      <div className="h-px w-full border-b border-current opacity-10 my-1" />
      <div className="flex items-center justify-between">
        <span className="text-[12px] uppercase tracking-widest font-black">Total</span>
        <span
          className="text-xl font-serif font-black"
          data-testid="cart-total"
          data-value={displayTotal || 0}
        >
          {convertToLocale({ amount: displayTotal ?? 0, currency_code })}
        </span>
      </div>
    </div>
  )
}

export default CartTotals

