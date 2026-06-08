import { Metadata } from "next"
import ServicesTemplate from "@modules/services/templates"
import { getServicesPageData } from "@lib/data/strapi"

export const metadata: Metadata = {
  title: "Sacred Services",
  description: "Explore our curated collection of ethically sourced, high-vibrational healing crystals and spiritual tools.",
}

type Params = {
  params: Promise<{
    countryCode: string
  }>
}

export default async function ServicesPage(props: Params) {
  const params = await props.params;
  const servicesData = await getServicesPageData()

  return (
    <ServicesTemplate
      countryCode={params.countryCode}
      heroTitle={servicesData?.hero_title}
      heroSubtitle={servicesData?.hero_subtitle}
      heroImage={servicesData?.hero_image}
      mobileHeroImage={servicesData?.mobile_hero_image}
      titleColor={servicesData?.title_color}
      subtitleColor={servicesData?.subtitle_color}
      showHero={servicesData?.show_hero}
    />
  )
}
