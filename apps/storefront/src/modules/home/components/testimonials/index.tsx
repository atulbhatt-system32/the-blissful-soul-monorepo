"use client"

import React, { useRef } from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay, Pagination } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"

import "swiper/css"
import "swiper/css/pagination"

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
  const sectionTitle = title || "What Our Seekers Say"
  
  const data = testimonials && testimonials.length > 0
    ? testimonials.map(t => {
        let imageUrl = "/pyramid.png";
        
        if (typeof t.image === "string") {
          imageUrl = t.image;
        } else if (t.image?.url) {
          imageUrl = t.image.url.startsWith('http') ? t.image.url : `${STRAPI_URL}${t.image.url}`;
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

  return (
    <section className="py-24 md:py-32 bg-[#FAF9F6] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-100/20 rounded-full blur-[120px] -z-1" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#C5A059]/5 rounded-full blur-[150px] -z-1" />
      
      <div className="content-container relative z-10">
        <div className="flex flex-col items-center gap-y-4 mb-20 text-center">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.5em] font-bold text-[#C5A059]">
             WHAT THEY SAY
          </span>
          <h2 className="text-4xl md:text-6xl font-serif text-[#2C1E36] tracking-tight leading-tight">
            {sectionTitle}
          </h2>
          <div className="h-0.5 w-16 bg-[#C5A059]/30 rounded-full mt-4" />
        </div>
        
        <div className="relative max-w-6xl mx-auto">
          {data.length > 0 ? (
            <Swiper
              modules={[Navigation, Autoplay, Pagination]}
              autoplay={{ delay: 6000, disableOnInteraction: false }}
              loop={data.length > 3}
              speed={1000}
              spaceBetween={30}
              slidesPerView={1}
              pagination={{
                clickable: true,
                bulletClass: "testimonial-bullet",
                bulletActiveClass: "testimonial-bullet-active",
              }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              onSwiper={(swiper) => { swiperRef.current = swiper }}
              className="!pb-20"
            >
              {data.map((t, idx) => (
                <SwiperSlide key={idx}>
                  <div className="flex flex-col items-center h-full bg-white p-10 md:p-12 rounded-[48px] border border-black/5 shadow-[0_10px_40px_-15px_rgba(44,30,54,0.08)] hover:shadow-[0_20px_60px_-15px_rgba(44,30,54,0.12)] transition-all duration-700 group">
                    <div className="relative w-24 h-24 mb-8">
                       <div className="absolute inset-0 bg-[#C5A059]/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                       <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white shadow-md z-10">
                         <Image src={t.image} alt={t.name} fill className="object-cover" />
                       </div>
                    </div>
                    
                    <div className="flex gap-1.5 mb-8 text-[#C5A059]">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={i < t.rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      ))}
                    </div>
                    
                    <div className="relative mb-8 flex-grow">
                      <span className="absolute -top-10 -left-6 text-7xl text-[#C5A059]/10 font-serif leading-none select-none">&ldquo;</span>
                      <p className="text-[#665D6B] text-base leading-relaxed italic font-medium px-2 text-center">
                        {t.text}
                      </p>
                      <span className="absolute -bottom-12 -right-6 text-7xl text-[#C5A059]/10 font-serif leading-none select-none rotate-180">&ldquo;</span>
                    </div>
                    
                    <div className="w-full text-center mt-6">
                      <div className="h-px w-12 bg-[#C5A059]/20 mx-auto mb-6" />
                      <h4 className="font-serif text-[#2C1E36] font-bold uppercase tracking-[0.3em] text-[11px]">
                        {t.name}
                      </h4>
                      <p className="text-[#C5A059] text-[9px] uppercase tracking-widest font-bold mt-1">Verified Seeker</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="max-w-2xl mx-auto py-24 bg-white/50 border-2 border-dashed border-[#C5A059]/20 rounded-[48px] text-center">
               <span className="text-4xl mb-4 block opacity-40">✨</span>
               <p className="text-[#665D6B] font-serif italic text-lg px-8">Our community&apos;s experiences are currently being curated. Check back soon for heartfelt journeys.</p>
            </div>
          )}
        </div>
        
        <div className="mt-12 text-center">
           <LocalizedClientLink href="/contact" className="inline-flex items-center gap-3 px-10 py-5 bg-[#2C1E36] text-white rounded-full text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-black transition-all shadow-xl shadow-[#2C1E36]/20 group">
              Share Your Journey
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
           </LocalizedClientLink>
        </div>
      </div>

      <style jsx global>{`
        .testimonial-bullet {
          width: 8px;
          height: 8px;
          display: inline-block;
          border-radius: 99px;
          background: #C5A059;
          opacity: 0.2;
          margin: 0 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .testimonial-bullet-active {
          width: 24px;
          opacity: 1;
        }
      `}</style>
    </section>
  )
}

export default Testimonials
