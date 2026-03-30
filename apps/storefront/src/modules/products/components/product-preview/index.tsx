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
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-pink-50 flex flex-col h-full">
      <LocalizedClientLink href={`/products/${product.handle}`} className="flex-grow">
        <div data-testid="product-wrapper" className="relative">
          {/* Discount Badge */}
          {!!displayPrice?.percentage_diff && (
            <div className="absolute top-3 left-3 z-10 bg-pink-400 text-white text-[10px] font-bold px-2 py-1 rounded-md">
              -{displayPrice.percentage_diff}%
            </div>
          )}

          {/* Session Type Badge (Metadata) */}
          {!!displayLabel && (
            <div className="absolute top-3 right-3 z-10">
              <Badge color="red" className="text-[10px] font-bold uppercase tracking-wider !rounded-md !bg-pink-100 !text-pink-600 border-none shadow-sm">
                {(displayLabel as string)}
              </Badge>
            </div>
          )}
          
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
            className="!rounded-none !shadow-none !bg-transparent !p-0 aspect-[4/5]"
          />
          
          <div className="p-4 flex flex-col items-center text-center">
            <Text className="font-serif text-pink-950 text-base mb-2 group-hover:text-pink-600 transition-colors line-clamp-2" data-testid="product-title">
              {product.title}
            </Text>
            
            <div className="flex flex-col items-center gap-y-2 mb-4">
              {displayPrice && <PreviewPrice price={displayPrice} />}
              
              {/* Session Duration (Metadata) */}
              {!!displayDuration && (
                <div className="flex items-center gap-x-1.5 text-gray-500 text-[11px] font-medium bg-gray-50 px-2 py-1 rounded-lg">
                  <Clock className="text-pink-400 w-3 h-3" />
                  <span>{(displayDuration as string)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </LocalizedClientLink>

      <div className="px-4 pb-6 mt-auto">
        <button 
          onClick={handleBooking}
          disabled={isAdding}
          className="w-full py-3 bg-pink-300 text-white rounded-xl font-bold hover:bg-pink-400 disabled:bg-gray-200 transition-colors uppercase tracking-widest text-[10px]"
        >
          {isAdding ? "PROCESSING..." : isSession ? "BOOK SESSION" : "ADD TO CART"}
        </button>
      </div>
    </div>
  )
}


