import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { getCollectionByHandle } from "@lib/data/collections"
import BestsellerCarousel from "@modules/home/components/bestseller-carousel"

export default async function BestsellerSection({
  hotSellers: strapiHotSellers,
  title,
  region,
  collectionHandle = "hot-sellers",
}: {
  hotSellers?: any[] | null
  title?: string | null
  region: HttpTypes.StoreRegion
  collectionHandle?: string
}) {
  let pricedProducts: HttpTypes.StoreProduct[] = []

  // 1. Try fetching from Strapi first if provided
  if (strapiHotSellers && strapiHotSellers.length > 0) {
    const medusaIds = strapiHotSellers.map((ps) => ps.medusa_id).filter(Boolean)
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
    const collection = await getCollectionByHandle(collectionHandle, { cache: "no-store" })
    
    if (collection) {
      const { 
        response: { products: collectionProducts } 
      } = await listProducts({
        regionId: region.id,
        queryParams: {
          collection_id: [collection.id],
          limit: 8,
          fields: "*variants.calculated_price",
        }
      })
      pricedProducts = collectionProducts || []
    }
  }

  return (
    <BestsellerCarousel
      title={title || "Bestsellers"}
      label="FAVOURITES"
      products={pricedProducts}
      region={region}
    />
  )
}
