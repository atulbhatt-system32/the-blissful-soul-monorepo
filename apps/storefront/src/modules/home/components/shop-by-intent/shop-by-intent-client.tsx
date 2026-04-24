"use client"

import React, { useState, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import Image from "next/image"
import { motion } from "framer-motion"

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
    color: "#059669",
    gradient: "from-green-500/80 to-green-600",
    textColor: "group-hover:text-white",
  },
  {
    key: "protection",
    label: "NAZAR/EVIL EYE",
    id: "collection-nazar",
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
    color: "#EAB308",
    gradient: "from-yellow-400/90 to-yellow-500",
    textColor: "group-hover:text-[#2C1E36]",
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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

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
    <section className="pt-8 md:pt-12 pb-16 md:pb-24 bg-[#FAF9F6]">
      <div className="content-container">
        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-[#2C1E36] mb-4 tracking-tight leading-tight">
            What’s troubling you ??
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-10 bg-[#C5A059]/30" />
            <div className="w-1.5 h-1.5 rounded-full border border-[#C5A059]/40" />
            <div className="h-[1px] w-10 bg-[#C5A059]/30" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {intents.map((intent) => {
            const cfg = intentConfig.find(c => 
              intent.handle?.includes(c.key) || 
              intent.title?.toLowerCase().includes(c.key)
            ) || intentConfig[0] // fallback to first one if no match

            return (
            <motion.button
              key={intent.key || intent.id}
              onClick={() => scrollToSection(intent.handle || intent.id)}
              onHoverStart={() => setHoveredKey(intent.handle || intent.key)}
              onHoverEnd={() => setHoveredKey(null)}
              className="group relative flex flex-col items-center p-1 rounded-[40px] transition-all duration-700 ease-in-out w-full mx-auto"
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
              initial={{ y: 0 }}
            >
              {/* Main Card Surface */}
              <div className="relative w-full h-full p-4 md:p-8 rounded-[24px] md:rounded-[32px] bg-white border border-[#2C1E36]/5 overflow-hidden shadow-sm md:hover:shadow-xl transition-all duration-500">
                {/* Background Layer */}
                <div
                  className={clx(
                    "absolute inset-0 bg-gradient-to-br transition-opacity duration-500",
                    "opacity-100 md:opacity-0 md:group-hover:opacity-100",
                    cfg.gradient
                  )}
                />

                {/* Content Wrapper */}
                <div className="relative z-10 flex flex-col items-center">
                  {/* Image with Decorative Frame */}
                  <div className="relative w-full aspect-square mb-4 md:mb-8">
                    <div 
                      className={clx(
                        "absolute -inset-1 rounded-[16px] md:rounded-[24px] border transition-colors duration-500",
                        "border-white/20 md:border-[#2C1E36]/5 md:group-hover:border-white/20"
                      )}
                    />
                    <div className="relative h-full w-full overflow-hidden rounded-[12px] md:rounded-[20px] shadow-sm">
                      <motion.div
                        className="h-full w-full"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 1 }}
                      >
                        <Image
                          src={cfg.image}
                          alt={cfg.label}
                          fill
                          placeholder="blur"
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover"
                        />
                      </motion.div>
                    </div>
                  </div>

                  <h3 className={clx(
                    "text-lg md:text-3xl font-serif font-medium tracking-tight mb-2 md:mb-3 transition-colors duration-500",
                    cfg.key === "health" 
                      ? "text-[#2C1E36]" 
                      : "text-white md:text-[#2C1E36] md:group-hover:text-white"
                  )}>
                    {cfg.label}
                  </h3>

                  {/* Explore Text */}
                  <div className={clx(
                    "flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-500",
                    "opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-hover:translate-y-0 md:translate-y-2",
                    cfg.key === "health" 
                      ? "text-[#2C1E36]" 
                      : "text-white md:text-[#2C1E36] md:group-hover:text-white"
                  )}>
                    <span>Explore</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Reflection/Shadow under card */}
              <div 
                className={clx(
                  "mt-4 h-1 w-1/2 rounded-full blur-md transition-opacity duration-500",
                  "opacity-30 md:opacity-0 md:group-hover:opacity-30",
                  cfg.key === "money" ? "bg-green-400" :
                    cfg.key === "love" ? "bg-rose-400" :
                      cfg.key === "health" ? "bg-yellow-400" : "bg-black"
                )}
              />
            </motion.button>
          )
        })}
        </div>
      </div>
    </section>
  )
}

export default ShopByIntentClient
