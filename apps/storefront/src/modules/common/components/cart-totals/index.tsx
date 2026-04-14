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

  const item_subtotal = totals.item_subtotal ?? (totals as any).subtotal
  const shipping_subtotal = totals.shipping_subtotal ?? (totals as any).shipping_total
  const discount_subtotal = totals.discount_subtotal ?? (totals as any).discount_total

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex flex-col gap-y-2 text-[10px] uppercase tracking-widest font-bold opacity-70">
        <div className="flex items-center justify-between">
          <span>Base Value</span>
          <span data-testid="cart-subtotal" data-value={item_subtotal || 0}>
            {convertToLocale({ amount: item_subtotal ?? 0, currency_code })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Logistics</span>
          <span data-testid="cart-shipping" data-value={shipping_subtotal || 0}>
            {convertToLocale({ amount: shipping_subtotal ?? 0, currency_code })}
          </span>
        </div>
        {!!discount_subtotal && (
          <div className="flex items-center justify-between text-[#C5A059]">
            <span>Divine Discount</span>
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
        <div className="flex items-center justify-between">
          <span>Taxes</span>
          <span data-testid="cart-taxes">GST Included</span>
        </div>
      </div>
      <div className="h-px w-full border-b border-current opacity-10 my-1" />
      <div className="flex items-center justify-between">
        <span className="text-[12px] uppercase tracking-widest font-black">Sum Total</span>
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
