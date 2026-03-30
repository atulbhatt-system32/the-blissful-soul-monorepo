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
  region
}: BookSessionClientProps) {
  const [activeTab, setActiveTab] = useState("all")

  const productMap: Record<string, HttpTypes.StoreProduct[]> = {
    all: topProducts,
    audio: audioProducts,
    video: videoProducts,
  }

  const currentProducts = productMap[activeTab] || []

  return (
    <div className="bg-[#FAF9F6]">
      {/* Hero Section */}
      <section className="bg-[#0A0A0A] py-24 md:py-32 flex items-center justify-center text-center">
        <h1 className="text-white text-5xl md:text-7xl font-serif uppercase tracking-tight">
          {heroTitle}
        </h1>
      </section>

      {/* Category Section */}
      <section className="py-20">
        <div className="content-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-serif text-pink-900 mb-8 uppercase tracking-tight">
              {sectionTitle}
            </h2>
            
            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
               {tabs.map((tab) => (
                 <button 
                   key={tab.key}
                   onClick={() => setActiveTab(tab.key)}
                   className={`flex items-center gap-2 px-8 py-3 rounded-lg border text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab.key ? 'bg-black text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-pink-300'}`}
                 >
                   {tab.icon}
                   {tab.label}
                 </button>
               ))}
            </div>
          </div>

          {/* Services Grid */}
          {currentProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {currentProducts.map((product) => (
                <ProductPreview key={product.id} product={product} region={region} isFeatured categoryHint={activeTab} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <p className="text-gray-400 font-serif italic mb-2">No services available in this category yet.</p>
              <button onClick={() => setActiveTab("all")} className="text-pink-500 text-sm font-bold border-b border-pink-500">View Top Services</button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

