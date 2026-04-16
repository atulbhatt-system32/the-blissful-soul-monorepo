"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { useMemo } from "react"

const MobileCartButton = ({ cart }: { cart: HttpTypes.StoreCart | null }) => {
  const totalItems = useMemo(() => {
    return cart?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0
  }, [cart])

  return (
    <LocalizedClientLink 
      href="/cart" 
      className="p-2 text-foreground hover:text-primary transition-colors flex items-center justify-center relative z-20"
      aria-label="Cart"
    >
      <div className="relative flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="pt-0.5">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        {totalItems > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-[#2C1E36] text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-background shadow-sm">
            {totalItems}
          </span>
        )}
      </div>
    </LocalizedClientLink>
  )
}

export default MobileCartButton
