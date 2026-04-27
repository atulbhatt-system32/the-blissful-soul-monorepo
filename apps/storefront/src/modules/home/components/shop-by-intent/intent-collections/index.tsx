import { listProducts } from "@lib/data/products"
import { getCategoryByHandle } from "@lib/data/categories"
import { HttpTypes } from "@medusajs/types"
import IntentCollectionsClient from "./client"

export default async function IntentCollections({ 
  region, 
  title = "Blissful Soul Studio by Master Pragya Vijh" 
}: { 
  region: HttpTypes.StoreRegion
  title?: string
}) {
  // 1. Fetch the "Intentions" category with its subcategories (children)
  const intentionsRoot = await getCategoryByHandle(["intentions"])
  
  if (!intentionsRoot) {
    return null
  }

  const children = (intentionsRoot.category_children || []).sort((a, b) => (a.rank || 0) - (b.rank || 0))
  
  // 2. Map each subcategory to its products
  const intentsData = await Promise.all(
    children.map(async (category) => {
      let products: HttpTypes.StoreProduct[] = []
      
      const { response } = await listProducts({
        regionId: region.id,
        queryParams: {
          category_id: [category.id],
          limit: 12,
          fields: "*variants.calculated_price,+metadata",
        },
      })
      products = response.products.sort((a, b) => {
        const categoryHandle = category.handle
        const rankA = a.metadata?.[`rank_${categoryHandle}`]
        const rankB = b.metadata?.[`rank_${categoryHandle}`]
        
        if (rankA !== undefined && rankB !== undefined) return Number(rankA) - Number(rankB)
        if (rankA !== undefined) return -1
        if (rankB !== undefined) return 1
        return 0
      })

      return {
        key: category.id,
        title: category.name,
        handle: category.handle,
        products,
      }
    })
  )

  return (
    <section id="shop-healing-crystals" className="pt-12 pb-16 md:pt-16 md:pb-20 bg-[#FAF9F6]">
      <IntentCollectionsClient title={title} intents={intentsData} region={region} />
    </section>
  )
}
