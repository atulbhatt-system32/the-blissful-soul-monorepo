"use client"

import React from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const PromotionBanner = ({ announcements }: { announcements?: { text: string; show_button?: boolean; link?: string }[] }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  
  const slides = announcements || []

  React.useEffect(() => {
    if (slides.length <= 1) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [slides])

  if (slides.length === 0) return null

  return (
    <div className="w-full bg-[#2C1E36] text-white py-2.5 overflow-hidden border-b border-white/5 h-[34px] md:h-10">
      <div className="content-container flex items-center justify-center text-center h-full relative">
        {slides.map((slide, index) => (
           <span 
            key={index}
            className={`text-[10px] md:text-[11px] uppercase tracking-[0.12em] font-medium leading-tight absolute left-0 right-0 transition-all duration-700 ease-in-out transform
              ${index === currentIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
          >
            {slide.text}
            {slide.show_button !== false && (
              <LocalizedClientLink 
                href={slide.link || "/store"} 
                className="ml-2 hover:text-white/80 transition-colors font-serif italic normal-case tracking-normal underline decoration-white/30 underline-offset-4 pointer-events-auto"
              >
                Shop now →
              </LocalizedClientLink>
            )}
          </span>
        ))}
      </div>
    </div>
  )
}

export default PromotionBanner

