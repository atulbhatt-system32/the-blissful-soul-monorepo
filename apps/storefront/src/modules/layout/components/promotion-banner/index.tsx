"use client"

import React from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const PromotionBanner = () => {
  return (
    <div className="w-full bg-[#2C1E36] text-white py-2.5 overflow-hidden border-b border-white/5">
      <div className="content-container flex items-center justify-center text-center">
        <span className="text-[10px] md:text-[11px] uppercase tracking-[0.12em] font-medium leading-tight">
          Use <span className="font-bold text-amber-300">WELCOME</span> for ₹200 off · <span className="font-bold text-amber-300">HEAL10</span> for 10% off sessions · <span className="font-bold text-amber-300">CRYSTAL20</span> for 20% off crystals
          <LocalizedClientLink href="/store" className="ml-2 hover:text-white/80 transition-colors font-serif italic normal-case tracking-normal underline decoration-white/30 underline-offset-4">
            Shop now →
          </LocalizedClientLink>
        </span>
      </div>
    </div>
  )
}

export default PromotionBanner

