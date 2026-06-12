"use client"

import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"
import React, { useState, useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"

import "swiper/css"
import "swiper/css/pagination"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef<SwiperType | null>(null)

  if (!images || images.length === 0) return null

  return (
    <div className="flex items-start relative min-w-0 w-full justify-center">
      <div className="flex flex-col flex-1 small:mx-16 gap-y-4 min-w-0 w-full max-w-[600px] relative group/gallery">
        {images.length === 1 ? (
          <Container className="relative aspect-square w-full overflow-hidden bg-ui-bg-subtle rounded-[28px] border border-black/5 shadow-sm">
            {!!images[0].url && (
              <Image
                src={images[0].url}
                priority
                fetchPriority="high"
                className="absolute inset-0 rounded-[28px] object-contain"
                alt="Product image"
                fill
                quality={85}
                sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
              />
            )}
          </Container>
        ) : (
          <>
            {/* Main Swiper Slider Container */}
            <div className="relative aspect-square w-full rounded-[28px] overflow-hidden bg-ui-bg-subtle border border-black/5 shadow-sm">
              <Swiper
                modules={[Navigation, Pagination]}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper
                }}
                onSlideChange={(swiper) => {
                  setActiveIndex(swiper.activeIndex)
                }}
                slidesPerView={1}
                loop={false}
                pagination={{
                  clickable: true,
                  el: '.gallery-pagination',
                  renderBullet: (index, className) =>
                    `<span class="${className} swiper-pagination-bullet inline-block transition-all duration-500 ease-in-out cursor-pointer"></span>`
                }}
                className="w-full h-full"
              >
                {images.map((image, index) => (
                  <SwiperSlide key={image.id} className="w-full h-full relative">
                    <div className="w-full h-full relative">
                      {!!image.url && (
                        <Image
                          src={image.url}
                          priority={index === 0}
                          fetchPriority={index === 0 ? "high" : "auto"}
                          className="absolute inset-0 object-contain"
                          alt={`Product image ${index + 1}`}
                          fill
                          quality={85}
                          sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                        />
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation Arrows - visible on hover on desktop */}
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/85 backdrop-blur-sm border border-black/5 text-[#2C1E36] flex items-center justify-center shadow-md opacity-0 group-hover/gallery:opacity-100 transition-all duration-300 hover:bg-white hover:text-[#C5A059] active:scale-95 hidden md:flex"
                aria-label="Previous image"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <button
                onClick={() => swiperRef.current?.slideNext()}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/85 backdrop-blur-sm border border-black/5 text-[#2C1E36] flex items-center justify-center shadow-md opacity-0 group-hover/gallery:opacity-100 transition-all duration-300 hover:bg-white hover:text-[#C5A059] active:scale-95 hidden md:flex"
                aria-label="Next image"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>

              {/* Custom Pagination Container (Mobile only/bullets) */}
              <div className="gallery-pagination flex justify-center items-center gap-2 absolute bottom-4 left-0 right-0 z-10 md:hidden"></div>
            </div>

            {/* Thumbnails below the Swiper */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-2 px-2">
              {images.map((image, index) => {
                const isActive = index === activeIndex
                return (
                  <button
                    key={`thumb-${image.id}`}
                    onClick={() => swiperRef.current?.slideTo(index)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden bg-ui-bg-subtle border-2 transition-all duration-300 ${
                      isActive 
                        ? "border-[#C5A059] scale-105 shadow-md" 
                        : "border-black/5 hover:border-black/20 hover:scale-102"
                    }`}
                  >
                    {!!image.url && (
                      <Image
                        src={image.url}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover p-1"
                        sizes="64px"
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>

      <style jsx global>{`
        .gallery-pagination .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          background: #2C1E36;
          opacity: 0.25;
          border-radius: 50%;
          margin: 0 !important;
          transition: all 0.3s ease;
        }
        .gallery-pagination .swiper-pagination-bullet-active {
          background: #C5A059 !important;
          opacity: 1;
          width: 20px !important;
          border-radius: 12px !important;
        }
      `}</style>
    </div>
  )
}

export default ImageGallery
