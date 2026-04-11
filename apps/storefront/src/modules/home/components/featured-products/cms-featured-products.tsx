import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import { getCollectionByHandle } from "@lib/data/collections"

export default async function CMSFeaturedProducts({
  products: strapiProducts,
  region,
  collectionHandle = "featured-products",
}: {
  products?: any[] | null
  region: HttpTypes.StoreRegion
  collectionHandle?: string
}) {
  let pricedProducts: HttpTypes.StoreProduct[] = []

  // 1. Try fetching from Strapi first
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

  // 2. Fallback to Medusa Collection by handle
  if (pricedProducts.length === 0 && collectionHandle) {
    const collection = await getCollectionByHandle(collectionHandle, { cache: "no-store" })
    
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

  if (pricedProducts.length === 0) {
     return null
  }

  return (
    <ul className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
      {pricedProducts.map((product) => (
        <li key={product.id}>
          <ProductPreview product={product} region={region} isFeatured />
        </li>
      ))}
    </ul>
  )
}
