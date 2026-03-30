import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 15 and Medusa.",
}

import BrandHero from "@modules/home/components/brand-hero"
import { getHomepageData } from "@lib/data/strapi"
import HeroSlideshow from "@modules/home/components/hero-slideshow"
import BookSession from "@modules/home/components/book-session"
import Testimonials from "@modules/home/components/testimonials"
import StatsBar from "@modules/home/components/stats-bar"
import WelcomePopup from "@modules/home/components/welcome-popup"
import HotSellers from "@modules/home/components/hot-sellers"
import HealingCrystals from "@modules/home/components/healing-crystals"

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  const homepageData = await getHomepageData()
  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  const heroSlides = homepageData?.hero_slideshow || []
  
  return (
    <div className="bg-[#FAF9F6]">
      {/* Welcome Popup (conditionally renders based on CMS data) */}
      <WelcomePopup data={homepageData?.pop_up} />

      {/* Hero Section */}
      {heroSlides.length > 0 ? (
        <HeroSlideshow slides={heroSlides} />
      ) : (
        <BrandHero />
      )}

      {/* Stats Bar */}
      <StatsBar stats={homepageData?.stats} />

      {/* Hot Seller Section */}
      <section className="py-16 md:py-24">
        <div className="content-container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif text-pink-900 mb-4 uppercase tracking-tight">
              {homepageData?.hot_seller_title || "Hot Seller"}
            </h2>
            <div className="h-1 w-20 bg-pink-500 mx-auto rounded-full" />
          </div>
          
          <HotSellers hotSellers={homepageData?.hot_sellers} region={region} />
          
          <div className="mt-12 text-center">
            <LocalizedClientLink href="/store" className="inline-block px-8 py-3 border border-pink-500 text-pink-900 rounded-full font-serif font-bold hover:bg-pink-500 hover:text-white transition-all uppercase tracking-widest text-xs">
              SEE ALL
            </LocalizedClientLink>
          </div>
        </div>
      </section>

      {/* Book Your Session Section */}
      <BookSession 
        title={homepageData?.book_session_title}
        tarotServices={homepageData?.tarot_services}
        audioSessions={homepageData?.audio_sessions}
        videoSessions={homepageData?.video_sessions}
        region={region}
      />

      {/* Shop Healing Crystals Section */}
      <section className="py-16 md:py-24">
        <div className="content-container">
           <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif text-pink-900 mb-4 uppercase tracking-tight">
              {homepageData?.healing_crystals_title || "Shop Healing Crystals"}
            </h2>
            <div className="h-1 w-20 bg-pink-500 mx-auto rounded-full" />
          </div>
          
          <HealingCrystals products={homepageData?.healing_crystals} region={region} />
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials 
        title={homepageData?.testimonials_title} 
        testimonials={homepageData?.testimonials} 
      />
    </div>
  )
}
