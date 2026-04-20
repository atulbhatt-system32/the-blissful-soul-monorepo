"use client"

import React from "react"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"

import "swiper/css"
import "swiper/css/pagination"

const IntentCollectionsClient = ({ 
  intents, 
  region,
  title
}: { 
  intents: any[], 
  region: HttpTypes.StoreRegion,
  title?: string
}) => {
  return (
    <div className="bg-[#FAF9F6] rounded-[40px] md:rounded-[64px] p-6 md:p-14 border border-[#2C1E36]/5 shadow-[0_4px_20px_rgba(44,30,54,0.02)]">
      {/* Main Section Header inside Card */}
      <div className="text-center mb-12 md:mb-16">
        <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold text-[#C5A059] font-sans mb-3 block">
           COLLECTION
        </span>
        <h2 className="text-3xl md:text-5xl font-serif text-[#2C1E36] uppercase tracking-tight leading-tight">
          {title}
        </h2>
        <div className="w-12 md:w-20 h-0.5 md:h-1 bg-[#C5A059]/20 mx-auto mt-4 md:mt-6 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:gap-12">
      {intents.map((section) => (
        <div 
          key={section.title} 
          id={`collection-${section.title.toLowerCase()}`} 
          className="bg-white rounded-[32px] p-6 md:p-10 shadow-sm border border-[#2C1E36]/5 scroll-mt-32"
        >
          {/* Header inside Card */}
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-[#FAF9F6]">
            <h3 className="text-xl md:text-2xl font-serif text-[#2C1E36]">
              {section.title} <span className="text-[#C5A059]/40 font-sans text-xs md:text-sm ml-1 md:ml-2 font-light">Collection</span>
            </h3>
            <LocalizedClientLink 
              href="/store"
              className="text-[10px] uppercase tracking-widest font-bold text-[#C5A059] hover:opacity-70 transition-opacity"
            >
              Explore All →
            </LocalizedClientLink>
          </div>

          {/* Swiper Carousel (Same as Hot Seller) */}
          <div className="w-full">
            {section.products.length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={16}
                slidesPerView={1.2}
                breakpoints={{
                  640: { slidesPerView: 2.2, spaceBetween: 20 },
                  1024: { slidesPerView: 3, spaceBetween: 24 },
                  1280: { slidesPerView: 4, spaceBetween: 32 }
                }}
                className="intent-swiper !pb-10"
              >
                {section.products.slice(0, 3).map((product: any) => (
                  <SwiperSlide key={product.id}>
                    <ProductPreview product={product} region={region} isFeatured />
                  </SwiperSlide>
                ))}
                
                {/* 4th Card: Not Sure / CTA */}
                <SwiperSlide>
                  <LocalizedClientLink 
                    href="/book-session"
                    className="flex flex-col items-center justify-center h-full min-h-[300px] md:min-h-[400px] p-6 rounded-[24px] md:rounded-[32px] bg-[#FAF9F6] border-2 border-dashed border-[#C5A059]/30 hover:border-[#C5A059] hover:bg-white transition-all duration-500 group text-center"
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
                </SwiperSlide>
              </Swiper>
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
      <div className="mt-12 md:mt-16 text-center">
        <LocalizedClientLink 
          href="/store"
          className="inline-flex items-center justify-center bg-white border border-[#2C1E36]/10 text-[#2C1E36] px-12 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[12px] md:text-[14px] hover:bg-[#2C1E36] hover:text-white transition-all duration-300 shadow-sm hover:shadow-xl active:scale-95 group min-w-[280px]"
        >
          Explore Collection <span className="ml-3 group-hover:translate-x-1 transition-transform">→</span>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default IntentCollectionsClient
