"use client"

import { useEffect, useState, useMemo } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { motion } from "framer-motion"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import "swiper/css"

interface HeroImage {
  url: string
}

interface HeroProps {
  slides: Array<{
    title?: string
    subtitle?: string
    cta_text?: string
    cta_link?: string
    image: HeroImage | HeroImage[]
    mobile_image?: HeroImage | HeroImage[]
    theme?: "dark" | "light"
  }>
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

function getImages(image: any): HeroImage[] {
  if (!image) return []
  const wrap = (img: any): HeroImage | null => {
    if (!img) return null
    // Handle Strapi 5 data/attributes structure if present, otherwise assume flat
    const url = img.url || img.attributes?.url || img.data?.attributes?.url
    return url ? { url } : null
  }

  if (Array.isArray(image)) return image.map(wrap).filter((img): img is HeroImage => img !== null)
  const single = wrap(image)
  return single ? [single] : []
}

const HeroSlideshow = ({ slides }: HeroProps) => {
  // Instead of using React state and window.innerWidth (which causes SSR lag and layout shift),
  // we generate slides that hold BOTH desktop and mobile images, and use CSS to show/hide the correct one.

  const allSlides = useMemo(() => {
    return (slides || []).flatMap(slide => {
      const desktopImages = getImages(slide.image)
      const mobileImages = getImages(slide.mobile_image)
      
      if (desktopImages.length === 0 && mobileImages.length === 0) return []

      // If there are multiple images for a slide, we create multiple Swiper slides.
      const count = Math.max(desktopImages.length, mobileImages.length, 1)
      
      const generatedSlides = []
      for (let i = 0; i < count; i++) {
        generatedSlides.push({
          ...slide,
          desktopImg: desktopImages[i] || desktopImages[0] || null,
          mobileImg: mobileImages[i] || mobileImages[0] || desktopImages[i] || desktopImages[0] || null
        })
      }
      return generatedSlides
    })
  }, [slides])

  const totalSlides = allSlides.length

  if (totalSlides === 0) return null

  return (
    <div className="relative h-[80vh] w-full overflow-hidden hero-swiper-container">

      {/* Swiper */}
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={totalSlides > 1 ? { delay: 5000, disableOnInteraction: false } : false}
        loop={totalSlides > 1}
        speed={600}
        allowTouchMove={totalSlides > 1}
        navigation={totalSlides > 1 ? {
          prevEl: '.hero-button-prev',
          nextEl: '.hero-button-next',
        } : false}
        pagination={totalSlides > 1 ? {
            el: '.hero-pagination',
            clickable: true,
            renderBullet: function (index, className) {
              return `<span class="${className} w-3 h-3 rounded-full border border-white/50 transition-all duration-300 bg-white/40 hover:bg-white/80 inline-block mx-1"></span>`;
            },
        } : false}
        className="h-full w-full"
      >
        {allSlides.map((slide, slideIndex) => {
          const desktopUrl = slide.desktopImg ? (slide.desktopImg.url.startsWith("http") ? slide.desktopImg.url : `${STRAPI_URL}${slide.desktopImg.url}`) : null
          const mobileUrl = slide.mobileImg ? (slide.mobileImg.url.startsWith("http") ? slide.mobileImg.url : `${STRAPI_URL}${slide.mobileImg.url}`) : null
          
          const hasSeparateMobile = mobileUrl && mobileUrl !== desktopUrl

          return (
            <SwiperSlide key={slideIndex}>
              <div className="relative flex h-full w-full items-center justify-center cursor-pointer group">
                <LocalizedClientLink href={slide.cta_link || "/services"} className="absolute inset-0 z-0 bg-[#2C1E36]">
                  {/* Desktop Image */}
                  {desktopUrl && (
                    <Image
                      key={`desktop-${desktopUrl}`}
                      src={desktopUrl}
                      alt={slide.title || "Hero image"}
                      fill
                      priority={slideIndex === 0}
                      fetchPriority={slideIndex === 0 ? "high" : "auto"}
                      className={`object-cover object-top transition-transform duration-700 group-hover:scale-105 ${hasSeparateMobile ? 'hidden md:block' : 'block'}`}
                      sizes="(min-width: 768px) 100vw, 100vw"
                      quality={90}
                    />
                  )}
                  {/* Mobile Image */}
                  {hasSeparateMobile && (
                    <Image
                      key={`mobile-${mobileUrl}`}
                      src={mobileUrl}
                      alt={slide.title || "Hero image mobile"}
                      fill
                      priority={slideIndex === 0}
                      fetchPriority={slideIndex === 0 ? "high" : "auto"}
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105 md:hidden block"
                      sizes="(max-width: 767px) 100vw, 0vw"
                      quality={90}
                    />
                  )}
                  {/* Subtle overlay to ensure text readability if needed */}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />
                </LocalizedClientLink>

                <div className="relative z-10 container mx-auto px-4 text-center pointer-events-none">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className={slide.theme === "light" ? "text-gray-900" : "text-white"}
                  >
                    {slide.title && (
                      <h1 className="text-4xl md:text-7xl font-bold mb-4 uppercase tracking-tighter drop-shadow-md">
                        {slide.title}
                      </h1>
                    )}
                    {slide.subtitle && (
                      <p className="text-lg md:text-2xl mb-8 font-medium max-w-2xl mx-auto opacity-90 px-4 md:px-0 drop-shadow-md">
                        {slide.subtitle}
                      </p>
                    )}
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          )
        })}

        {totalSlides > 1 && (
          <>
            {/* Prev Arrow */}
            <button
              aria-label="Previous slide"
              className="hero-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-12 h-12 rounded-full text-white hover:scale-110 transition-transform"
              style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Next Arrow */}
            <button
              aria-label="Next slide"
              className="hero-button-next absolute right-4 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-12 h-12 rounded-full text-white hover:scale-110 transition-transform"
              style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Dots */}
            <div
              className="hero-pagination absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center px-4 py-2 rounded-full w-auto"
              style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}
            />
          </>
        )}
      </Swiper>
    </div>
  )
}

export default HeroSlideshow
