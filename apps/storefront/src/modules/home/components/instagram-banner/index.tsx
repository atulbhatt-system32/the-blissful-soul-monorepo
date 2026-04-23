"use client"

import React from "react"
import Image from "next/image"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
const InstagramBanner = ({ banner, handle }: { banner?: any, handle?: string }) => {
  const instagramUrl = handle ? `https://www.instagram.com/${handle.replace('@', '')}/` : "https://www.instagram.com/pragya.vijh_astrotalks/"

  const imageUrl = banner?.url || banner?.attributes?.url || banner?.data?.attributes?.url
  if (!imageUrl) return null

  const finalImageUrl = imageUrl.startsWith('http') ? imageUrl : `${STRAPI_URL}${imageUrl}`

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
            src={finalImageUrl} 
            alt="Connect with us on Instagram" 
            className="w-full h-auto block" 
            width={1200}
            height={400}
          />
          
          {/* Subtle overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
        </a>
      </div>
    </section>
  )
}

export default InstagramBanner
