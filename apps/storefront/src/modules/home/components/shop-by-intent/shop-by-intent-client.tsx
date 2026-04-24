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
  },
  {
    key: "money",
    label: "Money",
    id: "collection-money",
    image: moneyImg,
    color: "#059669",
    gradient: "from-green-500/80 to-green-600",
  },
  {
    key: "protection",
    label: "Nazar/Evil Eye",
    id: "collection-nazar",
    image: nazarImg,
    color: "#1a1a1a",
    gradient: "from-neutral-800 to-black",
  },
  {
    key: "health",
    label: "Health",
    id: "collection-health",
    image: healthImg,
    color: "#2563EB",
    gradient: "from-blue-500/80 to-blue-600",
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
      const offset = 120
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset
      window.scrollTo({ top: offsetPosition, behavior: "smooth" })
    }
  }

  return (
    <section className="pt-8 md:pt-12 pb-16 md:pb-24 bg-[#FAF9F6]">
      <div className="content-container">
        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-[#2C1E36] mb-4 tracking-tight leading-tight">
            What's troubling you ??
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-10 bg-[#C5A059]/30" />
            <div className="w-1.5 h-1.5 rounded-full border border-[#C5A059]/40" />
            <div className="h-[1px] w-10 bg-[#C5A059]/30" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-6">
          {intents.map((intent) => {
            const cfg = intentConfig.find(c =>
              intent.handle?.includes(c.key) ||
              intent.title?.toLowerCase().includes(c.key)
            ) || intentConfig[0]

            const intentKey = intent.handle || intent.id
            const isHovered = hoveredKey === intentKey

            return (
              <motion.button
                key={intentKey}
                onClick={() => scrollToSection(intent.handle || intent.id)}
                onHoverStart={() => setHoveredKey(intentKey)}
                onHoverEnd={() => setHoveredKey(null)}
                className="group relative flex flex-col items-center p-1 rounded-[36px] transition-all duration-700 ease-in-out w-full mx-auto"
                initial="initial"
                whileInView="animate"
                viewport={{ once: false, margin: "-10% 0px -75% 0px" }}
              >
                {/* Main Card Surface */}
                <div
                  className="relative w-full h-full p-5 md:p-6 rounded-[24px] md:rounded-[28px] border border-[#2C1E36]/5 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 min-h-[260px] md:min-h-[320px] flex flex-col justify-center"
                  style={{ backgroundColor: isMobile ? "transparent" : `${cfg.color}0D` }}
                >
                  {/* Colored top accent bar — desktop only, fades on hover */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[3px] hidden md:block transition-opacity duration-500 group-hover:opacity-0"
                    style={{ backgroundColor: cfg.color }}
                  />

                  {/* Mobile Background (scroll-triggered) */}
                  <motion.div
                    variants={{
                      initial: { opacity: 0 },
                      animate: { opacity: 1 }
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className={clx("absolute inset-0 bg-gradient-to-br md:hidden", cfg.gradient)}
                  />

                  {/* Desktop Hover Background */}
                  <div
                    className={clx(
                      "absolute inset-0 bg-gradient-to-br hidden md:block transition-opacity duration-500 opacity-0 group-hover:opacity-100",
                      cfg.gradient
                    )}
                  />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center gap-5">
                    {/* Icon */}
                    <div className="relative w-36 h-36 md:w-40 md:h-40">
                      <div className="absolute -inset-1 rounded-[24px] md:rounded-[28px] border border-white/20 md:border-[#2C1E36]/8" />
                      <div className="relative h-full w-full overflow-hidden rounded-[20px] md:rounded-[24px] shadow-sm bg-[#F3EFE7] flex items-center justify-center p-3 md:p-5">
                        <div className="h-full w-full relative">
                          <Image
                            src={cfg.image}
                            alt={cfg.label}
                            fill
                            placeholder="blur"
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Explore — mobile: synced with scroll gradient via variants */}
                    <motion.div
                      variants={{
                        initial: { color: "#2C1E36" },
                        animate: { color: "#FFFFFF" },
                      }}
                      className="md:hidden flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold"
                    >
                      <span>Explore</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.div>

                    {/* Explore — desktop: intent color by default, white on hover */}
                    <motion.div
                      animate={{ color: isHovered ? "#FFFFFF" : cfg.color }}
                      transition={{ duration: 0.3 }}
                      className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold"
                    >
                      <span>Explore</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.div>
                  </div>
                </div>

                {/* Reflection shadow */}
                <motion.div
                  variants={{
                    initial: { opacity: 0 },
                    animate: { opacity: 0.3 }
                  }}
                  className={clx(
                    "mt-4 h-1 w-1/2 rounded-full blur-md transition-opacity duration-500",
                    "md:opacity-0 md:group-hover:opacity-30",
                    cfg.key === "money" ? "bg-green-400" :
                      cfg.key === "love" ? "bg-rose-400" :
                        cfg.key === "health" ? "bg-blue-400" : "bg-gray-400"
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
