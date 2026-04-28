"use client"

import React from "react"
import { motion } from "framer-motion"

interface DiscountMarqueeProps {
  messages?: string[]
}

const DiscountMarquee = ({ messages }: DiscountMarqueeProps) => {
  const items = messages || []

  if (items.length === 0) return null

  return (
    <div className="bg-[#C5A059] py-1.5 overflow-hidden whitespace-nowrap flex border-y border-white/10 relative h-[30px] md:h-[34px]">
      <motion.div
        className="flex items-center"
        animate={{ x: [0, -1000] }}
        transition={{
          repeat: Infinity,
          duration: 30,
          ease: "linear",
        }}
      >
        {[...items, ...items, ...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center px-8 md:px-12">
            <span className="text-white text-[10px] md:text-[11px] font-sans tracking-[0.15em] font-bold uppercase">
              {text}
            </span>
            <div className="ml-8 md:ml-12 w-1 h-1 rounded-full bg-white/50" />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default DiscountMarquee
