"use client"

import { Button } from "@medusajs/ui"

import OrderCard from "../order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  if (orders?.length) {
    return (
      <div className="flex flex-col gap-y-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col gap-y-2 mb-4">
           <h1 className="text-3xl font-serif text-[#2C1E36] font-bold">Past Purchases</h1>
           <p className="text-gray-400 text-sm">A complete record of your healing journey and physical treasures.</p>
        </div>
        <div className="flex flex-col gap-y-8">
          {orders.map((o) => (
            <div
              key={o.id}
              className="pb-4"
            >
              <OrderCard order={o} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className="w-full flex flex-col items-center justify-center py-24 px-4 bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-700"
      data-testid="no-orders-container"
    >
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-8">
         <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2C1E36" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
      </div>
      <h2 className="text-2xl font-serif text-[#2C1E36] font-bold mb-2">Your history is empty</h2>
      <p className="text-gray-400 text-sm max-w-[280px] text-center leading-relaxed mb-10">
        You haven&apos;t embarked on any experiences or collected any items yet.
      </p>
      <LocalizedClientLink href="/store">
        <Button data-testid="continue-shopping-button" className="bg-[#2C1E36] text-white rounded-2xl px-10 py-5 h-auto text-[11px] uppercase tracking-[0.2em] font-black hover:opacity-90 shadow-xl shadow-purple-900/10 active:scale-95 transition-all">
          Explore The Collection
        </Button>
      </LocalizedClientLink>
    </div>
  )
}

export default OrderOverview
