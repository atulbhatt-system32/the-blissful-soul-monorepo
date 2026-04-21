"use client"

import { useEffect, useState, useMemo } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { motion } from "framer-motion"
import Image from "next/image"

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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Compute slides based on viewport. 
  // If mobile, we use mobile_image count. If desktop, we use image count.
  const allSlides = useMemo(() => {
    return (slides || []).flatMap(slide => {
      const desktopImages = getImages(slide.image)
      const mobileImages = getImages(slide.mobile_image)
      
      const imagesToUse = isMobile 
        ? (mobileImages.length > 0 ? mobileImages : desktopImages)
        : desktopImages
        
      if (imagesToUse.length === 0) return []

      return imagesToUse.map((img) => ({
        ...slide,
        displayImage: img
      }))
    })
  }, [slides, isMobile])

  const totalSlides = allSlides.length

  if (totalSlides === 0) return null

  return (
    <div className="relative h-[80vh] w-full overflow-hidden hero-swiper-container">

      {/* Swiper */}
      <Swiper
        key={isMobile ? "mobile" : "desktop"}
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
          const imageUrl = (slide as any).displayImage.url.startsWith("http") 
            ? (slide as any).displayImage.url 
            : `${STRAPI_URL}${(slide as any).displayImage.url}`

          return (
            <SwiperSlide key={slideIndex}>
              <div className="relative flex h-full w-full items-center justify-center">
                <div className="absolute inset-0 z-0">
                  <Image
                    key={imageUrl}
                    src={imageUrl}
                    alt={slide.title || "Hero image"}
                    fill
                    priority={slideIndex === 0}
                    className="object-cover object-top"
                    sizes="100vw"
                  />
                </div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className={slide.theme === "light" ? "text-gray-900" : "text-white"}
                  >
                    {slide.title && (
                      <h1 className="text-4xl md:text-7xl font-bold mb-4 uppercase tracking-tighter">
                        {slide.title}
                      </h1>
                    )}
                    {slide.subtitle && (
                      <p className="text-lg md:text-2xl mb-8 font-medium max-w-2xl mx-auto opacity-90 px-4 md:px-0">
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
