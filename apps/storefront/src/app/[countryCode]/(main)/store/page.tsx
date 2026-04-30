import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import { getStorePageData } from "@lib/data/strapi"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    limit?: string
    view?: string
    q?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page, limit, view, q } = searchParams
  const storeData = await getStorePageData()

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      limit={limit}
      view={view}
      q={q}
      countryCode={params.countryCode}
      heroTitle={storeData?.hero_title}
      heroSubtitle={storeData?.hero_subtitle}
      announcements={storeData?.announcements}
      heroImage={storeData?.hero_image}
      mobileHeroImage={storeData?.mobile_hero_image}
      titleColor={storeData?.title_color}
      subtitleColor={storeData?.subtitle_color}
      showHero={storeData?.show_hero ?? true}
      showAnnouncements={storeData?.show_announcements ?? true}
    />
  )
}
