"use client"

import React, { useRef } from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"

import "swiper/css"


type TestimonialItem = {
  name: string
  text: string
  rating: number
  image?: {
    url: string
    data?: {
      attributes: {
        url: string
      }
    }
  } | string | null
}

type TestimonialsProps = {
  title?: string | null
  testimonials?: TestimonialItem[] | null
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

const Testimonials = ({ title, testimonials }: TestimonialsProps) => {
  const swiperRef = useRef<SwiperType | null>(null)
  const sectionTitle = title || "Client Testimonials"
  
  const data = testimonials && testimonials.length > 0
    ? testimonials.map(t => {
        // Handle Strapi's nested media structure
        let imageUrl = "/pyramid.png";
        
        if (typeof t.image === "string") {
          imageUrl = t.image;
        } else if (t.image?.url) {
          imageUrl = `${STRAPI_URL}${t.image.url}`;
        } else if (t.image?.data?.attributes?.url) {
          imageUrl = `${STRAPI_URL}${t.image.data.attributes.url}`;
        }

        return {
          name: t.name,
          text: t.text,
          rating: t.rating || 5,
          image: imageUrl
        };
      })
    : []

  if (data.length === 0) {
    return (
      <section className="py-24 md:py-32 bg-[#FAF9F6] relative overflow-hidden">
        <div className="content-container text-center">
          <div className="flex flex-col items-center gap-y-4 mb-8">
            <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold text-[#C5A059]">
               WHAT THEY SAY
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-[#130E14] tracking-tight">
              {sectionTitle}
            </h2>
          </div>
          <div className="max-w-2xl mx-auto py-16 bg-white/50 border border-dashed border-[#2C1E36]/10 rounded-[40px]">
             <p className="text-[#2C1E36]/40 font-serif italic text-lg">Your journeys are the heart of this sanctuary. Stories from seekers will appear here soon.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 md:py-32 bg-[#FAF9F6] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-100/30 rounded-full blur-[120px] -z-1" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-50/40 rounded-full blur-[150px] -z-1" />
      
      <div className="content-container text-center relative z-10">
        <div className="flex flex-col items-center gap-y-4 mb-20">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold text-pink-600">
             WHAT THEY SAY
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#130E14] tracking-tight">
            {sectionTitle}
          </h2>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4">
          <Swiper
            modules={[Navigation, Autoplay]}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            loop={data.length > 3}
            speed={800}
            spaceBetween={40}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            onSwiper={(swiper) => { swiperRef.current = swiper }}
            className="!px-4 !pb-12"
          >
            {data.map((t, idx) => (
              <SwiperSlide key={idx}>
                <div className="flex flex-col items-center bg-white p-10 rounded-[40px] shadow-sm border border-black/5 hover:shadow-xl hover:shadow-black/5 transition-all duration-700 min-h-[400px] group">
                  <div className="relative w-28 h-28 mb-8 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-500">
                    <Image src={t.image} alt={t.name} fill className="object-cover" />
                  </div>
                  
                  <div className="flex gap-1 mb-6 text-[#D4AF37]">
                    {[...Array(t.rating)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    ))}
                  </div>
                  
                  <div className="relative">
                    <span className="absolute -top-6 -left-4 text-6xl text-pink-100 font-serif opacity-50">&ldquo;</span>
                    <p className="text-[#130E14]/70 text-base leading-relaxed mb-8 italic line-clamp-4 font-medium px-2">
                      {t.text}
                    </p>
                  </div>
                  
                  <div className="mt-auto pt-6 border-t border-black/5 w-full">
                    <h4 className="font-serif text-[#130E14] font-bold uppercase tracking-[0.2em] text-[11px]">
                      {t.name}
                    </h4>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Dots/Arrows could be added here if needed, but keeping it clean */}
        </div>
        
        <div className="mt-16">
           <LocalizedClientLink href="/contact" className="px-10 py-4 bg-[#130E14] text-white rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-black/10">
              Share Your Journey With Us
           </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
