import { Metadata } from "next"
import { getBookSessionPageData } from "@lib/data/strapi"
import BookSessionClient from "@modules/home/components/book-session-page"
import { getRegion } from "@lib/data/regions"
import { listProducts } from "@lib/data/products"
import { listCategories } from "@lib/data/categories"

export const metadata: Metadata = {
  title: "Book Your Session | The Blissful Soul",
  description: "Book your astrology, tarot reading, or healing session with Master Pragya Vijh.",
}

export default async function ServicesPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  
  const pageData = await getBookSessionPageData()
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const heroTitle = pageData?.hero_title || "Our Services"
  const sectionTitle = pageData?.section_title || "Select From the Below Categories"

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

  // 2. Fetch products for each category in parallel
  const [audioResult, videoResult, tarotResult] = await Promise.all([
    audioCategoryId ? listProducts({ regionId: region.id, queryParams: { category_id: [audioCategoryId], fields: "*variants.calculated_price,+tags,+metadata" } }) : { response: { products: [] } },
    videoCategoryId ? listProducts({ regionId: region.id, queryParams: { category_id: [videoCategoryId], fields: "*variants.calculated_price,+tags,+metadata" } }) : { response: { products: [] } },
    tarotCategoryId ? listProducts({ regionId: region.id, queryParams: { category_id: [tarotCategoryId], fields: "*variants.calculated_price,+tags,+metadata" } }) : { response: { products: [] } }
  ])

  const audioProducts = audioResult.response?.products || []
  const videoProducts = videoResult.response?.products || []
  const topProducts = tarotResult.response?.products || []

  return (
    <BookSessionClient
      heroTitle={heroTitle}
      sectionTitle={sectionTitle}
      topProducts={topProducts}
      audioProducts={audioProducts}
      videoProducts={videoProducts}
      region={region}
    />
  )
}
