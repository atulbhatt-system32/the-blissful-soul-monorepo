"use client"

import { useRef, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

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
    theme?: "dark" | "light"
  }>
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

function getImages(image: HeroImage | HeroImage[] | null | undefined): HeroImage[] {
  if (!image) return []
  if (Array.isArray(image)) return image.filter(Boolean)
  return [image]
}

const HeroSlideshow = ({ slides }: HeroProps) => {
  const swiperRef = useRef<SwiperType | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  // Flatten all images out, so uploading multiple images inside a single CMS slide creates multiple Swiper slides.
  const allSlides = (slides || []).flatMap(slide => {
    const images = getImages(slide.image)
    return images.map(img => ({ ...slide, image: img }))
  })

  const totalSlides = allSlides.length

  if (totalSlides === 0) return null

  return (
    <div className="relative h-[80vh] w-full overflow-hidden hero-swiper-container">

      {/* Swiper */}
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={totalSlides > 1}
        speed={600}
        allowTouchMove={true}
        navigation={{
          prevEl: '.hero-button-prev',
          nextEl: '.hero-button-next',
        }}
        pagination={{
          el: '.hero-pagination',
          clickable: true,
          renderBullet: function (index, className) {
            return `<span class="${className} w-3 h-3 rounded-full border border-white/50 transition-all duration-300 bg-white/40 hover:bg-white/80 inline-block mx-1"></span>`;
          },
        }}
        onSwiper={(swiper) => { swiperRef.current = swiper }}
        onRealIndexChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="h-full w-full"
      >
        {allSlides.map((slide, slideIndex) => {
          return (
            <SwiperSlide key={slideIndex}>
              <div className="relative flex h-full w-full items-center justify-center">
                <div className="absolute inset-0 z-0">
                  <Image
                    src={`${STRAPI_URL}${(slide.image as HeroImage).url}`}
                    alt={slide.title || "Hero image"}
                    fill
                    priority={slideIndex === 0}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                </div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className={slide.theme === "light" ? "text-gray-900" : "text-white"}
                  >
                    {slide.title && (
                      <h1 className="text-5xl md:text-7xl font-bold mb-4 uppercase tracking-tighter">
                        {slide.title}
                      </h1>
                    )}
                    {slide.subtitle && (
                      <p className="text-xl md:text-2xl mb-8 font-medium max-w-2xl mx-auto opacity-90">
                        {slide.subtitle}
                      </p>
                    )}
                    {slide.cta_text && slide.cta_link && (
                      <Link
                        href={slide.cta_link}
                        className="inline-block px-10 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300 rounded shadow-2xl"
                      >
                        {slide.cta_text}
                      </Link>
                    )}
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          )
        })}

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
      </Swiper>
    </div>
  )
}

export default HeroSlideshow
