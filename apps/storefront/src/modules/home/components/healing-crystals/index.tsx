import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import { getCollectionByHandle } from "@lib/data/collections"

export default async function HealingCrystals({
  products: strapiProducts,
  region,
  collectionHandle = "healing-crystals",
}: {
  products?: any[] | null
  region: HttpTypes.StoreRegion
  collectionHandle?: string
}) {
  let pricedProducts: HttpTypes.StoreProduct[] = []

  // 1. Try fetching from Strapi first if provided
  if (strapiProducts && strapiProducts.length > 0) {
    const medusaIds = strapiProducts.map((p) => p.medusa_id).filter(Boolean)
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

  // 2. If no Strapi products, try fetching from Medusa Collection by handle
  if (pricedProducts.length === 0 && collectionHandle) {
    const collection = await getCollectionByHandle(collectionHandle)
    
    if (collection) {
      const { 
        response: { products: collectionProducts } 
      } = await listProducts({
        regionId: region.id,
        queryParams: {
          collection_id: [collection.id],
          limit: 4,
          fields: "*variants.calculated_price",
        }
      })
      pricedProducts = collectionProducts || []
    }
  }

  // 3. Fallback: Empty state
  if (pricedProducts.length === 0) {
     return (
      <div className="text-center py-20 bg-gray-50/50 rounded-[40px] border border-dashed border-gray-200">
        <p className="text-[#2C1E36]/40 font-serif italic text-lg">Our physical treasures are currently being sanctified.</p>
        <p className="text-[10px] uppercase tracking-widest font-black text-[#C5A059] mt-2">New arrivals coming soon to the shop</p>
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
