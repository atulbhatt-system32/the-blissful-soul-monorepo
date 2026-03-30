import { listProducts } from "@lib/data/products"
import { listCategories } from "@lib/data/categories"
import { HttpTypes } from "@medusajs/types"
import BookSessionClient from "@modules/home/components/book-session/client"

type BookSessionProps = {
  title?: string | null
  tarotServices?: any[] | null
  audioSessions?: any[] | null
  videoSessions?: any[] | null
  region: HttpTypes.StoreRegion
}

export default async function BookSession({
  title,
  region,
}: BookSessionProps) {
  
  // 1. Fetch Categories by handle to get their IDs
  let audioCategoryId, videoCategoryId, tarotCategoryId;
  
  try {
    const product_categories = await listCategories({ fields: "id,handle" })
    audioCategoryId = product_categories.find((c: any) => c.handle === "audio-sessions")?.id
    videoCategoryId = product_categories.find((c: any) => c.handle === "video-sessions")?.id
    tarotCategoryId = product_categories.find((c: any) => c.handle === "top-services")?.id
  } catch (error) {
    console.error("Error fetching categories:", error)
  }

  // 2. Fetch products for each category
  const [audioResult, videoResult, tarotResult] = await Promise.all([
    audioCategoryId ? listProducts({ regionId: region.id, queryParams: { category_id: [audioCategoryId], fields: "*variants.calculated_price,+tags,+metadata" } }) : { response: { products: [] } },
    videoCategoryId ? listProducts({ regionId: region.id, queryParams: { category_id: [videoCategoryId], fields: "*variants.calculated_price,+tags,+metadata" } }) : { response: { products: [] } },
    tarotCategoryId ? listProducts({ regionId: region.id, queryParams: { category_id: [tarotCategoryId], fields: "*variants.calculated_price,+tags,+metadata" } }) : { response: { products: [] } }
  ])

  const audioProducts = audioResult.response?.products || []
  const videoProducts = videoResult.response?.products || []
  const topProducts = tarotResult.response?.products || []

  if (audioProducts.length === 0 && videoProducts.length === 0 && topProducts.length === 0) {
    return null
  }

  return (
    <BookSessionClient
      title={title || "Book Your Session"}
      topProducts={topProducts}
      audioProducts={audioProducts}
      videoProducts={videoProducts}
      region={region}
    />
  )
}
