"use client"

import { useEffect, useState } from "react"
import { Text, Badge } from "@medusajs/ui"
import { Clock } from "@medusajs/icons"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import { addToCart } from "@lib/data/cart"
import { useParams, useRouter } from "next/navigation"
import { useWishlist } from "@lib/context/wishlist-context"

export default function ProductPreview({
  product,
  isFeatured,
  region,
  categoryHint,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
  categoryHint?: string
}) {
  const router = useRouter()
  const params = useParams()
  const countryCode = params.countryCode as string
  const [isAdding, setIsAdding] = useState(false)
  const { toggleWishlist, isWishlisted } = useWishlist()

  let preferredVariantId: string | undefined = undefined
  let matchingVariant: HttpTypes.StoreProductVariant | undefined = undefined

  if (categoryHint && product.variants) {
    matchingVariant = product.variants.find(v => {
      // Look at the variant's options or metadata to match the categoryHint ('audio' or 'video')
      const formatOption = v.options?.find(opt => opt.value?.toLowerCase() === categoryHint.toLowerCase())
      if (formatOption) return true

      const metadataFormat = v.metadata?.format || v.metadata?.label
      if (typeof metadataFormat === 'string' && metadataFormat.toLowerCase().includes(categoryHint.toLowerCase())) {
        return true
      }
      return false
    })
    
    if (matchingVariant) {
      preferredVariantId = matchingVariant.id
    }
  }

  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: preferredVariantId
  })

  const displayPrice = preferredVariantId && variantPrice ? variantPrice : cheapestPrice
  
  let fallbackLabel: string | undefined = undefined
  let fallbackDuration: string | undefined = undefined

  if (product.variants && (!product.metadata?.label || !product.metadata?.duration)) {
    const variantWithLabel = product.variants.find(v => v.metadata?.label)
    const variantWithDuration = product.variants.find(v => v.metadata?.duration)
    
    if (variantWithLabel) {
      fallbackLabel = variantWithLabel.metadata?.label as string
    }
    if (variantWithDuration) {
      fallbackDuration = variantWithDuration.metadata?.duration as string
    }
  }

  const displayLabel = matchingVariant?.metadata?.label || product.metadata?.label || fallbackLabel
  const displayDuration = matchingVariant?.metadata?.duration || product.metadata?.duration || fallbackDuration

  const isSession = product.type?.value === "session" || product.tags?.some((t: any) => t.value === "session") || product.metadata?.is_service === true || product.metadata?.is_service === "true"

  const handleBooking = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!preferredVariantId && !product.variants?.[0]?.id) return
    
    setIsAdding(true)
    try {
      if (isSession) {
        router.push(`/${countryCode}/book-now?service_id=${product.id}`)
      } else {
        await addToCart({
          variantId: preferredVariantId || product.variants![0].id,
          quantity: 1,
          countryCode,
        })
        // Removed redirect to checkout for regular products
      }
    } catch (err) {
      console.error("Error added to cart:", err)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="group relative bg-white rounded-[32px] overflow-hidden shadow-[0_4px_25px_rgba(44,30,54,0.04)] hover:shadow-[0_20px_60px_rgba(44,30,54,0.12)] transition-all duration-700 border border-[#2C1E36]/[0.05] flex flex-col h-full hover:-translate-y-2">
      <LocalizedClientLink href={`/products/${product.handle}`} className="flex-grow">
        <div data-testid="product-wrapper" className="relative">
          {/* Discount Badge */}
          {Number(displayPrice?.percentage_diff) > 0 && (
            <div className="absolute top-4 left-4 z-10 bg-[#2C1E36] text-[#C5A059] text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-[#C5A059]/20">
              -{displayPrice?.percentage_diff}%
            </div>
          )}

          {/* Session Type Badge (Metadata) */}
          {!!displayLabel && (
            <div className="absolute top-4 right-4 z-10">
              <Badge className="text-[10px] font-bold uppercase tracking-wider !rounded-full !bg-white/95 !text-[#2C1E36] border border-[#2C1E36]/10 shadow-sm backdrop-blur-sm px-4 py-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse"></span>
                {(displayLabel as string)}
              </Badge>
            </div>
          )}
          
          <div className="p-3">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
            className="!rounded-[24px] overflow-hidden aspect-square grayscale-[0.1] group-hover:grayscale-0 transition-all duration-700 scale-[0.99] group-hover:scale-100"
          />

          {/* Wishlist Button Overlay */}
          <button
            onClick={(e) => {
               e.preventDefault()
               toggleWishlist(product.id as string)
            }}
            className="absolute bottom-4 right-4 z-20 w-11 h-11 bg-white/95 backdrop-blur rounded-full flex items-center justify-center shadow-2xl border border-[#2C1E36]/5 text-[#2C1E36] hover:scale-110 active:scale-90 transition-all pointer-events-auto"
          >
             <svg 
               xmlns="http://www.w3.org/2000/svg" 
               width="20" 
               height="20" 
               viewBox="0 0 24 24" 
               fill={isWishlisted(product.id as string) ? "currentColor" : "none"} 
               stroke="currentColor" 
               strokeWidth="1.5" 
               strokeLinecap="round" 
               strokeLinejoin="round"
               className={isWishlisted(product.id as string) ? "text-[#C5A059]" : "text-[#2C1E36]"}
             >
               <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
             </svg>
          </button>
          </div>
          
          <div className="p-6 flex flex-col items-center text-center">
            <Text className="font-serif text-[#2C1E36] text-[20px] md:text-[22px] mb-4 group-hover:text-[#C5A059] transition-colors line-clamp-2 leading-[1.2] px-2 font-medium" data-testid="product-title">
              {product.title}
            </Text>
            
            <div className="flex flex-col items-center gap-y-4 mb-2">
              {displayPrice && (
                <div className="flex items-center gap-x-2">
                   <PreviewPrice price={displayPrice} />
                </div>
              )}
              
              {/* Session Duration (Metadata) */}
              {!!displayDuration && (
                <div className="flex items-center gap-x-2 text-[#665D6B] text-[11px] font-bold tracking-[0.1em] uppercase bg-[#F5F4F0] px-4 py-1.5 rounded-full border border-[#2C1E36]/5">
                  <Clock className="text-[#C5A059] w-3.5 h-3.5" />
                  <span>{(displayDuration as string)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </LocalizedClientLink>

      <div className="px-6 pb-8 mt-auto">
        <button 
          onClick={handleBooking}
          disabled={isAdding}
          className="w-full py-4 bg-[#2C1E36] text-white rounded-[20px] font-bold hover:bg-[#3D2B4A] shadow-xl shadow-purple-900/10 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none transition-all duration-300 uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-x-3 active:scale-95"
        >
          {isAdding ? (
            <>
              <svg className="animate-spin h-4 w-4 text-[#C5A059]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span>PLEASE SEC...</span>
            </>
          ) : (
            <>
               <span className="font-sans">{isSession ? "SELECT SESSION" : "ADD TO BASKET"}</span>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#C5A059]"><path d="m9 18 6-6-6-6"/></svg>
            </>
          )}
        </button>
      </div>
    </div>
  )
}


