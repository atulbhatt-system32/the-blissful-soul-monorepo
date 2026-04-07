"use client"

import React, { useEffect, useState } from "react"
import { useWishlist } from "@lib/context/wishlist-context"
import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const WishlistTemplate = ({ 
  region,
  countryCode
}: { 
  region: HttpTypes.StoreRegion
  countryCode: string
}) => {
  const { wishlist } = useWishlist()
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (wishlist.length === 0) {
        setProducts([])
        return
      }

      setLoading(true)
      try {
        const { response } = await listProducts({
          countryCode,
          queryParams: { id: wishlist, limit: 100 }
        })
        setProducts(response.products)
      } catch (e) {
        console.error("Error fetching wishlist products", e)
      } finally {
        setLoading(false)
      }
    }

    fetchWishlistProducts()
  }, [wishlist, countryCode])

  return (
    <div className="py-24 md:py-32 bg-[#FBFAF8] min-h-screen">
      <div className="content-container">
        <div className="mb-16 text-center animate-in fade-in slide-in-from-top-4 duration-1000">
          <span className="text-[10px] text-[#C5A059] font-bold uppercase tracking-[0.4em] mb-4 block">Personal Sanctuary</span>
          <h1 className="text-4xl md:text-6xl font-serif text-[#2C1E36] uppercase tracking-tight leading-tight">
            My <span className="italic font-normal">Wishlist</span>
          </h1>
          <p className="mt-6 text-[#665D6B] max-w-lg mx-auto font-sans text-sm md:text-base opacity-80">
            A curated collection of your most-loved crystals and healing sessions. Pieces that resonate with your spirit.
          </p>
        </div>

        {loading ? (
          <SkeletonProductGrid />
        ) : wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in zoom-in-95 duration-700">
            <div className="w-24 h-24 bg-[#2C1E36]/5 rounded-full flex items-center justify-center mb-8">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2C1E36" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-30">
                 <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
               </svg>
            </div>
            <p className="text-2xl font-serif text-[#2C1E36] italic opacity-50 mb-10 max-w-sm">
              Your sanctuary is currently empty. Seek what calls to your soul.
            </p>
            <LocalizedClientLink 
              href="/store"
              className="px-14 py-5 bg-[#2C1E36] text-white rounded-full font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-[#3D2B4A] transition-all shadow-2xl shadow-purple-900/20 active:scale-95"
            >
              Explore Shop
            </LocalizedClientLink>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {products.map((p) => (
              <ProductPreview key={p.id} product={p} region={region} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default WishlistTemplate
