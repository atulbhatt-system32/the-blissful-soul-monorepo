"use client"

import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import Image from "next/image"

import "swiper/css"
import "swiper/css/pagination"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

const defaultTrustItems = [
  {
    title: "Intuitive",
    description: "Guided by deep inner knowing beyond logic.",
    image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Clarify",
    description: "Bringing clear, focused insight to life’s questions.",
    image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Confidential",
    description: "A safe, private space where trust comes first.",
    image: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Soulstrategist",
    description: "Aligning your soul’s purpose with meaningful direction.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop"
  }
]

const TrustCarousel = ({ items }: { items?: any[] }) => {
  const displayItems = items && items.length > 0 ? items.map(item => ({
    title: item.title,
    description: item.description,
    image: item.image?.url ? (item.image.url.startsWith('http') ? item.image.url : `${STRAPI_URL}${item.image.url}`) : null
  })).filter(i => i.image) : defaultTrustItems
  return (
    <section className="pt-12 md:pt-16 pb-0 bg-white overflow-hidden">
      <div className="content-container">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            el: '.trust-pagination',
            renderBullet: (index, className) => {
              return `<span class="${className} w-2 h-2 rounded-full border border-[#C5A059] bg-transparent inline-block mx-1 transition-all duration-300"></span>`;
            }
          }}
          loop={true}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            768: {
              slidesPerView: 2,
              spaceBetween: 32,
            }
          }}
          className="trust-swiper !pb-12"
        >
          {displayItems.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="group relative flex flex-col gap-y-6">
                {/* 2:1 Image Container */}
                <div className="relative aspect-[2/1] w-full overflow-hidden rounded-[32px] bg-slate-100 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Text Content */}
                <div className="px-2">
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-[#2C1E36] mb-2 uppercase tracking-wide">
                    {item.title}
                  </h3>
                  <p className="text-[#665D6B] text-[15px] md:text-base font-medium leading-relaxed max-w-sm opacity-90">
                    {item.description}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* Custom Pagination Container */}
        <div className="trust-pagination flex justify-center items-center mt-4"></div>
      </div>

      <style jsx global>{`
        .trust-pagination .swiper-pagination-bullet-active {
          background: #C5A059 !important;
          width: 24px !important;
          border-radius: 4px !important;
        }
      `}</style>
    </section>
  )
}

export default TrustCarousel
