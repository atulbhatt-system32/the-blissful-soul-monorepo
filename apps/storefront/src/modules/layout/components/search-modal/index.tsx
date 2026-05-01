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
          queryParams: { q: query, limit: 12 },
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

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [close])

  // Prevent body scroll when search is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] bg-white/95 overflow-y-auto outline-none animate-in fade-in zoom-in-95 duration-300 ease-out">
      {/* Search Header Area */}
      <div className="content-container py-12 relative min-h-screen flex flex-col">
        <button
          onClick={close}
          className="absolute right-6 top-8 p-3 hover:bg-[#2C1E36]/5 rounded-full transition-all text-[#2C1E36] group"
          aria-label="Close search"
        >
          <X
            size={36}
            className="group-hover:rotate-90 transition-transform duration-300"
          />
        </button>

        <div className="flex flex-col items-center justify-center pt-24 pb-20">
          <div className="w-full max-w-3xl relative group">
            <input
              autoFocus
              type="text"
              placeholder="What are you seeking?"
              className="w-full text-center bg-transparent border-b-2 border-[#C5A059]/20 py-4 md:py-6 text-xl md:text-5xl font-serif text-[#2C1E36] outline-none focus:border-[#C5A059] transition-all uppercase tracking-normal placeholder:text-[#2C1E36]/10 px-8 md:px-12"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-[#2C1E36]/20 hover:text-[#2C1E36] transition-colors"
              >
                <X size={24} />
              </button>
            )}
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#C5A059] transition-all duration-700 group-focus-within:w-full"></div>
          </div>

          {!hasSearched ? (
            <div className="mt-12 text-center animate-in fade-in slide-in-from-bottom-2 duration-700">
              <p className="text-[#2C1E36]/40 font-serif italic text-xl mb-4">
                "Let your intuition guide your search..."
              </p>
              <div className="flex flex-wrap justify-center gap-3 text-[10px] uppercase tracking-[0.2em] font-bold text-[#C5A059]/60">
                <span>Amethyst</span> • <span>Rose Quartz</span> •{" "}
                <span>Citrine</span> • <span>Sessions</span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setQuery("")}
              className="mt-6 text-xs uppercase tracking-widest font-bold text-[#C5A059] hover:text-[#2C1E36] transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className="w-full flex-1 pt-10 border-t border-[#2C1E36]/5 animate-in fade-in duration-500">
            {/* Results Title Area as Hero equivalent */}
            <div className="mb-16 text-center py-6">
              <span className="text-[10px] text-[#C5A059] font-bold uppercase tracking-[0.4em] mb-4 block">
                Discovery
              </span>
              <h2 className="text-3xl md:text-5xl font-serif text-[#2C1E36] uppercase tracking-tight">
                Results for{" "}
                <span className="italic font-normal opacity-60">"{query}"</span>
              </h2>
              <div className="mt-6 flex items-center justify-center gap-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                <span>The Blissful Soul</span>
                <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                <span>{products.length} Items Found</span>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[4/5] bg-[#2C1E36]/5 rounded-3xl animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="pb-24">
                {products.length > 0 ? (
                  <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16">
                    {products.map((p) => (
                      <li
                        key={p.id}
                        className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                      >
                        {region && (
                          <ProductPreview product={p} region={region} />
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-20 flex flex-col items-center">
                    <p className="text-2xl font-serif text-[#2C1E36] italic opacity-40 mb-8 max-w-sm">
                      "Your seeking continues. No crystals matched this query."
                    </p>
                    <button
                      onClick={close}
                      className="px-10 py-4 border-2 border-[#2C1E36] text-[#2C1E36] rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#2C1E36] hover:text-white transition-all"
                    >
                      Close & Explore Shop
                    </button>
                  </div>
                )}

                {products.length > 0 && (
                  <div className="mt-32 text-center pb-20 border-t border-[#2C1E36]/5 pt-20">
                    <button
                      onClick={close}
                      className="group flex flex-col items-center gap-y-4 mx-auto"
                    >
                      <div className="w-12 h-12 rounded-full border border-[#2C1E36]/10 flex items-center justify-center group-hover:bg-[#2C1E36] group-hover:text-white transition-all">
                        <X size={20} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#2C1E36]/60 group-hover:text-[#2C1E36]">
                        Close Search
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchModal
