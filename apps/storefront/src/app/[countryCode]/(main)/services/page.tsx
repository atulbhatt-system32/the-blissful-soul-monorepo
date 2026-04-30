import { Metadata } from "next"
import ServicesTemplate from "@modules/services/templates"
import { getServicesPageData } from "@lib/data/strapi"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

export const metadata: Metadata = {
  title: "Sacred Services",
  description: "Explore our curated collection of ethically sourced, high-vibrational healing crystals and spiritual tools.",
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

export default async function ServicesPage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page, limit, view, q } = searchParams
  const servicesData = await getServicesPageData()

  return (
    <ServicesTemplate
      sortBy={sortBy}
      page={page}
      limit={limit}
      view={view}
      q={q}
      countryCode={params.countryCode}
      heroTitle={servicesData?.hero_title}
      heroSubtitle={servicesData?.hero_subtitle}
      announcements={servicesData?.announcements}
      heroImage={servicesData?.hero_image}
      mobileHeroImage={servicesData?.mobile_hero_image}
      titleColor={servicesData?.title_color}
      subtitleColor={servicesData?.subtitle_color}
      showHero={servicesData?.show_hero}
      showAnnouncements={servicesData?.show_announcements}
    />
  )
}
