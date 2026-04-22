"use client"

import React from "react"
import { motion } from "framer-motion"
import Image from "next/image"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

const defaultImages = [
  "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop"
]

const InstagramBanner = ({ images, handle }: { images?: any[], handle?: string }) => {
  const displayImages = images && images.length >= 4 
    ? images.slice(0, 4).map(img => img.url.startsWith('http') ? img.url : `${STRAPI_URL}${img.url}`) 
    : defaultImages
  
  const displayHandle = handle || "@pragya.vijh_astrotalks"
  const instagramUrl = handle ? `https://www.instagram.com/${handle.replace('@', '')}/` : "https://www.instagram.com/pragya.vijh_astrotalks/"

  return (
    <section className="py-20 bg-[#FAF9F6] overflow-hidden">
      <div className="content-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="w-full md:w-1/2 space-y-6">
            <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold text-[#C5A059] font-sans">
              Join Our Community
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-[#2C1E36] leading-tight">
              Connect With Us On <span className="italic">Instagram</span>
            </h2>
            <p className="text-[#665D6B] text-lg font-medium leading-relaxed max-w-lg">
              Follow us for daily spiritual guidance, crystal care tips, and a glimpse into the blissful journey of healing.
            </p>
            <a 
              href={instagramUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#2C1E36] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#C5A059] transition-colors duration-300 shadow-xl shadow-black/5"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              Follow {displayHandle}
            </a>
          </div>

          <div className="w-full md:w-1/2 relative">
             <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-4 pt-12">
                    <div className="rounded-[24px] overflow-hidden shadow-2xl rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                       <Image src={displayImages[0]} width={300} height={400} alt="Spiritual Life" className="object-cover h-60 w-full" />
                    </div>
                    <div className="rounded-[24px] overflow-hidden shadow-2xl rotate-[3deg] hover:rotate-0 transition-transform duration-500">
                       <Image src={displayImages[1]} width={300} height={400} alt="Crystals" className="object-cover h-48 w-full" />
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="rounded-[24px] overflow-hidden shadow-2xl rotate-[2deg] hover:rotate-0 transition-transform duration-500">
                       <Image src={displayImages[2]} width={300} height={400} alt="Healing Rituals" className="object-cover h-48 w-full" />
                    </div>
                    <div className="rounded-[24px] overflow-hidden shadow-2xl rotate-[-3deg] hover:rotate-0 transition-transform duration-500">
                       <Image src={displayImages[3]} width={300} height={400} alt="Meditation" className="object-cover h-60 w-full" />
                    </div>
                 </div>
             </div>
             {/* Decorative element */}
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#C5A059]/10 rounded-full blur-3xl -z-10" />
             <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#2C1E36]/5 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default InstagramBanner
