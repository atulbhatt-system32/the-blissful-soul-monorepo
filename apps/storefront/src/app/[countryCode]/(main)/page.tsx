import { Metadata } from "next"

import CMSFeaturedProducts from "@modules/home/components/featured-products/cms-featured-products"
import { listCollections, getCollectionByHandle } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getHomepageData } from "@lib/data/strapi"
import { HttpTypes } from "@medusajs/types"
import HeroSlideshow from "@modules/home/components/hero-slideshow"
import Testimonials from "@modules/home/components/testimonials"
import WelcomePopup from "@modules/home/components/welcome-popup"
import StatsBar from "@modules/layout/components/stats-bar"
import BestsellerCarousel from "@modules/home/components/bestseller-carousel"
import IntentCollections from "@modules/home/components/shop-by-intent/intent-collections"
import ScrollingMarquee from "@modules/home/components/scrolling-marquee"
import TrustCarousel from "@modules/home/components/trust-carousel"
import ShopByIntent from "@modules/home/components/shop-by-intent"
import ServicesGrid from "@modules/home/components/services-grid"
import InstagramBanner from "@modules/home/components/instagram-banner"
import FAQSection from "@modules/home/components/faq-section"
import CombosSection from "@modules/home/components/combos-section"

export const metadata: Metadata = {
  title: "The Blissful Soul",
  description:
    "A sanctuary for crystals, healing, and spiritual guidance by Master Pragya Vijh.",
}

async function fetchBestsellerProducts(
  region: HttpTypes.StoreRegion,
  strapiHotSellers?: any[] | null
): Promise<HttpTypes.StoreProduct[]> {
  let products: HttpTypes.StoreProduct[] = []

  if (strapiHotSellers && strapiHotSellers.length > 0) {
    const medusaIds = strapiHotSellers.map((ps) => ps.medusa_id).filter(Boolean)
    if (medusaIds.length > 0) {
      const { response: { products: fetched } } = await listProducts({
        regionId: region.id,
        queryParams: { id: medusaIds, fields: "*variants.calculated_price" },
      })
      products = fetched || []
    }
  }

  if (products.length === 0) {
    const collection = await getCollectionByHandle("hot-sellers", { cache: "no-store" })
    if (collection) {
      const { response: { products: collectionProducts } } = await listProducts({
        regionId: region.id,
        queryParams: {
          collection_id: [collection.id],
          limit: 8,
          fields: "*variants.calculated_price",
        },
      })
      products = collectionProducts || []
    }
  }

  return products
}

export default async function HomeNew(props: {
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
  const bestsellerProducts = await fetchBestsellerProducts(region, homepageData?.hot_sellers)
  
  return (
    <div className="bg-[#FAF9F6]">
      {/* Welcome Popup (conditionally renders based on CMS data) */}
      <WelcomePopup data={homepageData?.pop_up} />

      {/* ① BANNER - Hero Slideshow */}
      <HeroSlideshow slides={heroSlides} />

      {/* Moving Banner (Text Strip) */}
      <ScrollingMarquee items={homepageData?.marquee_items} />

      {/* Trust Carousel (Intuitive, Clarify, etc.) */}
      {homepageData?.show_trust_carousel !== false && (
        <TrustCarousel items={homepageData?.trust_cards} />
      )}

      {/* ④ SHOP BY PURPOSE - What are you looking for? (Love, Money, Health, Protection) */}
      <ShopByIntent region={region} />


      {/* Services Section */}
      {homepageData?.show_services !== false && <ServicesGrid />}

      {/* Count Animation Banner */}
      <div className="bg-[#FAF9F6]">
        <StatsBar stats={homepageData?.stats} />
      </div>

      {/* ② NEW ARRIVALS (Featured Products) */}
      {homepageData?.show_featured_products !== false && (
        <section className="py-16 md:py-20 bg-white">
          <div className="content-container">
            <div className="text-center mb-10 underline underline-offset-8 decoration-[#C5A059]/30">
              <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold text-[#C5A059] font-sans mb-4 block">
                {homepageData?.featured_products_label || "NEW SELECTION"}
              </span>
              <h2 className="text-4xl md:text-5xl font-serif text-[#2C1E36] mb-6 uppercase tracking-tight leading-tight">
                {homepageData?.featured_products_title || "New Arrivals"}
              </h2>
            </div>
            
            <CMSFeaturedProducts products={homepageData?.featured_products} region={region} />
          </div>
        </section>
      )}

      {/* ③ BESTSELLER PRODUCTS - Horizontal Scrollable Cards */}
      {homepageData?.show_hot_sellers !== false && (
        <BestsellerCarousel
          title={homepageData?.hot_seller_title || "Bestsellers"}
          label="FAVOURITES"
          products={bestsellerProducts}
          region={region}
        />
      )}

      {/* ⑥ COLLECTION - Shop Healing Crystals (Intent Based Rows) */}
      <div className="bg-white py-16 md:py-24">
        <IntentCollections region={region} title={homepageData?.shop_by_intent_title} />
      </div>

      {/* Instagram Banner */}
      {homepageData?.show_instagram !== false && (
        <InstagramBanner 
          banner={homepageData?.instagram_banner} 
          handle={homepageData?.instagram_handle} 
        />
      )}

      {/* FAQ Section */}
      {homepageData?.show_faq !== false && <FAQSection items={homepageData?.faqs} />}

      {/* Testimonials */}
      <div className="bg-white">
        <Testimonials 
          title={homepageData?.testimonials_title} 
          testimonials={homepageData?.testimonials} 
        />
      </div>

      {/* Combos Section */}
      <CombosSection region={region} />
    </div>
  )
}
