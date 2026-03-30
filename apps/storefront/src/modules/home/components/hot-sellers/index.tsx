import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"

export default async function HotSellers({
  hotSellers,
  region,
}: {
  hotSellers: any[]
  region: HttpTypes.StoreRegion
}) {
  let pricedProducts: HttpTypes.StoreProduct[] = []

  if (hotSellers && hotSellers.length > 0) {
    // 1. Fetch products selected in CMS
    const medusaIds = hotSellers.map((ps) => ps.medusa_id).filter(Boolean)
    if (medusaIds.length > 0) {
      const {
        response: { products: fetched },
      } = await listProducts({
        regionId: region.id,
        queryParams: {
          id: medusaIds,
          fields: "*variants.calculated_price",
        },
      })
      pricedProducts = fetched || []
    }
  }

  // 2. If nothing from CMS, use fallback but EXCLUDE sessions
  if (pricedProducts.length === 0) {
    const {
      response: { products: defaultProducts },
    } = await listProducts({
      regionId: region.id,
      queryParams: {
        fields: "*variants.calculated_price",
      },
    })

    const excludeHandles = ["sessions", "audio-sessions", "video-sessions", "top-services"]
    pricedProducts = (defaultProducts || []).filter((p) => 
      !p.tags?.some((t: any) => t.value === "session") &&
      !p.categories?.some((c: any) => excludeHandles.includes(c.handle))
    ).slice(4, 8) // Use a different slice for variety
  }

  if (pricedProducts.length === 0) {
     return (
      <div className="text-center py-12">
        <p className="text-pink-800/60 font-serif italic">No hot sellers available.</p>
      </div>
    )
  }

  return (
    <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
      {pricedProducts.map((product) => (
        <li key={product.id}>
          <ProductPreview product={product} region={region} isFeatured />
        </li>
      ))}
    </ul>
  )
}
