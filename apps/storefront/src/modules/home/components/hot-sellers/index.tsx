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

  // 2. If nothing from CMS, show empty state
  if (pricedProducts.length === 0) {
     return (
      <div className="text-center py-20 bg-gray-50/50 rounded-[40px] border border-dashed border-gray-200">
        <p className="text-[#2C1E36]/40 font-serif italic text-lg">Your chosen favourites are currently being curated.</p>
        <p className="text-[10px] uppercase tracking-widest font-black text-[#C5A059] mt-2">Check back soon for divine selections</p>
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
