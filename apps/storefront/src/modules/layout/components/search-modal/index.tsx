"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Text } from "@medusajs/ui"
import X from "@modules/common/icons/x"
import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import { getRegion } from "@lib/data/regions"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"

type SearchModalProps = {
  isOpen: boolean
  close: () => void
  countryCode: string
}

const SearchModal = ({ isOpen, close, countryCode }: SearchModalProps) => {
  const [query, setQuery] = useState("")
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([])
  const [region, setRegion] = useState<HttpTypes.StoreRegion | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // Fetch region for prices
  useEffect(() => {
    const fetchRegion = async () => {
      const res = await getRegion(countryCode)
      setRegion(res || null)
    }
    fetchRegion()
  }, [countryCode])

  // Simple debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 2) {
        setIsLoading(true)
        setHasSearched(true)
        const { response } = await listProducts({
            countryCode,
            queryParams: { q: query, limit: 12 }
        })
        setProducts(response.products)
        setIsLoading(false)
      } else {
        setProducts([])
        setHasSearched(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [query, countryCode])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto outline-none transition-all duration-300">
      {/* Search Header Area */}
      <div className="content-container py-12 relative">
        <button 
          onClick={close} 
          className="absolute right-6 top-10 p-2 hover:bg-pink-50 rounded-full transition-colors text-pink-900"
        >
          <X size={32} />
        </button>

        <div className="flex flex-col items-center justify-center pt-10 pb-16">
          <input 
            autoFocus
            type="text"
            placeholder="Search products..."
            className="w-full max-w-2xl text-center bg-transparent border-b-2 border-pink-100 py-4 text-5xl md:text-7xl font-serif text-pink-950 outline-none focus:border-pink-300 transition-colors uppercase tracking-tight placeholder:text-pink-100 px-4"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {!hasSearched && (
             <p className="mt-8 text-pink-900/40 font-serif italic text-lg">
                Start typing to see products you are looking for.
             </p>
          )}
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className="w-full pt-10 border-t border-pink-50">
            {/* Results Title Area as Hero equivalent */}
            <div className="mb-12 text-center py-10">
               <h2 className="text-4xl md:text-6xl font-serif text-pink-950 uppercase tracking-tight">
                  Search Results: <span className="text-pink-400">"{query}"</span>
               </h2>
               <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium uppercase tracking-widest">
                  Home / Show Crystals / Search results for "{query}"
               </div>
            </div>

            {isLoading ? (
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="aspect-[4/5] bg-pink-50 rounded-2xl animate-pulse" />
                  ))}
               </div>
            ) : (
              <>
                {products.length > 0 ? (
                  <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {products.map((p) => (
                      <li key={p.id}>
                        {region && <ProductPreview product={p} region={region} />}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-20">
                     <p className="text-xl font-serif text-pink-950 italic opacity-50">
                        No products found for this search query.
                     </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchModal
