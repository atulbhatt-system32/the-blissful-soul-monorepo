"use client"

import React from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type CategoryCard = {
  key: string
  title: string
  description: string
  icon: string
  href: string
  badge?: string
  gradient: string
  borderColor: string
}

const categories: CategoryCard[] = [
  {
    key: "our-collection",
    title: "Our Collection",
    description: "Explore our curated collection of authentic healing crystals and spiritual products",
    icon: "✨",
    href: "/store",
    gradient: "from-[#2C1E36] to-[#4A2D6B]",
    borderColor: "#C5A059",
  },
  {
    key: "combos",
    title: "Combos",
    description: "Handpicked bundles crafted for specific intentions and savings",
    icon: "🎁",
    href: "/collections/combos",
    gradient: "from-[#1A2E22] to-[#2D4A3B]",
    borderColor: "#6EE7A0",
  },
  {
    key: "shop-by-purpose",
    title: "Shop By Purpose",
    description: "Find the perfect crystal for love, protection, abundance, or healing",
    icon: "🎯",
    href: "/store",
    badge: "Popular",
    gradient: "from-[#3B1A0E] to-[#6B3D2D]",
    borderColor: "#F59E0B",
  },
]

const ProductCategories = () => {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #2C1E36 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="content-container relative z-10">
        {/* Section heading */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold text-[#C5A059] font-sans mb-4 block">
            Discover
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#2C1E36] mb-6 uppercase tracking-tight leading-tight">
            Shop Products
          </h2>
          <div className="h-0.5 w-24 bg-[#C5A059] mx-auto rounded-full" />
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {categories.map((cat) => (
            <LocalizedClientLink
              key={cat.key}
              href={cat.href}
              className="group relative overflow-hidden rounded-[28px] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Background gradient */}
              <div className={`bg-gradient-to-br ${cat.gradient} p-8 md:p-10 min-h-[240px] md:min-h-[280px] flex flex-col justify-between relative`}>
                {/* Badge */}
                {cat.badge && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-amber-400 text-[#2C1E36] text-[9px] font-black uppercase tracking-widest rounded-full shadow-md">
                      {cat.badge}
                    </span>
                  </div>
                )}

                {/* Decorative glow */}
                <div 
                  className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-700"
                  style={{ backgroundColor: cat.borderColor }}
                />

                {/* Icon */}
                <div className="mb-6">
                  <span className="text-5xl md:text-6xl group-hover:scale-110 inline-block transition-transform duration-500">
                    {cat.icon}
                  </span>
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-2 tracking-wide">
                    {cat.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-4">
                    {cat.description}
                  </p>
                  
                  {/* Arrow */}
                  <div className="flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                    <span
                      className="text-[10px] uppercase tracking-[0.3em] font-bold"
                      style={{ color: cat.borderColor }}
                    >
                      Explore
                    </span>
                    <svg 
                      width="18" height="18" viewBox="0 0 24 24" fill="none" 
                      stroke={cat.borderColor} 
                      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      className="group-hover:translate-x-2 transition-transform duration-300"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Bottom border accent */}
              <div 
                className="h-1 w-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: cat.borderColor }}
              />
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductCategories
