"use client"

import React, { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type BookSessionClientProps = {
  title: string
  topProducts: HttpTypes.StoreProduct[]
  audioProducts: HttpTypes.StoreProduct[]
  videoProducts: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
}

const tabs = [
  { key: "top", label: "Top Services", icon: "⭐" },
  { key: "audio", label: "Audio Session", icon: "📞" },
  { key: "video", label: "Video Session", icon: "🎥" },
]

const BookSessionClient = ({
  title,
  topProducts,
  audioProducts,
  videoProducts,
  region,
}: BookSessionClientProps) => {
  const [activeTab, setActiveTab] = useState("top")

  const productMap: Record<string, HttpTypes.StoreProduct[]> = {
    top: topProducts,
    audio: audioProducts,
    video: videoProducts,
  }

  const currentItems = (productMap[activeTab] || []).flatMap(product => {
    // If it's a session and has multiple variants, treat each variant as a card
    if (product.variants && product.variants.length > 1) {
      return product.variants
        .filter(v => {
          // 1. Respect absolute hidden flag (hides everywhere)
          if (v.metadata?.hidden === "true" || v.metadata?.hidden === true) return false
          
          // 2. Specifically hide from "Top Services" tab if flagged
          if (activeTab === "top" && (v.metadata?.hide_from_top === "true" || v.metadata?.hide_from_top === true)) return false

          // 3. In Audio/Video tabs, only show matching formats
          if (activeTab === "audio" || activeTab === "video") {
            const variantJson = JSON.stringify(v).toLowerCase()
            return variantJson.includes(activeTab)
          }
          
          return true 
        })
        .map(v => ({
          product,
          variantId: v.id
        }))
    }
    // Otherwise just show the product card as usual
    return [{ product, variantId: undefined }]
  })

  return (
    <section className="pt-20 pb-12 bg-[#FAF9F6]">
      <div className="content-container">
        <div className="text-center mb-16">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold text-[#C5A059] font-sans mb-4 block animate-in fade-in slide-in-from-bottom-2 duration-700">
             SESSIONS
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#2C1E36] mb-12 uppercase tracking-tight leading-tight">
            {title}
          </h2>

          {/* Luxury Filter UI */}
          <div className="inline-flex flex-wrap justify-center items-center p-1.5 bg-[#F5F4F0] rounded-[32px] shadow-sm border border-[#2C1E36]/5 animate-in fade-in zoom-in-95 duration-500">
             {tabs.map((tab) => (
               <button 
                 key={tab.key}
                 onClick={() => setActiveTab(tab.key)}
                 className={`px-6 md:px-10 py-3 rounded-[24px] text-[13px] md:text-[14px] font-bold transition-all duration-300 flex items-center gap-2 ${
                   activeTab === tab.key 
                     ? 'bg-[#2C1E36] text-white border-[1.5px] border-[#C5A059] shadow-xl scale-105' 
                     : 'text-[#665D6B] hover:text-[#2C1E36] hover:bg-[#2C1E36]/5'
                 }`}
               >
                 <span className="text-base">{tab.icon}</span>
                 {tab.label}
               </button>
             ))}
          </div>
        </div>

        <div className="min-h-[400px]">
          {currentItems.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {currentItems.map((item, idx) => (
                <li key={`${item.product.id}-${item.variantId || idx}`}>
                  <ProductPreview 
                    product={item.product} 
                    forceVariantId={item.variantId}
                    region={region} 
                    isFeatured 
                    categoryHint={activeTab} 
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-24 bg-white/50 backdrop-blur-sm rounded-[40px] border border-dashed border-[#2C1E36]/10 animate-in fade-in duration-500">
              <p className="text-[#665D6B]/50 font-serif italic text-lg">
                No services available in this category yet.
              </p>
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <LocalizedClientLink
            href="/book-session"
            className="inline-block text-[11px] font-bold uppercase tracking-[0.4em] text-[#C5A059] border-b border-[#C5A059]/30 pb-2 hover:text-[#2C1E36] hover:border-[#2C1E36] transition-all"
          >
            Explore All Sessions &rarr;
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}

export default BookSessionClient
