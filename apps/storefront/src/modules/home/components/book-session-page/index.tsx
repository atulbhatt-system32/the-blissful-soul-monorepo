"use client"

import React, { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"

type BookSessionClientProps = {
  heroTitle: string
  sectionTitle: string
  topProducts: HttpTypes.StoreProduct[]
  audioProducts: HttpTypes.StoreProduct[]
  videoProducts: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
  strapiMap?: Record<string, any>
}

const tabs = [
  { key: "all", label: "TOP SERVICES", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> },
  { key: "audio", label: "AUDIO SESSION", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="23"/><line x1="8" x2="16" y1="23" y2="23"/></svg> },
  { key: "video", label: "VIDEO SESSION", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg> },
]

export default function BookSessionClient({
  heroTitle,
  sectionTitle,
  topProducts,
  audioProducts,
  videoProducts,
  region,
  strapiMap = {},
}: BookSessionClientProps) {
  const [activeTab, setActiveTab] = useState("all")

  const productMap: Record<string, HttpTypes.StoreProduct[]> = {
    all: topProducts,
    audio: audioProducts,
    video: videoProducts,
  }

  const currentProducts = productMap[activeTab] || []

  const displayTabs = [
    { key: "all", label: "Top" },
    { key: "audio", label: "Audio" },
    { key: "video", label: "Video" },
  ]

  return (
    <div className="bg-[#FAF9F6]">
      {/* Hero Section */}
      <section className="bg-[#1A0E22] py-12 md:py-16 flex flex-col items-center justify-center text-center">
        <div className="content-container flex flex-col items-center gap-y-7">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold text-[#C5A059] font-sans">
             SESSIONS
          </span>
          <div className="flex flex-col gap-y-5 max-w-3xl">
            <h1 className="font-serif text-3xl md:text-[42px] text-white leading-tight font-semibold">
              Our services
            </h1>
            <p className="text-white/40 text-[14px] md:text-[16px] max-w-2xl mx-auto leading-relaxed font-sans font-medium">
              Choose audio or video sessions — tarot, kundali, therapy, and full astrology readings.
            </p>
          </div>
          <a 
            href="/contact"
            className="bg-[#C5A059] text-[#1A0E22] px-8 py-3 rounded-xl text-[14px] font-bold font-sans hover:opacity-90 transition-all shadow-xl active:scale-95 mt-2"
          >
            Questions? Contact us
          </a>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-20">
        <div className="content-container">
          <div className="text-center mb-12">
            {/* Tabs Filter UI */}
            <div className="flex flex-wrap items-center justify-center p-1.5 bg-[#F5F4F0] rounded-[32px] mb-16 shadow-inner max-w-full mx-auto">
               {displayTabs.map((tab) => (
                 <button 
                   key={tab.key}
                   onClick={() => setActiveTab(tab.key)}
                   className={`px-6 md:px-10 py-3 rounded-[24px] text-[13px] md:text-[14px] font-bold transition-all duration-300 ${
                     activeTab === tab.key 
                       ? 'bg-[#2C1E36] text-white border-[1.5px] border-[#C5A059] shadow-lg scale-[1.02] md:scale-105' 
                       : 'text-[#6B6670] hover:text-[#2C1E36]'
                   }`}
                 >
                   {tab.label}
                 </button>
               ))}
            </div>
          </div>

          {/* Services Grid */}
          <div className="min-h-[400px]">
            {currentProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {currentProducts.map((product) => (
                  <ProductPreview key={product.id} product={product} region={region} isFeatured categoryHint={activeTab} strapiContent={strapiMap[product.handle ?? ""]} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-24 bg-white/50 backdrop-blur-sm rounded-[40px] border border-dashed border-[#2C1E36]/10">
                <span className="text-[#C5A059] text-3xl mb-4 font-serif">✨</span>
                <p className="text-[#2C1E36]/40 font-serif italic text-lg">{`No ${activeTab !== 'all' ? activeTab : ''} sessions are currently available.`}</p>
                <p className="text-[10px] uppercase tracking-widest font-black text-[#C5A059] mt-2">New sessions are being added soon</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

