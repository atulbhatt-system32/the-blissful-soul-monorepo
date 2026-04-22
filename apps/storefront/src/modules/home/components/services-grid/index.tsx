"use client"

import React from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Service = {
  key: string
  title: string
  description: string
  icon: string
  color: string
  link: string
}

const services: Service[] = [
  {
    key: "kundli",
    title: "Kundli",
    description: "Personalised Vedic birth chart analysis and future predictions",
    icon: "📜",
    color: "bg-blue-100/80", // Richer Light Blue
    link: "/book-session",
  },
  {
    key: "astrology",
    title: "Astrology",
    description: "Vedic astrology readings to guide your life path, career, and relationships",
    icon: "🪐",
    color: "bg-purple-100/80", // Richer Light Purple
    link: "/book-session",
  },
  {
    key: "tarot",
    title: "Tarot Reading",
    description: "Intuitive tarot card readings for clarity and divine guidance",
    icon: "🃏",
    color: "bg-amber-100/80", // Richer Light Amber
    link: "/book-session",
  },
  {
    key: "counseling",
    title: "Counseling",
    description: "Holistic spiritual counseling for emotional well-being and personal growth",
    icon: "🧘",
    color: "bg-emerald-100/80", // Richer Light Emerald
    link: "/book-session",
  },
  {
    key: "healing",
    title: "Healing",
    description: "Crystal healing, reiki, and energy work to restore balance and harmony",
    icon: "💎",
    color: "bg-pink-100/80", // Richer Light Pink
    link: "/book-session",
  },
]

const ServicesGrid = () => {
  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      <div className="content-container relative z-10">
        {/* Section heading */}
        <div className="text-center mb-16 md:mb-24">
          <span className="text-[12px] md:text-sm uppercase tracking-[0.4em] font-bold text-[#C5A059] font-sans mb-4 block">
            Still confused?
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#2C1E36] mb-8 uppercase tracking-tighter leading-tight">
            OUR SACRED SERVICES
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-12 bg-[#C5A059]/30" />
            <div className="w-2 h-2 rounded-full border border-[#C5A059]/40" />
            <div className="h-[1px] w-12 bg-[#C5A059]/30" />
          </div>
        </div>

        {/* Services Flip Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service) => (
            <div key={service.key} className="group h-[320px] [perspective:1000px]">
              <div className="relative h-full w-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                
                {/* Front Side */}
                <div className={`absolute inset-0 h-full w-full rounded-[32px] ${service.color} border border-black/5 shadow-sm [backface-visibility:hidden] flex flex-col items-center justify-center p-8 text-center`}>
                  <div className="w-20 h-20 bg-white/60 backdrop-blur-md rounded-full flex items-center justify-center shadow-inner mb-6 group-hover:scale-110 transition-transform duration-500">
                    <span className="text-4xl">{service.icon}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-[#2C1E36] uppercase tracking-widest mb-4">
                    {service.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[#C5A059] opacity-80">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                      Flip to explore
                    </span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 2v6h-6"></path>
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                      <path d="M3 3v5h5"></path>
                    </svg>
                  </div>
                </div>

                {/* Back Side */}
                <div className={`absolute inset-0 h-full w-full rounded-[32px] ${service.color} border border-[#C5A059]/10 shadow-xl [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col items-center justify-center p-8 text-center`}>
                  <h3 className="text-lg md:text-xl font-bold text-[#2C1E36] uppercase tracking-widest mb-4">
                    {service.title}
                  </h3>
                  <p className="text-[#665D6B] text-sm leading-relaxed mb-8">
                    {service.description}
                  </p>
                  <LocalizedClientLink
                    href={service.link}
                    className="px-8 py-3 bg-[#C5A059] text-white rounded-full font-bold text-xs uppercase tracking-[0.2em] shadow-md hover:shadow-lg hover:bg-[#B38E4A] transition-all active:scale-95"
                  >
                    Book Now
                  </LocalizedClientLink>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <LocalizedClientLink
            href="/book-session"
            className="inline-block text-[11px] font-bold uppercase tracking-[0.4em] text-[#C5A059] border-b border-[#C5A059]/30 pb-2 hover:text-[#2C1E36] hover:border-[#2C1E36] transition-all"
          >
            Explore All Offerings &rarr;
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}

export default ServicesGrid
