"use client"

import React from "react"
import Image from "next/image"
import instaBannerImg from "../../../../images/insta-banner.png"

const InstagramBanner = ({ handle }: { images?: any[], handle?: string }) => {
  const instagramUrl = handle ? `https://www.instagram.com/${handle.replace('@', '')}/` : "https://www.instagram.com/pragya.vijh_astrotalks/"

  return (
    <section className="py-12 md:py-20 bg-[#FAF9F6] overflow-hidden">
      <div className="content-container">
        <a 
          href={instagramUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full rounded-[24px] md:rounded-[40px] overflow-hidden shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-500 group relative"
        >
          <Image 
            src={instaBannerImg} 
            alt="Connect with us on Instagram" 
            className="w-full h-auto block" 
            placeholder="blur"
          />
          
          {/* Subtle overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
        </a>
      </div>
    </section>
  )
}

export default InstagramBanner
