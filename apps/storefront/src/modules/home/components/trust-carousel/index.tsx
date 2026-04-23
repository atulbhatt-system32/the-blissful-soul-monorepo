"use client"

import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import Image from "next/image"

import "swiper/css"
import "swiper/css/pagination"

import soulstrategistImg from "../../../../images/soulstrategist.jpg"
import intuitiveImg from "../../../../images/intutive.jpg"
import clarifyImg from "../../../../images/clarify.jpg"
import confidentialImg from "../../../../images/confidential.jpg"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

const defaultTrustItems = [
  { title: "Soulstrategist", image: soulstrategistImg },
  { title: "Intuitive",      image: intuitiveImg },
  { title: "Clarify",        image: clarifyImg },
  { title: "Confidential",   image: confidentialImg },
]

const TrustCarousel = ({ items }: { items?: any[] }) => {
  const displayItems = items && items.length > 0 ? items.map(item => ({
    title: item.title,
    image: item.image?.url ? (item.image.url.startsWith('http') ? item.image.url : `${STRAPI_URL}${item.image.url}`) : null
  })).filter(i => i.image) : defaultTrustItems
  return (
    <section className="pt-10 md:pt-14 pb-6 md:pb-10 bg-white overflow-hidden">
      <div className="content-container">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{
            clickable: true,
            el: '.trust-pagination',
            renderBullet: (index, className) =>
              `<span class="${className} swiper-pagination-bullet inline-block transition-all duration-500 ease-in-out cursor-pointer"></span>`
          }}
          loop={true}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{ 768: { slidesPerView: 2, spaceBetween: 32 } }}
          className="trust-swiper !pb-10"
        >
          {displayItems.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="group relative">
                {/* 2:1 Image Container */}
                <div className="relative aspect-[2/1] w-full overflow-hidden rounded-[32px] bg-slate-100 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* Custom Pagination Container */}
        <div className="trust-pagination flex justify-center items-center gap-2 mt-4 pb-2"></div>
      </div>

      <style jsx global>{`
        .trust-pagination .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #2C1E36;
          opacity: 0.15;
          border-radius: 50%;
          margin: 0 !important;
        }
        .trust-pagination .swiper-pagination-bullet-active {
          background: #C5A059 !important;
          opacity: 1;
          width: 28px !important;
          border-radius: 12px !important;
        }
      `}</style>
    </section>
  )
}

export default TrustCarousel
