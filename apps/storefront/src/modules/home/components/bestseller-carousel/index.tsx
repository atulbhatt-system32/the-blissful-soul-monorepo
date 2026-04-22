"use client"

import React, { useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import "swiper/css"

type BestsellerCarouselProps = {
  title?: string
  label?: string
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
  bgColor?: string
}

const BestsellerCarousel = ({ title, label, products, region, bgColor = "bg-[#FAF9F6]" }: BestsellerCarouselProps) => {
  const swiperRef = useRef<SwiperType | null>(null)

  if (products.length === 0) {
    return (
      <section className={`py-16 md:py-20 ${bgColor}`}>
        <div className="content-container">
          <div className="text-center mb-10">
            <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold text-[#C5A059] font-sans mb-4 block">
              {label || "FAVOURITES"}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-[#2C1E36] mb-6 uppercase tracking-tight leading-tight">
              {title || "Bestsellers"}
            </h2>
          </div>
          <div className="text-center py-20 bg-gray-50/50 rounded-[40px] border border-dashed border-gray-200">
            <p className="text-[#2C1E36]/40 font-serif italic text-lg">Best sellers coming soon.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={`py-16 md:py-20 ${bgColor} relative overflow-hidden`}>
      <div className="content-container">
        {/* Centered Header */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold text-[#C5A059] font-sans mb-4 block">
            {label || "FAVOURITES"}
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-[#2C1E36] uppercase tracking-tight leading-tight mb-6">
            {title || "Bestsellers"}
          </h2>
          <div className="h-0.5 w-24 bg-[#C5A059] rounded-full mb-8" />
          
          {/* Nav arrows below the title for a centered look */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous product"
              className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-[#2C1E36]/10 text-[#2C1E36] flex items-center justify-center hover:bg-[#2C1E36] hover:text-white transition-all duration-300 active:scale-90"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()} 
              aria-label="Next product"
              className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-[#2C1E36]/10 text-[#2C1E36] flex items-center justify-center hover:bg-[#2C1E36] hover:text-white transition-all duration-300 active:scale-90"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Product carousel */}
        <Swiper
          modules={[Navigation, Autoplay]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={products.length > 4}
          speed={600}
          spaceBetween={20}
          slidesPerView={1.2}
          breakpoints={{
            480: { slidesPerView: 2.2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 24 },
            1024: { slidesPerView: 4, spaceBetween: 28 },
          }}
          onSwiper={(swiper) => { swiperRef.current = swiper }}
          className="!pb-4"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <LocalizedClientLink 
            href="/store" 
            className="inline-block px-12 py-4 border border-[#2C1E36]/10 text-[#2C1E36] rounded-full font-bold hover:bg-[#2C1E36] hover:text-white transition-all uppercase tracking-[0.3em] text-[10px] shadow-sm hover:shadow-xl active:scale-95"
          >
            Discover All &rarr;
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}

export default BestsellerCarousel
