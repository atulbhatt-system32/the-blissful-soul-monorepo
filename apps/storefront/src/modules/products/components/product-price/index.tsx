import { clx } from "@medusajs/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  const isSale = selectedPrice.price_type === "sale"

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-3">
          <span
            className={clx("text-3xl md:text-4xl font-serif", {
              "text-[#C5A059]": isSale,
              "text-[#2C1E36]": !isSale,
            })}
            data-testid="product-price"
            data-value={selectedPrice.calculated_price_number}
          >
            {!variant && "From "}
            {selectedPrice.calculated_price}
          </span>
          {isSale && (
            <span
              className="text-lg text-gray-400 line-through font-sans"
              data-testid="original-product-price"
              data-value={selectedPrice.original_price_number}
            >
              {selectedPrice.original_price}
            </span>
          )}
          {isSale && (
            <span className="text-xs font-bold bg-[#2C1E36] text-[#C5A059] px-3 py-1 rounded-full border border-[#C5A059]/20 shadow-sm uppercase tracking-wider">
              {selectedPrice.percentage_diff}% OFF
            </span>
          )}
      </div>
    </div>
  )
}
