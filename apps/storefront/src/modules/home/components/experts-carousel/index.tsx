"use client"

import React, { useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"
import Image from "next/image"

import "swiper/css"

type Expert = {
  name: string
  title: string
  image: string
  specialization: string
  link?: string
}

const experts: Expert[] = [
  {
    name: "Master Pragya Vijh",
    title: "Astrologer",
    specialization: "Vedic Astrology & Life Guidance",
    image: "/experts/astrologer.jpg",
    link: "/book-session",
  },
  {
    name: "Master Pragya Vijh",
    title: "Tarot Reader",
    specialization: "Tarot Card Reading & Insights",
    image: "/experts/tarot-reader.jpg",
    link: "/book-session",
  },
  {
    name: "Master Pragya Vijh",
    title: "Crystal Healer",
    specialization: "Crystal Healing & Energy Work",
    image: "/experts/crystal-healer.jpg",
    link: "/book-session",
  },
  {
    name: "Master Pragya Vijh",
    title: "Counselor",
    specialization: "Spiritual Counseling & Wellness",
    image: "/experts/counselor.jpg",
    link: "/book-session",
  },
]

const ExpertsCarousel = () => {
  const swiperRef = useRef<SwiperType | null>(null)

  return (
    <section className="py-8 md:py-12 bg-gradient-to-r from-[#1A0E22] via-[#2C1E36] to-[#1A0E22] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent" />
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />

      <div className="content-container relative z-10">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold text-[#C5A059] font-sans block mb-1">
              Meet Our Experts
            </span>
            <h3 className="text-xl md:text-2xl font-serif text-white/90 tracking-tight">
              Your Spiritual Guides
            </h3>
          </div>

          {/* Navigation arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous expert"
              className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-[#C5A059]/30 text-[#C5A059] flex items-center justify-center hover:bg-[#C5A059]/10 hover:border-[#C5A059]/60 transition-all duration-300 active:scale-90"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next expert"
              className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-[#C5A059]/30 text-[#C5A059] flex items-center justify-center hover:bg-[#C5A059]/10 hover:border-[#C5A059]/60 transition-all duration-300 active:scale-90"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
          speed={600}
          spaceBetween={16}
          slidesPerView={1.3}
          breakpoints={{
            480: { slidesPerView: 2.2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 24 },
            1024: { slidesPerView: 4, spaceBetween: 28 },
          }}
          onSwiper={(swiper) => { swiperRef.current = swiper }}
          className="!px-1"
        >
          {experts.map((expert, idx) => (
            <SwiperSlide key={idx}>
              <a
                href={expert.link || "#"}
                className="group flex flex-col items-center text-center p-6 md:p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#C5A059]/40 hover:bg-white/10 transition-all duration-500 cursor-pointer"
              >
                {/* Profile image */}
                <div className="relative w-20 h-20 md:w-24 md:h-24 mb-4 rounded-full overflow-hidden ring-2 ring-[#C5A059]/30 ring-offset-2 ring-offset-[#1A0E22] group-hover:ring-[#C5A059]/60 group-hover:scale-105 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/30 to-purple-500/20 z-10" />
                  <div className="w-full h-full bg-gradient-to-br from-[#2C1E36] to-[#C5A059]/40 flex items-center justify-center">
                    <span className="text-3xl md:text-4xl">
                      {expert.title === "Astrologer" && "🔮"}
                      {expert.title === "Tarot Reader" && "🃏"}
                      {expert.title === "Crystal Healer" && "💎"}
                      {expert.title === "Counselor" && "🧘"}
                    </span>
                  </div>
                </div>

                {/* Expert info */}
                <h4 className="text-white/90 font-serif text-sm md:text-base font-semibold tracking-wide mb-1 group-hover:text-[#C5A059] transition-colors duration-300">
                  {expert.title}
                </h4>
                <p className="text-white/40 text-[10px] md:text-xs uppercase tracking-widest font-bold">
                  {expert.specialization}
                </p>

                {/* Hover CTA */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#C5A059] border-b border-[#C5A059]/30 pb-1">
                    Book Now →
                  </span>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default ExpertsCarousel
