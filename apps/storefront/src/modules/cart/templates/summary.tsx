"use client"

import { Button, Heading } from "@medusajs/ui"

import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-1">
        <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#C5A059]">Checkout Sanctum</span>
        <Heading level="h2" className="text-2xl font-serif text-white">
          Summary
        </Heading>
      </div>
      
      <div className="bg-white/5 backdrop-blur-md rounded-[1.5rem] p-4 border border-white/10">
        <DiscountCode cart={cart} />
      </div>

      <div className="text-purple-100">
        <CartTotals totals={cart} />
      </div>

      <LocalizedClientLink
        href={"/checkout?step=" + step}
        data-testid="checkout-button"
        className="w-full"
      >
        <Button className="w-full bg-[#C5A059] text-[#2C1E36] rounded-xl py-4 h-auto text-[10px] uppercase tracking-[0.2em] font-black hover:bg-white transition-all shadow-xl shadow-black/20 active:scale-[0.98] border-none">
          Commence Checkout
        </Button>
      </LocalizedClientLink>
      
      <div className="flex items-center justify-center gap-x-2">
         <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
         <span className="text-[9px] uppercase tracking-widest text-purple-300 font-bold">Secure spiritual transaction</span>
      </div>
    </div>
  )
}

export default Summary
