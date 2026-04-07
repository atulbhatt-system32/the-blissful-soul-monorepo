import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import BentoHero from "@modules/home/components/bento-hero"
import { getHomepageData } from "@lib/data/strapi"
import HeroSlideshow from "@modules/home/components/hero-slideshow"
import BookSession from "@modules/home/components/book-session"
import Testimonials from "@modules/home/components/testimonials"
import WelcomePopup from "@modules/home/components/welcome-popup"
import HotSellers from "@modules/home/components/hot-sellers"
import HealingCrystals from "@modules/home/components/healing-crystals"
import StatsBar from "@modules/layout/components/stats-bar"

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 15 and Medusa.",
}



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
      <BentoHero />

      {/* Curated Intro Section */}
      <section className="pb-24 md:pb-32 pt-20 bg-[#1A0E22]">
        <div className="content-container text-center flex flex-col items-center gap-y-7">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold text-[#C5A059] font-sans">
             CURATED FOR YOU
          </span>
          <div className="flex flex-col gap-y-5 max-w-3xl">
            <h2 className="font-serif text-3xl md:text-[44px] text-white leading-tight font-semibold">
              Crystals and sessions chosen for depth, clarity, and everyday ritual.
            </h2>
            <p className="text-white/40 text-[14px] md:text-[15px] max-w-lg mx-auto leading-relaxed font-sans font-medium">
              Every piece is selected to support your journey — from wearable energy to one-on-one guidance with Master Pragya Vijh.
            </p>
          </div>
          <LocalizedClientLink 
            href="/store"
            className="bg-[#C5A059] text-[#120B15] px-10 py-3.5 rounded-full text-[14px] font-bold font-sans hover:opacity-90 transition-all shadow-xl active:scale-95 mt-4"
          >
            Browse the shop
          </LocalizedClientLink>
        </div>
      </section>

      {/* Hot Seller Section */}
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

      <Testimonials 
        title={homepageData?.testimonials_title} 
        testimonials={homepageData?.testimonials} 
      />

      {/* Stats Bar (Counter) - Home Page Only */}
      <StatsBar />
    </div>
  )
}
