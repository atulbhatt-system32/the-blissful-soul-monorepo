"use client"

import React from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Service = {
  key: string
  title: string
  description: string
  icon: string
  color: string
  bgGradient: string
  link: string
}

const services: Service[] = [
  {
    key: "astro",
    title: "Astrology",
    description: "Vedic astrology readings to guide your life path, career, and relationships",
    icon: "🔮",
    color: "#8B5CF6",
    bgGradient: "from-purple-500/10 to-indigo-500/10",
    link: "/book-session",
  },
  {
    key: "tarot",
    title: "Tarot Reading",
    description: "Intuitive tarot card readings for clarity and divine guidance",
    icon: "🃏",
    color: "#C5A059",
    bgGradient: "from-amber-500/10 to-yellow-500/10",
    link: "/book-session",
  },
  {
    key: "counseling",
    title: "Counseling",
    description: "Holistic spiritual counseling for emotional well-being and personal growth",
    icon: "🧘",
    color: "#10B981",
    bgGradient: "from-emerald-500/10 to-teal-500/10",
    link: "/book-session",
  },
  {
    key: "healing",
    title: "Healing",
    description: "Crystal healing, reiki, and energy work to restore balance and harmony",
    icon: "💎",
    color: "#EC4899",
    bgGradient: "from-pink-500/10 to-rose-500/10",
    link: "/book-session",
  },
]

const ServicesGrid = () => {
  return (
    <section className="py-12 md:py-16 bg-[#FAF9F6] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-purple-100/30 rounded-full blur-[120px] -z-0" />
      <div className="absolute bottom-20 left-0 w-[350px] h-[350px] bg-amber-100/20 rounded-full blur-[100px] -z-0" />

      <div className="content-container relative z-10">
        {/* Section heading */}
        <div className="text-center mb-10 md:mb-12">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold text-[#C5A059] font-sans mb-4 block">
            What We Offer
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-[#2C1E36] mb-4 uppercase tracking-tight leading-tight">
            Our Services
          </h2>
          <div className="h-0.5 w-24 bg-[#C5A059] mx-auto rounded-full" />
        </div>

        {/* Services 2x2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {services.map((service) => (
            <LocalizedClientLink
              key={service.key}
              href={service.link}
              className={`group relative flex flex-col items-center text-center p-6 md:p-8 rounded-[32px] bg-gradient-to-br ${service.bgGradient} backdrop-blur-sm border border-black/5 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1 transition-all duration-500 cursor-pointer overflow-hidden`}
            >
              {/* Hover glow effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[32px]"
                style={{
                  background: `radial-gradient(circle at center, ${service.color}10 0%, transparent 70%)`
                }}
              />

              {/* Icon circle */}
              <div 
                className="relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500"
                style={{
                  background: `linear-gradient(135deg, ${service.color}15, ${service.color}05)`,
                  border: `2px solid ${service.color}25`,
                }}
              >
                <span className="text-2xl md:text-3xl">{service.icon}</span>
              </div>

              {/* Text */}
              <h3 className="text-base md:text-lg font-serif font-bold text-[#2C1E36] mb-2 uppercase tracking-wide group-hover:text-[#C5A059] transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-[#665D6B] text-xs leading-relaxed mb-4 max-w-[260px]">
                {service.description}
              </p>

              {/* Arrow CTA */}
              <div className="mt-auto flex items-center gap-2 text-[#C5A059] group-hover:gap-4 transition-all duration-300">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold">
                  Book Now
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform duration-300">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </LocalizedClientLink>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8">
          <LocalizedClientLink
            href="/book-session"
            className="inline-block text-[11px] font-bold uppercase tracking-[0.4em] text-[#C5A059] border-b border-[#C5A059]/30 pb-2 hover:text-[#2C1E36] hover:border-[#2C1E36] transition-all"
          >
            View All Services &rarr;
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}

export default ServicesGrid
