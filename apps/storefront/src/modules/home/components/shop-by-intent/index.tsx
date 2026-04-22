import { listProducts } from "@lib/data/products"
import { listCategories } from "@lib/data/categories"
import { HttpTypes } from "@medusajs/types"
import ShopByIntentClient from "./shop-by-intent-client"

const intentsList = [
  { title: "Love", handle: "intent-love", fallbackCategory: "love" },
  { title: "Money", handle: "intent-money", fallbackCategory: "money" },
  { title: "NAZAR", handle: "intent-protection", fallbackCategory: "protection" },
  { title: "Health", handle: "intent-health", fallbackCategory: "health" },
]

export default async function ShopByIntent({ region }: { region: HttpTypes.StoreRegion }) {
  // 1. Fetch all categories
  const categories = await listCategories({ limit: 100 })
  
  // 2. Map intents to products
  const intentsData = await Promise.all(
    intentsList.map(async (intent) => {
      const category = categories.find(
        (c) => 
          (c.handle && c.handle === intent.handle) || 
          (c.handle && c.handle === intent.fallbackCategory) || 
          (c.title && c.title.toLowerCase() === intent.title.toLowerCase())
      )
      
      let products: HttpTypes.StoreProduct[] = []
      
      if (category) {
        const { response } = await listProducts({
          regionId: region.id,
          queryParams: {
            category_id: [category.id],
            limit: 3,
            fields: "*variants.calculated_price",
          },
        })
        products = response.products
      }

      if (products.length === 0) {
          const { response } = await listProducts({
              regionId: region.id,
              queryParams: {
                  q: intent.title,
                  limit: 3,
                  fields: "*variants.calculated_price",
              }
          })
          products = response.products
      }

      return {
        ...intent,
        products,
      }
    })
  )

  return (
    <ShopByIntentClient 
      intents={intentsData} 
      region={region} 
    />
  )
}
