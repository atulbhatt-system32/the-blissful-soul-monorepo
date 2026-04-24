"use client"

import React, { useState } from "react"
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

          <h2 className="text-3xl md:text-5xl font-serif text-[#2C1E36] mb-8 tracking-tight leading-tight">
            What’s troubling you ??

          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-10 bg-[#C5A059]/30" />
            <div className="w-1.5 h-1.5 rounded-full border border-[#C5A059]/40" />
            <div className="h-[1px] w-10 bg-[#C5A059]/30" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {intentConfig.map((cfg) => (
            <motion.button
              key={cfg.key}
              onClick={() => scrollToSection(cfg.id)}
              onHoverStart={() => setHoveredKey(cfg.key)}
              onHoverEnd={() => setHoveredKey(null)}
              onViewportEnter={() => {
                if (window.innerWidth < 768) setHoveredKey(cfg.key)
              }}
              viewport={{ margin: "-45% 0px -45% 0px" }}
              className="group relative flex flex-col items-center p-1 rounded-[40px] transition-all duration-500 ease-in-out"
              whileHover={{ y: -16 }}
              animate={hoveredKey === cfg.key ? { y: -16 } : { y: 0 }}
            >
              {/* Main Card Surface */}
              <motion.div 
                className="relative w-full h-full p-6 md:p-8 rounded-[32px] bg-white border border-[#2C1E36]/5 overflow-hidden transition-shadow duration-500"
                animate={hoveredKey === cfg.key ? { 
                  shadow: "0 30px 60px rgba(0,0,0,0.1)",
                  boxShadow: "0 30px 60px rgba(0,0,0,0.1)" 
                } : { 
                  shadow: "0 4px 20px rgba(0,0,0,0.02)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.02)"
                }}
              >
                {/* Background Layer */}
                <motion.div
                  className={clx(
                    "absolute inset-0 bg-gradient-to-br",
                    cfg.gradient
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredKey === cfg.key ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                />

                {/* Content Wrapper */}
                <div className="relative z-10 flex flex-col items-center">
                  {/* Image with Decorative Frame */}
                  <motion.div 
                    className="relative w-full aspect-square mb-8"
                    animate={{ scale: hoveredKey === cfg.key ? 1.05 : 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <motion.div 
                      className="absolute -inset-1 rounded-[24px] border border-[#2C1E36]/5 transition-colors duration-500" 
                      animate={{ borderColor: hoveredKey === cfg.key ? "rgba(255,255,255,0.2)" : "rgba(44,30,54,0.05)" }}
                    />
                    <div className="relative h-full w-full overflow-hidden rounded-[20px] shadow-sm">
                      <motion.div
                        className="h-full w-full"
                        animate={{ scale: hoveredKey === cfg.key ? 1.1 : 1 }}
                        transition={{ duration: 1 }}
                      >
                        <Image
                          src={cfg.image}
                          alt={cfg.label}
                          fill
                          placeholder="blur"
                          sizes="(max-width: 768px) 100vw, 25vw"
                          className="object-cover"
                        />
                      </motion.div>
                    </div>
                  </motion.div>

                  <h3 className={clx(
                    "text-2xl md:text-3xl font-serif font-medium tracking-tight mb-3 transition-colors duration-500",
                    hoveredKey === cfg.key ? cfg.textColor.replace('group-hover:', '') : "text-[#2C1E36]"
                  )}>
                    {cfg.label}
                  </h3>

                  {/* Explore Text */}
                  <motion.div 
                    className={clx(
                      "flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold",
                      hoveredKey === cfg.key ? cfg.textColor.replace('group-hover:', '') : "text-[#2C1E36]"
                    )}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: hoveredKey === cfg.key ? 1 : 0,
                      y: hoveredKey === cfg.key ? 0 : 10
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <span>Explore</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>

              {/* Reflection/Shadow under card */}
              <motion.div 
                className={clx(
                  "mt-4 h-1 w-1/2 rounded-full blur-md",
                  cfg.key === "money" ? "bg-green-400" :
                    cfg.key === "love" ? "bg-rose-400" :
                      cfg.key === "health" ? "bg-yellow-400" : "bg-black"
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredKey === cfg.key ? 0.3 : 0 }}
                transition={{ duration: 0.5 }}
              />
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ShopByIntentClient
