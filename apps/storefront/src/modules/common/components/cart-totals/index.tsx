"use client"

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

  const shipping_subtotal = (totals as any).shipping_total ?? totals.shipping_subtotal
  // For tax-inclusive pricing, ensure we use the inclusive values from items
  const items = (totals as any).items || []
  
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

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex flex-col gap-y-2 text-[10px] uppercase tracking-widest font-bold opacity-70">
        <div className="flex items-center justify-between">
          <span>Base Value</span>
          <span data-testid="cart-subtotal" data-value={item_inclusive}>
            {convertToLocale({ amount: item_inclusive, currency_code })}
          </span>
        </div>
        {!!shipping_subtotal && (
          <div className="flex items-center justify-between">
            <span>Shipping</span>
            <span data-testid="cart-shipping" data-value={shipping_subtotal}>
              {convertToLocale({ amount: shipping_subtotal, currency_code })}
            </span>
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
          data-value={total || 0}
        >
          {convertToLocale({ amount: total ?? 0, currency_code })}
        </span>
      </div>
    </div>
  )
}

export default CartTotals
