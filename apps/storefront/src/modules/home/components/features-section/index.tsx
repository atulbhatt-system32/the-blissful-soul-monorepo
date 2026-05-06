"use client"

import React from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { motion } from "framer-motion"

const features = [
  {
    title: "Psychic Expert",
    description: "Gain a valuable guidance and insight through extrasensory abilities and a heightened sense of intuition",
    icon: (
      <svg viewBox="0 0 100 100" className="w-20 h-20 md:w-24 md:h-24 text-[#2C1E36]">
        {/* Simple representation of the sun/moon/hands icon */}
        <circle cx="50" cy="40" r="15" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M50 20 L50 10 M50 70 L50 60 M20 40 L10 40 M80 40 L90 40" stroke="currentColor" strokeWidth="1" />
        <path d="M30 60 Q50 80 70 60" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="50" cy="40" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    title: "Trusted",
    description: "Our readings have helped countless individuals find clarity and direction in their lives",
    icon: (
      <svg viewBox="0 0 100 100" className="w-20 h-20 md:w-24 md:h-24 text-[#2C1E36]">
        {/* Simple representation of the planet/orbit icon */}
        <circle cx="50" cy="50" r="10" fill="currentColor" />
        <ellipse cx="50" cy="50" rx="30" ry="10" fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(45 50 50)" />
        <ellipse cx="50" cy="50" rx="30" ry="10" fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(-45 50 50)" />
        <circle cx="20" cy="20" r="3" fill="currentColor" />
        <circle cx="80" cy="80" r="4" fill="currentColor" />
      </svg>
    ),
  }
]

const FeaturesSection = () => {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="content-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 max-w-5xl mx-auto">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center group"
            >
              {/* Icon Container */}
              <div className="mb-8 p-4 rounded-full bg-slate-50 group-hover:bg-amber-50 transition-colors duration-500">
                {feature.icon}
              </div>

              {/* Text Content */}
              <h3 className="text-2xl md:text-3xl font-serif text-[#2C1E36] mb-4 tracking-tight font-medium">
                {feature.title}
              </h3>
              <p className="text-[#685D6B] text-[15px] leading-relaxed mb-8 max-w-[340px] font-sans opacity-80 group-hover:opacity-100 transition-opacity">
                {feature.description}
              </p>

              {/* Link */}
              <LocalizedClientLink 
                href="/services" 
                className="text-[11px] font-black uppercase tracking-[0.3em] text-[#2C1E36] border-b-2 border-transparent hover:border-[#C5A059] pb-1 transition-all duration-300"
              >
                Explore more
              </LocalizedClientLink>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
