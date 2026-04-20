"use client"

import React from "react"
import Image from "next/image"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

const EbookSection = ({ data }: { data?: any }) => {
  const imageUrl = data?.image?.url ? (data.image.url.startsWith('http') ? data.image.url : `${STRAPI_URL}${data.image.url}`) : "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop"
  
  const title = data?.title || "New Books Coming Soon"
  const description = data?.description || "We are making new books to help you heal and grow. Soon you will be able to read them on your phone, tablet, or computer."
  const badgeText = data?.badge_text || "E-Books"
  const launchText = data?.launch_text || "Launching Soon"

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden relative">
      <div className="content-container">
        <div className="bg-[#FAF9F6] rounded-[48px] overflow-hidden border border-[#2C1E36]/5 shadow-xl relative">
          <div className="flex flex-col lg:flex-row items-stretch">
            {/* Left side: Content */}
            <div className="flex-1 p-10 md:p-16 lg:p-20 space-y-8 relative z-10">
              <div className="space-y-6">
                <div>
                  <span className="text-[12px] font-bold text-[#C5A059] uppercase tracking-[0.2em] block mb-2">{badgeText}</span>
                  <h2 className="text-4xl md:text-5xl font-serif text-[#2C1E36] leading-[1.1] tracking-tight mb-4" dangerouslySetInnerHTML={{ __html: title.replace('Coming Soon', '<span class="italic text-[#C5A059]">Coming Soon</span>') }}>
                  </h2>
                </div>
                
                <p className="text-[#665D6B] text-lg font-medium leading-relaxed max-w-md">
                   {description}
                </p>
              </div>

              <div className="space-y-6 pt-4">
                 <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm text-xl shrink-0">✨</div>
                    <p className="text-[#2C1E36] font-bold text-base">Simple & Real Guidance</p>
                 </div>
                 <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm text-xl shrink-0">📱</div>
                    <p className="text-[#2C1E36] font-bold text-base">Read on any device</p>
                 </div>
              </div>

              <div className="pt-8">
                 <div className="inline-block px-10 py-4 bg-[#2C1E36] text-white rounded-full font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-black/10">
                    {launchText}
                 </div>
              </div>
            </div>

            {/* Right side: Visual */}
            <div className="flex-1 w-full min-h-[400px] lg:min-h-full relative overflow-hidden bg-[#2C1E36] flex items-center justify-center">
               <Image 
                  src={imageUrl} 
                  fill 
                  alt="Coming Soon" 
                  className="object-cover opacity-40 mix-blend-overlay"
               />
               <div className="relative z-10 text-center">
                  <div className="w-24 h-24 md:w-32 md:h-32 border-2 border-dashed border-[#C5A059]/50 rounded-full flex items-center justify-center animate-spin-slow mb-6 mx-auto">
                     <span className="text-[#C5A059] font-serif italic text-2xl md:text-3xl">Soon</span>
                  </div>
                  <h3 className="text-white font-serif text-3xl md:text-4xl font-bold uppercase tracking-tighter">
                    Coming <br /> <span className="text-[#C5A059]">Soon</span>
                  </h3>
               </div>
               
               {/* Ambient Glow */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,#C5A059/10_0%,transparent_70%)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EbookSection
