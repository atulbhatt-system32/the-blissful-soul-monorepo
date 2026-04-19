"use client"

import { useState } from "react"
import { Text, Badge } from "@medusajs/ui"
import { Clock } from "@medusajs/icons"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import { addToCart } from "@lib/data/cart"
import { useParams, useRouter } from "next/navigation"
import { useWishlist } from "@lib/context/wishlist-context"
import { useNotification } from "@lib/context/notification-context"

export default function ProductPreview({
  product,
  isFeatured,
  region,
  categoryHint,
  forceVariantId,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
  categoryHint?: string
  forceVariantId?: string
}) {
  const router = useRouter()
  const params = useParams()
  const countryCode = params.countryCode as string
  const [isAdding, setIsAdding] = useState(false)
  const [itemAdded, setItemAdded] = useState(false)
  const { toggleWishlist, isWishlisted } = useWishlist()
  const { showNotification } = useNotification()

  let preferredVariantId: string | undefined = forceVariantId
  let matchingVariant: HttpTypes.StoreProductVariant | undefined = undefined

  if (preferredVariantId) {
    matchingVariant = product.variants?.find(v => v.id === preferredVariantId)
  }

  if (!matchingVariant && categoryHint && product.variants) {
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
  
  const tag = product.tags?.find((t) => t.value.toLowerCase().includes("audio")) ? "audio" : 
              product.tags?.find((t) => t.value.toLowerCase().includes("video")) ? "video" : 
              undefined

  const tagLabel = tag === "audio" ? "AUDIO SESSION" : tag === "video" ? "VIDEO SESSION" : undefined

  const displayLabel = tagLabel

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    if (h > 0) {
      return `${h} ${h > 1 ? "HOURS" : "HOUR"}${m > 0 ? ` ${m} MINS` : ""}`
    }
    return `${m} MINS`
  }

  const lengthValue = matchingVariant?.length || product.length || product.variants?.[0]?.length
  const displayDurationLength = lengthValue ? formatDuration(lengthValue) : undefined

  const displayDuration = displayDurationLength

  const isSession = product.type?.value === "session" || product.tags?.some((t) => t.value === "session") || product.metadata?.is_service === true || product.metadata?.is_service === "true"

  const handleBooking = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!preferredVariantId && !product.variants?.[0]?.id) return
    
    setIsAdding(true)
    try {
      if (isSession) {
        router.push(`/${countryCode}/book-now?service_id=${product.id}`)
      } else {
        await addToCart({
          variantId: preferredVariantId || product.variants?.[0]?.id || "",
          quantity: 1,
          countryCode,
        })
        showNotification(`${product.title} added to cart`)
        window.dispatchEvent(new Event("cart:item-added"))
        setItemAdded(true)
        setTimeout(() => setItemAdded(false), 2000)
      }
    } catch (err) {
      console.error("Error added to cart:", err)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="group relative bg-white rounded-[24px] md:rounded-[32px] overflow-hidden shadow-[0_4px_25px_rgba(44,30,54,0.04)] hover:shadow-[0_20px_60px_rgba(44,30,54,0.12)] transition-all duration-700 border border-[#2C1E36]/[0.05] flex flex-col h-full hover:-translate-y-2">
      <LocalizedClientLink href={isSession ? `/book-now?service_id=${product.id}` : `/products/${product.handle}`} className="flex-grow">
        <div data-testid="product-wrapper" className="relative">
          <div className="relative p-2 md:p-3">
          {/* Item added confirmation overlay */}
          {/* Discount Badge */}
          {Number(displayPrice?.percentage_diff) > 0 && (
            <div className="absolute top-6 left-6 z-10 bg-emerald-500 text-white text-[10px] md:text-[12px] font-black px-2.5 py-1 md:px-3 md:py-1.5 rounded-full shadow-lg">
              -{displayPrice?.percentage_diff}%
            </div>
          )}

          {/* Session Type Badge */}
          {!!displayLabel && (
            <div className="absolute top-6 right-6 z-10">
              <Badge className="text-[8px] md:text-[10px] font-bold uppercase tracking-wider !rounded-full !bg-white/95 !text-[#2C1E36] border border-[#2C1E36]/10 shadow-sm backdrop-blur-sm px-2 md:px-4 py-1 md:py-1.5 flex items-center gap-1 md:gap-1.5">
                <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-[#C5A059]"></span>
                {String(displayLabel)}
              </Badge>
            </div>
          )}

          {itemAdded && (
            <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
              <div className="bg-[#1a1a1a]/90 text-white text-[11px] md:text-[12px] font-bold tracking-widest uppercase px-5 py-2.5 rounded-full shadow-xl animate-in fade-in zoom-in-95 duration-200">
                Item added
              </div>
            </div>
          )}
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
            className="!rounded-[18px] md:!rounded-[24px] overflow-hidden aspect-square grayscale-[0.1] group-hover:grayscale-0 transition-all duration-700 scale-[0.99] group-hover:scale-100"
          />

          {/* Wishlist Button Overlay */}
          <button
            onClick={(e) => {
               e.preventDefault()
               toggleWishlist(product.id)
            }}
            className="absolute bottom-2 right-2 md:bottom-4 md:right-4 z-20 w-8 h-8 md:w-11 md:h-11 bg-white/95 backdrop-blur rounded-full flex items-center justify-center shadow-xl border border-[#2C1E36]/5 text-[#2C1E36] hover:scale-110 active:scale-90 transition-all pointer-events-auto"
          >
             <svg 
               xmlns="http://www.w3.org/2000/svg" 
               width="16" 
               height="16" 
               viewBox="0 0 24 24" 
               fill={isWishlisted(product.id) ? "currentColor" : "none"} 
               stroke="currentColor" 
               strokeWidth="1.5" 
               strokeLinecap="round" 
               strokeLinejoin="round"
               className={isWishlisted(product.id) ? "text-[#C5A059]" : "text-[#2C1E36]"}
             >
               <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
             </svg>
          </button>
          </div>
          
          <div className="p-3 md:p-6 flex flex-col items-center text-center">
            <Text className="font-serif text-[#2C1E36] text-[13px] md:text-[22px] mb-1 md:mb-4 group-hover:text-[#C5A059] transition-colors line-clamp-2 leading-[1.2] px-1 md:px-2 font-medium" data-testid="product-title">
              {product.title}
            </Text>
            
            <div className="flex flex-col items-center gap-y-1 md:gap-y-4 mb-2">
              {displayPrice && (
                <div className="flex items-center justify-center w-full px-2">
                   <PreviewPrice price={displayPrice} />
                </div>
              )}
              
              {/* Session Duration (Metadata) */}
              {!!displayDuration && (
                <div className="flex items-center gap-x-1 md:gap-x-2 text-[#665D6B] text-[8px] md:text-[11px] font-bold tracking-[0.05em] uppercase bg-[#F5F4F0] px-2 md:px-4 py-1 md:py-1.5 rounded-full border border-[#2C1E36]/5">
                  <Clock className="text-[#C5A059] w-2.5 md:w-3.5 h-2.5 md:h-3.5" />
                   <span>{String(displayDuration)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </LocalizedClientLink>
      <div className="px-3 md:px-6 pb-4 md:pb-8 mt-auto">
        <button 
          onClick={handleBooking}
          disabled={isAdding}
          className="w-full py-2.5 md:py-4 bg-[#2C1E36] text-white rounded-[12px] md:rounded-[20px] font-bold hover:bg-[#3D2B4A] shadow-xl shadow-purple-900/10 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none transition-all duration-300 uppercase tracking-[0.05em] md:tracking-[0.2em] text-[8px] md:text-[11px] flex items-center justify-center gap-x-1 md:gap-x-3 active:scale-95"
        >
          {isAdding ? (
            <>
              <svg className="animate-spin h-4 w-4 text-[#C5A059]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span>ADDING...</span>
            </>
          ) : (
            <>
               <span className="font-sans">{isSession ? "SELECT SESSION" : "Add to Cart"}</span>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#C5A059]"><path d="m9 18 6-6-6-6"/></svg>
            </>
          )}
        </button>
      </div>
    </div>
  )
}


