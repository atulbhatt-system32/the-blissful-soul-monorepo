import { listProducts } from "@lib/data/products"
import { getCollectionByHandle } from "@lib/data/collections"
import { HttpTypes } from "@medusajs/types"
import BestsellerCarousel from "@modules/home/components/bestseller-carousel"

type CombosSectionProps = {
  region: HttpTypes.StoreRegion
}

export default async function CombosSection({ region }: CombosSectionProps) {
  const collection = await getCollectionByHandle("combos")
  
  if (!collection) {
    return null
  }

  const { response: { products } } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: [collection.id],
      limit: 10,
      fields: "*variants.calculated_price",
    },
  })

  if (products.length === 0) {
    return null
  }

  return (
    <BestsellerCarousel
      title="Value Combos"
      label="CURATED BUNDLES"
      products={products}
      region={region}
      bgColor="bg-white"
    />
  )
}
