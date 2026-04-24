import React from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getServiceCategories } from "@lib/data/categories"

const ServicesGrid = async () => {
  const categories = await getServiceCategories()

  if (!categories.length) return null

  return (
    <section id="sacred-services" className="py-14 md:py-20 bg-white relative overflow-hidden">
      <div className="content-container relative z-10">
        {/* Premium Scroll Bridge */}
        <div className="flex flex-col items-center mb-12 md:mb-20 pt-10 group">
          <div className="relative mb-3">
            <span className="text-sm md:text-lg uppercase tracking-[0.4em] font-bold text-[#2C1E36] font-sans">
              Still confused?
            </span>
          </div>

          <div className="text-[#C5A059] animate-bounce">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="7 13 12 18 17 13" />
              <polyline points="7 6 12 11 17 6" className="opacity-30" />
            </svg>
          </div>
        </div>

        {/* Section heading */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-serif text-[#2C1E36] mb-5 uppercase tracking-tighter leading-tight">
            BOOK OUR SACRED SERVICES
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="h-[1px] w-10 bg-[#C5A059]/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]/50" />
            <div className="h-[1px] w-10 bg-[#C5A059]/30" />
          </div>
        </div>

        {/* Services Flip Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {categories.map((category) => {
            const images = (category as any).product_category_images as Array<{ url: string }> | undefined
            const imageUrl = images?.[0]?.url
            const color = (category.metadata?.color as string) || "bg-purple-100"
            const oneLiner = (category.metadata?.["one-liner"] as string) || category.description

            return (
              <div key={category.id} className="group h-[220px] md:h-[260px] [perspective:1000px]">
                <div className="relative h-full w-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">

                  {/* Front Side */}
                  <div className="absolute inset-0 h-full w-full rounded-[28px] overflow-hidden border border-black/5 shadow-md [backface-visibility:hidden]">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-purple-50 flex items-center justify-center">
                        <span className="text-4xl text-purple-300">✦</span>
                      </div>
                    )}
                  </div>

                  {/* Back Side */}
                  <div className={`absolute inset-0 h-full w-full rounded-[28px] ${color} border border-[#C5A059]/20 shadow-xl [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col items-center justify-center gap-2 px-4 py-4 text-center`}>
                    <div className="flex gap-1 mb-1">
                      <span className="w-1 h-1 rounded-full bg-[#C5A059]/50" />
                      <span className="w-1 h-1 rounded-full bg-[#C5A059]/30" />
                      <span className="w-1 h-1 rounded-full bg-[#C5A059]/50" />
                    </div>
                    <h3 className="text-sm md:text-base font-bold text-[#2C1E36] uppercase tracking-[0.18em] leading-tight">
                      {category.name}
                    </h3>
                    <div className="w-8 h-[1px] bg-[#C5A059]/50" />
                    <p className="text-[#665D6B] text-[12px] md:text-[13px] leading-snug font-medium max-w-[90%]">
                      {oneLiner}
                    </p>
                    <LocalizedClientLink
                      href={`/services/${category.handle}`}
                      className="mt-1 px-6 py-2 bg-[#C5A059] text-white rounded-full font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-[#C5A059]/25 hover:bg-[#B38E4A] hover:shadow-xl transition-all active:scale-95"
                    >
                      Book Now
                    </LocalizedClientLink>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 md:mt-16">
          <LocalizedClientLink 
            href="/store"
            className="inline-block text-[13px] md:text-[14px] font-black uppercase tracking-[0.4em] text-[#2C1E36] border-b-2 border-[#2C1E36]/20 pb-2 hover:border-[#C5A059] transition-all"
          >
            EXPLORE OUR SERVICES &rarr;
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}

export default ServicesGrid
