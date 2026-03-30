"use client"

import React, { useRef } from "react"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"

import "swiper/css"

const defaultTestimonials = [
  {
    name: "Tripti Jain",
    text: "Vesta healings have become like a case band in my life, her tarot changes how I think about things. She has problems but she keeps her light.",
    image: "/pyramid.png",
    rating: 5
  },
  {
    name: "Subhi Kaur",
    text: "I just had a really enlightening session with Pragya regarding my personal life, she helped me organize my life and gave me clarity. Loved my time with her.",
    image: "/pyramid.png",
    rating: 5
  },
  {
    name: "Rubi Verma",
    text: "The prediction done by Master Pragya was so accurate that I was shocked. The remedies suggested are working like wonders now. Would love to connect with you more.",
    image: "/pyramid.png",
    rating: 5
  }
]

type TestimonialItem = {
  name: string
  text: string
  rating: number
  image?: {
    url: string
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
    ? testimonials.map(t => ({
        name: t.name,
        text: t.text,
        rating: t.rating || 5,
        image: typeof t.image === "string" 
          ? t.image 
          : t.image?.url 
            ? `${STRAPI_URL}${t.image.url}` 
            : "/pyramid.png"
      }))
    : defaultTestimonials

  return (
    <section className="py-20 bg-pink-50/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100 rounded-full blur-[100px] opacity-30 -z-1" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-100 rounded-full blur-[120px] opacity-30 -z-1" />
      
      <div className="content-container text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-serif text-pink-900 mb-16 uppercase tracking-tight">
          {sectionTitle}
        </h2>
        
        <div className="relative max-w-6xl mx-auto px-4">
          {/* Prev Arrow */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Previous testimonial"
            className="absolute -left-2 md:-left-6 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-10 h-10 rounded-full text-pink-600 hover:scale-110 transition-transform border border-pink-200 bg-white shadow-md"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <Swiper
            modules={[Navigation, Autoplay]}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={data.length > 3}
            speed={500}
            spaceBetween={32}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            onSwiper={(swiper) => { swiperRef.current = swiper }}
            className="!px-4"
          >
            {data.map((t, idx) => (
              <SwiperSlide key={idx}>
                <div className="flex flex-col items-center group py-4">
                  <div className="relative w-24 h-24 mb-6 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-300">
                    <Image src={t.image} alt={t.name} fill className="object-cover" />
                  </div>
                  
                  <div className="flex gap-1 mb-4 text-yellow-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    ))}
                  </div>
                  
                  <p className="text-pink-800 text-sm leading-relaxed mb-6 italic opacity-80 line-clamp-4">
                    &quot;{t.text}&quot;
                  </p>
                  
                  <h4 className="font-serif text-pink-950 font-bold uppercase tracking-widest text-[10px] sm:text-[12px] whitespace-nowrap overflow-hidden text-ellipsis max-w-full px-2">
                    {t.name}
                  </h4>
                  <div className="h-0.5 w-8 bg-pink-300 mt-2 opacity-50 group-hover:w-12 transition-all duration-300 mr-1 sm:mr-2 flex-shrink-0" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Next Arrow */}
          <button
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Next testimonial"
            className="absolute -right-2 md:-right-6 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-10 h-10 rounded-full text-pink-600 hover:scale-110 transition-transform border border-pink-200 bg-white shadow-md"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
        
        <div className="mt-12">
           <button className="px-6 py-2 border border-pink-500 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-pink-500 hover:bg-pink-500 hover:text-white transition-all">
             View Customer Reviews
           </button>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
