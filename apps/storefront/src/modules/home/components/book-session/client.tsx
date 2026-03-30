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
  { key: "top", label: "⭐ Top Services" },
  { key: "audio", label: "📞 Audio Session" },
  { key: "video", label: "🎥 Video Session" },
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

  const currentProducts = productMap[activeTab] || []

  return (
    <section className="py-20 bg-white">
      <div className="content-container">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-pink-900 mb-6 uppercase tracking-tight">
            {title}
          </h2>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-2 rounded-full border text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === tab.key
                    ? "bg-black text-white"
                    : "border-gray-200 text-gray-500 hover:border-pink-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {currentProducts.length > 0 ? (
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {currentProducts.map((product) => (
              <li key={product.id}>
                <ProductPreview product={product} region={region} isFeatured categoryHint={activeTab} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-serif italic">
              No services available in this category yet.
            </p>
          </div>
        )}

        <div className="text-center mt-12">
          <LocalizedClientLink
            href="/book-session"
            className="inline-block text-xs font-bold uppercase tracking-[0.3em] border-b-2 border-pink-500 pb-1 text-pink-900"
          >
            Show More
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}

export default BookSessionClient
