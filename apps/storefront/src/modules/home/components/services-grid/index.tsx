"use client"

import React from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

import kundliImg from "../../../../images/service-kundli.png"
import astrologyImg from "../../../../images/kundli-and-traot.png"
import tarotImg from "../../../../images/service-tarot.png"
import counselingImg from "../../../../images/service-counseling.png"
import healingImg from "../../../../images/service-healing.png"

type Service = {
  key: string
  title: string
  description: string
  image: any
  color: string
  link: string
}

const services: Service[] = [
  {
    key: "kundli",
    title: "Kundli Reading",
    description: "Book your Kundli reading for a detailed analysis of your birth chart and life patterns.",
    image: kundliImg,
    color: "bg-blue-100",
    link: "/book-session",
  },
  {
    key: "astrology",
    title: "Tarot + Kundli Session",
    description: "Book your Tarot + Kundli session for a powerful blend of intuitive guidance and astrological analysis.",
    image: astrologyImg,
    color: "bg-purple-100",
    link: "/book-session",
  },
  {
    key: "tarot",
    title: "Tarot Session",
    description: "Book your Tarot session for deep insights and clear guidance on your life path.",
    image: tarotImg,
    color: "bg-amber-100",
    link: "/book-session",
  },
  {
    key: "counseling",
    title: "Psychological Counseling",
    description: "Book your counseling session for professional support, clarity, and emotional well-being.",
    image: counselingImg,
    color: "bg-emerald-100",
    link: "/book-session",
  },
  {
    key: "healing",
    title: "Reiki Healing",
    description: "Book your Reiki healing session to restore balance, release blockages, and rejuvenate your energy.",
    image: healingImg,
    color: "bg-pink-100",
    link: "/book-session",
  },
]

const ServicesGrid = () => {
  return (
    <section className="py-14 md:py-20 bg-white relative overflow-hidden">
      <div className="content-container relative z-10">
        {/* Section heading */}
        <div className="text-center mb-10 md:mb-14">
          <span className="text-[11px] uppercase tracking-[0.4em] font-bold text-[#C5A059] font-sans mb-2 block">
            Still confused?
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-[#2C1E36] mb-5 uppercase tracking-tighter leading-tight">
            OUR SACRED SERVICES
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="h-[1px] w-10 bg-[#C5A059]/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]/50" />
            <div className="h-[1px] w-10 bg-[#C5A059]/30" />
          </div>
        </div>

        {/* Services Flip Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service) => (
            <div key={service.key} className="group h-[220px] md:h-[260px] [perspective:1000px]">
              <div className="relative h-full w-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                
                {/* Front Side */}
                <div className="absolute inset-0 h-full w-full rounded-[28px] overflow-hidden border border-black/5 shadow-md [backface-visibility:hidden]">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    placeholder="blur"
                  />
                </div>

                {/* Back Side */}
                <div className={`absolute inset-0 h-full w-full rounded-[28px] ${service.color} border border-[#C5A059]/20 shadow-xl [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col items-center justify-center gap-2 px-4 py-4 text-center`}>
                  {/* Decorative top dots */}
                  <div className="flex gap-1 mb-1">
                    <span className="w-1 h-1 rounded-full bg-[#C5A059]/50" />
                    <span className="w-1 h-1 rounded-full bg-[#C5A059]/30" />
                    <span className="w-1 h-1 rounded-full bg-[#C5A059]/50" />
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-[#2C1E36] uppercase tracking-[0.18em] leading-tight">
                    {service.title}
                  </h3>
                  <div className="w-8 h-[1px] bg-[#C5A059]/50" />
                  <p className="text-[#665D6B] text-[12px] md:text-[13px] leading-snug font-medium max-w-[90%]">
                    {service.description}
                  </p>
                  <LocalizedClientLink
                    href={service.link}
                    className="mt-1 px-6 py-2 bg-[#C5A059] text-white rounded-full font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-[#C5A059]/25 hover:bg-[#B38E4A] hover:shadow-xl transition-all active:scale-95"
                  >
                    Book Now
                  </LocalizedClientLink>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 md:mt-16">
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
