"use client"

import React, { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import Image from "next/image"

import loveImg from "../../../../images/love-pics.png"
import moneyImg from "../../../../images/money.png"
import nazarImg from "../../../../images/nazar.png"
import healthImg from "../../../../images/health.png"

const intentConfig = [
  {
    key: "love",
    label: "Love",
    id: "collection-love",
    image: loveImg,
    color: "#E11D48",
    gradient: "from-rose-500/80 to-rose-600",
    textColor: "group-hover:text-white",
  },
  {
    key: "money",
    label: "Money",
    id: "collection-money",
    image: moneyImg,
    color: "#D97706",
    gradient: "from-amber-400/90 to-amber-500",
    textColor: "group-hover:text-[#2C1E36]",
  },
  {
    key: "protection",
    label: "NAZAR/EVIL EYE",
    id: "collection-protection",
    image: nazarImg,
    color: "#000000",
    gradient: "from-neutral-800 to-black",
    textColor: "group-hover:text-white",
  },
  {
    key: "health",
    label: "Health",
    id: "collection-health",
    image: healthImg,
    color: "#059669",
    gradient: "from-emerald-500/80 to-emerald-600",
    textColor: "group-hover:text-white",
  },
]

const ShopByIntentClient = ({
  intents,
  region
}: {
  intents: any[],
  region: HttpTypes.StoreRegion
}) => {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)

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
    <section className="pt-12 md:pt-20 pb-20 md:pb-32 bg-[#FAF9F6]">
      <div className="content-container">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.5em] font-bold text-[#C5A059] mb-4 block">
            Curated Intentions
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-[#2C1E36] mb-8 tracking-tight leading-tight">
              What’s troubling you ??

          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-10 bg-[#C5A059]/30" />
            <div className="w-1.5 h-1.5 rounded-full border border-[#C5A059]/40" />
            <div className="h-[1px] w-10 bg-[#C5A059]/30" />
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {intentConfig.map((cfg) => (
            <button
              key={cfg.key}
              onClick={() => scrollToSection(cfg.id)}
              onMouseEnter={() => setHoveredKey(cfg.key)}
              onMouseLeave={() => setHoveredKey(null)}
              className="group relative flex flex-col items-center p-1 rounded-[40px] transition-all duration-700 ease-in-out hover:-translate-y-4"
            >
              {/* Main Card Surface */}
              <div className={clx(
                "relative w-full h-full p-6 md:p-8 rounded-[32px] bg-white border border-[#2C1E36]/5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-500 ease-in-out group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)]",
                "overflow-hidden"
              )}>
                {/* Background Layer (Subtle color on mobile, full gradient on hover) */}
                <div className={clx(
                  "absolute inset-0 bg-gradient-to-br transition-opacity duration-500 ease-in-out",
                  "opacity-30 md:opacity-0 group-hover:opacity-100",
                  cfg.gradient
                )} />

                {/* Content Wrapper */}
                <div className="relative z-10 flex flex-col items-center">
                  {/* Image with Decorative Frame */}
                  <div className="relative w-full aspect-square mb-8 group-hover:scale-105 transition-transform duration-700 ease-out">
                    <div className="absolute -inset-1 rounded-[24px] border border-[#2C1E36]/5 group-hover:border-white/20 transition-colors duration-500" />
                    <div className="relative h-full w-full overflow-hidden rounded-[20px] shadow-sm">
                      <Image
                        src={cfg.image}
                        alt={cfg.label}
                        fill
                        placeholder="blur"
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover transform group-hover:scale-110 transition-transform duration-1000"
                      />
                    </div>
                  </div>

                  <h3 className={clx(
                    "text-2xl md:text-3xl font-serif font-medium tracking-tight mb-3 transition-colors duration-500",
                    hoveredKey === cfg.key ? cfg.textColor : "text-[#2C1E36]"
                  )}>
                    {cfg.label}
                  </h3>

                  {/* Explore Text */}
                  <div className={clx(
                    "flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-500 transform",
                    hoveredKey === cfg.key ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
                    cfg.textColor
                  )}>
                    <span>Explore</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Reflection/Shadow under card */}
              <div className={clx(
                "mt-4 h-1 w-1/2 rounded-full blur-md transition-all duration-500",
                "opacity-20 md:opacity-0 group-hover:opacity-30",
                cfg.key === "money" ? "bg-amber-400" :
                  cfg.key === "love" ? "bg-rose-400" :
                    cfg.key === "health" ? "bg-emerald-400" : "bg-black"
              )} />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ShopByIntentClient
