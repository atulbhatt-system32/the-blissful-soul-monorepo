"use client"

import React from "react"
import { motion } from "framer-motion"

type MarqueeItem = { id: number; text: string }

interface ScrollingMarqueeProps {
  items?: MarqueeItem[]
}

const ScrollingMarquee = ({ items }: ScrollingMarqueeProps) => {
  const texts = items?.length ? items.map((i) => i.text) : []

  if (texts.length === 0) return null

  return (
    <div className="bg-[#C5A059] py-4 md:py-6 overflow-hidden whitespace-nowrap flex border-y border-white/10 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-[#C5A059] via-transparent to-[#C5A059] z-10 pointer-events-none opacity-40" />
      <motion.div
        className="flex items-center"
        animate={{ x: [0, -1500] }}
        transition={{
          repeat: Infinity,
          duration: 40,
          ease: "linear",
        }}
      >
        {[...texts, ...texts, ...texts, ...texts].map((text, idx) => (
          <div key={idx} className="flex items-center px-12 md:px-20">
            <span className="text-white text-sm md:text-base font-sans tracking-[0.2em] md:tracking-[0.35em] font-bold uppercase">
              {text}
            </span>
            <div className="ml-12 md:ml-20 w-2 h-2 rounded-full bg-white" />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default ScrollingMarquee
