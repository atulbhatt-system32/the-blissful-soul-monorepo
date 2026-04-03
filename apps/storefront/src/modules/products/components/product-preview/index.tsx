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
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(255,192,203,0.1)] hover:shadow-[0_8px_30px_rgba(255,192,203,0.2)] transition-all duration-500 border border-pink-100 flex flex-col h-full hover:-translate-y-1">
      <LocalizedClientLink href={`/products/${product.handle}`} className="flex-grow">
        <div data-testid="product-wrapper" className="relative">
          {/* Discount Badge */}
          {Number(displayPrice?.percentage_diff) > 0 && (
            <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
              -{displayPrice?.percentage_diff}%
            </div>
          )}

          {/* Session Type Badge (Metadata) */}
          {!!displayLabel && (
            <div className="absolute top-4 right-4 z-10">
              <Badge color="red" className="text-[10px] font-bold uppercase tracking-wider !rounded-full !bg-white/90 !text-pink-600 border border-pink-100 shadow-sm backdrop-blur-sm px-3 py-1">
                {(displayLabel as string)}
              </Badge>
            </div>
          )}
          
          <div className="p-2">
             <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              size="full"
              isFeatured={isFeatured}
              className="!rounded-xl overflow-hidden aspect-square grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
            />
          </div>
          
          <div className="p-5 flex flex-col items-center text-center">
            <Text className="font-serif text-pink-950 text-lg mb-2 group-hover:text-pink-600 transition-colors line-clamp-2 leading-tight" data-testid="product-title">
              {product.title}
            </Text>
            
            <div className="flex flex-col items-center gap-y-3 mb-2">
              {displayPrice && (
                <div className="flex items-center gap-x-2">
                   <PreviewPrice price={displayPrice} />
                </div>
              )}
              
              {/* Session Duration (Metadata) */}
              {!!displayDuration && (
                <div className="flex items-center gap-x-1.5 text-gray-400 text-[11px] font-semibold tracking-wide uppercase bg-pink-50/50 px-3 py-1 rounded-full border border-pink-100/50">
                  <Clock className="text-pink-400 w-3.5 h-3.5" />
                  <span>{(displayDuration as string)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </LocalizedClientLink>

      <div className="px-5 pb-6 mt-auto">
        <button 
          onClick={handleBooking}
          disabled={isAdding}
          className="w-full py-4 bg-[#e47ca1] text-white rounded-xl font-bold hover:bg-pink-500 shadow-[0_4px_15px_rgba(228,124,161,0.3)] hover:shadow-[0_6px_20px_rgba(228,124,161,0.4)] disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none transition-all duration-300 uppercase tracking-widest text-[11px] flex items-center justify-center gap-x-2"
        >
          {isAdding ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span>PROCESSING</span>
            </>
          ) : (
            <>
               <span>{isSession ? "BOOK YOUR SESSION" : "ADD TO CART"}</span>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </>
          )}
        </button>
      </div>
    </div>
  )
}


