import { Heading } from "@medusajs/ui"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className="flex flex-col gap-y-10">
      <div className="flex flex-col gap-y-1">
        <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#C5A059]">Order Review</span>
        <Heading level="h2" className="text-3xl font-serif text-white">
          Review
        </Heading>
      </div>

      <div className="flex flex-col gap-y-6">
        <div className="text-purple-100">
           <CartTotals totals={cart} />
        </div>
        
        <div className="h-px w-full bg-white/10" />
        
        <div className="flex flex-col gap-y-4">
           <span className="text-[10px] uppercase tracking-widest text-purple-300 font-bold">Items</span>
           <ItemsPreviewTemplate cart={cart} />
        </div>

        <div className="mt-4">
           <DiscountCode cart={cart} />
        </div>
      </div>
      
       <div className="flex items-center justify-center gap-x-2 opacity-50">
         <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
         <span className="text-[9px] uppercase tracking-widest text-purple-300 font-bold">Secure transaction</span>
      </div>
    </div>
  )
}

export default CheckoutSummary
