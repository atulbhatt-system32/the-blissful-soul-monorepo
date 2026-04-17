import { listProducts } from "@lib/data/products"
import { listCategories } from "@lib/data/categories"
import { HttpTypes } from "@medusajs/types"
import BookSessionClient from "@modules/home/components/book-session/client"

type BookSessionProps = {
  title?: string | null
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
    return (
      <section className="py-24 bg-[#1A0E22]">
        <div className="content-container text-center">
           <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold text-[#C5A059] mb-4 block underline underline-offset-8 decoration-white/10">SESSIONS</span>
           <div className="max-w-3xl mx-auto py-16 px-8 border border-dashed border-white/10 rounded-[40px] bg-white/5 backdrop-blur-sm">
              <p className="text-white/40 font-serif italic text-xl">Sessions are coming soon. Check back shortly to book your session.</p>
           </div>
        </div>
      </section>
    )
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
