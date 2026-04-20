"use client"

import React from "react"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { motion } from "framer-motion"

const intentConfig = [
  { 
    key: "love",       
    label: "Love",       
    id: "collection-love",       
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    )
  },
  { 
    key: "money",      
    label: "Money",      
    id: "collection-money",      
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="8" r="6" />
        <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
        <path d="M7 6h1v4" />
        <path d="m16.71 13.88.7.71-2.82 2.82" />
      </svg>
    )
  },
  { 
    key: "health",     
    label: "Health",     
    id: "collection-health",     
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2Z" />
      </svg>
    )
  },
  { 
    key: "protection", 
    label: "Protection", 
    id: "collection-protection", 
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    )
  },
]

const ShopByIntentClient = ({ 
  intents, 
  region 
}: { 
  intents: any[], 
  region: HttpTypes.StoreRegion 
}) => {
  


  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 120 // Header offset
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

  return (
    <section className="pt-6 md:pt-10 pb-16 md:pb-24 bg-white">
      <div className="content-container">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.5em] font-bold text-[#C5A059] mb-4">
            Shop By Purpose
          </p>
          <h2 className="text-4xl md:text-6xl font-serif text-[#2C1E36] mb-8 tracking-tight">
            What are you looking for?
          </h2>
          <div className="h-px w-24 bg-[#C5A059] mx-auto opacity-30" />
        </div>

        {/* Navigation Cards (MCQ Section) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {intentConfig.map((cfg) => (
            <button
              key={cfg.key}
              onClick={() => scrollToSection(cfg.id)}
              className="group relative flex flex-col items-center justify-center p-8 md:p-12 rounded-[24px] bg-[#FAF9F6] border border-[#2C1E36]/5 hover:border-[#C5A059] hover:bg-white transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Icon / Decor */}
              <div className="text-4xl md:text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-500 text-[#2C1E36]">
                {cfg.icon}
              </div>
              
              <span className="text-lg md:text-xl font-serif text-[#2C1E36] font-medium tracking-tight">
                {cfg.label}
              </span>
              
              <div className="mt-4 h-0.5 w-0 group-hover:w-8 bg-[#C5A059] transition-all duration-500" />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ShopByIntentClient
