"use client"

import React from "react"
import Link from "next/link"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"

import "swiper/css"

const IntentCollectionsClient = ({ 
  intents, 
  region,
  title
}: { 
  intents: any[], 
  region: HttpTypes.StoreRegion,
  title?: string
}) => {
  const getColor = (title: string) => {
    const t = title.toLowerCase()
    if (t.includes('love')) return '#E11D48'
    if (t.includes('money')) return '#059669'
    if (t.includes('nazar') || t.includes('protection')) return '#2C1E36'
    if (t.includes('health')) return '#2563EB'
    return '#C5A059'
  }

  const CTACard = () => (
    <LocalizedClientLink 
      href="/services"
      className="flex flex-col items-center justify-center h-full p-6 rounded-[24px] md:rounded-[32px] bg-[#FAF9F6] border-2 border-dashed border-[#C5A059]/30 hover:border-[#C5A059] hover:bg-white transition-all duration-500 group text-center"
    >
      <div className="w-16 h-16 rounded-full bg-[#C5A059]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <span className="text-3xl">🔮</span>
      </div>
      <h4 className="text-lg md:text-xl font-serif text-[#2C1E36] mb-3 leading-tight font-bold">
        Not sure what <br/> you are looking for?
      </h4>
      <p className="text-[#685D6B] text-[13px] leading-relaxed mb-6">
        Have a Quick session with <span className="text-[#C5A059] font-bold">Master Pragya Vijh</span> to find your perfect match.
      </p>
      <div className="text-[10px] uppercase tracking-widest font-black text-[#C5A059] border-b border-[#C5A059]/30 pb-1 group-hover:border-[#C5A059] transition-all">
        Book Session Now
      </div>
    </LocalizedClientLink>
  )

  return (
    <div className="w-full">
      {/* Main Section Header */}
      <div className="content-container text-center mb-12 md:mb-16">
        <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold text-[#C5A059] font-sans mb-3 block">
           COLLECTION
        </span>
        <h2 className="text-4xl md:text-6xl font-serif text-[#2C1E36] tracking-tight leading-[1.1]">
          {title?.toLowerCase().includes('by') ? (
            <>
              <span className="block mb-2">{title.split(/by/i)[0].trim()}</span>
              <span className="block text-sm md:text-base font-sans text-[#C5A059] uppercase tracking-[0.5em] mt-6 font-bold">
                by {title.split(/by/i)[1].trim()}
              </span>
            </>
          ) : title}
        </h2>
        <div className="w-12 md:w-20 h-0.5 md:h-1 bg-[#C5A059]/20 mx-auto mt-4 md:mt-6 rounded-full"></div>
      </div>

      <div className="content-container grid grid-cols-1 gap-8 md:gap-12">
      {intents.map((section) => (

        
        <div 
          key={section.handle || section.title} 
          id={section.handle || `collection-${section.title.toLowerCase()}`} 
          className="bg-white rounded-[32px] p-6 md:p-10 shadow-sm border border-[#2C1E36]/5 scroll-mt-32"
        >
          {/* Header inside Card */}
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-[#FAF9F6]">
            <h3 
              className="text-2xl md:text-4xl font-serif font-bold transition-colors duration-500"
              style={{ color: getColor(section.title) }}
            >
              {section.title}
            </h3>
            <LocalizedClientLink 
              href="/store"
              className="text-[12px] uppercase tracking-widest font-bold text-[#2C1E36] hover:underline transition-all"
            >
              Explore All →
            </LocalizedClientLink>
          </div>

          {/* Swiper Carousel */}
          <div className="w-full">
            {section.products.length > 0 ? (
              <>
                {/* Desktop View: Swiper Carousel (Limit to 3 + CTA) */}
                <div className="hidden md:block">
                  <Swiper
                    modules={[Navigation]}
                    spaceBetween={16}
                    slidesPerView={1.2}
                    breakpoints={{
                      768: { slidesPerView: 2.2, spaceBetween: 20 },
                      1024: { slidesPerView: 3, spaceBetween: 24 },
                      1280: { slidesPerView: 4, spaceBetween: 32 }
                    }}
                    className="intent-swiper !pb-10"
                  >
                    {section.products.slice(0, 3).map((product: any) => (
                      <SwiperSlide key={product.id} className="!h-auto">
                        <ProductPreview product={product} region={region} isFeatured />
                      </SwiperSlide>
                    ))}
                    <SwiperSlide className="!h-auto">
                      <CTACard />
                    </SwiperSlide>
                  </Swiper>
                </div>

                {/* Mobile View: Swiper Carousel (Show All assigned items) */}
                <div className="block md:hidden">
                  <Swiper
                    modules={[]}
                    spaceBetween={16}
                    slidesPerView={1.2}
                    className="intent-swiper !pb-8"
                  >
                    {section.products.map((product: any) => (
                      <SwiperSlide key={product.id} className="!h-auto">
                        <ProductPreview product={product} region={region} isFeatured />
                      </SwiperSlide>
                    ))}
                    <SwiperSlide className="!h-auto">
                      <CTACard />
                    </SwiperSlide>
                  </Swiper>
                </div>
              </>
            ) : (
              <div className="py-12 text-center w-full">
                <p className="text-[#685D6B]/40 font-serif italic text-sm">
                  The {section.title} items are currently being handpicked.
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
      </div>
      {/* Bottom Explore CTA */}
      <div className="content-container mt-12 md:mt-16 text-center">
        <LocalizedClientLink 
          href="/store"
          className="inline-flex items-center justify-center bg-black border border-black text-white px-12 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[12px] md:text-[14px] hover:bg-white hover:text-black transition-all duration-300 shadow-sm hover:shadow-xl active:scale-95 group min-w-[280px]"
        >
          Explore Collection <span className="ml-3 group-hover:translate-x-1 transition-transform">→</span>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default IntentCollectionsClient
