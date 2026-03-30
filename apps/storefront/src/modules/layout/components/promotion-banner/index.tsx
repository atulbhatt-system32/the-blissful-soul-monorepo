"use client"

import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"

import "swiper/css"

const PromotionBanner = () => {
  const announcements = [
    "Buy 2 Products and Get 1 Free",
    "Shop for ₹1499 or more for a free Wealth Attraction Bag! It will be added to your cart automatically"
  ]

  return (
    <div className="w-full bg-[#EC4899] text-white py-1.5 overflow-hidden border-b border-white/10">
      <div className="max-w-[1440px] mx-auto">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          className="h-full w-full"
        >
          {announcements.map((text, idx) => (
            <SwiperSlide key={idx} className="flex items-center justify-center text-center">
              <span className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-medium leading-tight px-4 block truncate">
                {text}
              </span>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default PromotionBanner

