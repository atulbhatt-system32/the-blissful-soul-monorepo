"use client"

import React from "react"
import { motion } from "framer-motion"

const items = [
  "100% Authentic Crystals",
  "Spiritual Healing & Guidance",
  "India’s 1st ENERGISED Crystal store",
  "Master Pragya Vijh Certified",
  "Handcrafted with Love",
  "Premium Energy Tools",
  "A Sanctuary for Your Soul",
]

const ScrollingMarquee = () => {
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
        {[...items, ...items, ...items, ...items].map((item, idx) => (
          <div key={idx} className="flex items-center px-12 md:px-20">
             <span className="text-white text-sm md:text-base font-sans tracking-[0.2em] md:tracking-[0.35em] font-bold uppercase">
               {item}
             </span>
             <div className="ml-12 md:ml-20 w-2 h-2 rounded-full bg-white" />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default ScrollingMarquee
