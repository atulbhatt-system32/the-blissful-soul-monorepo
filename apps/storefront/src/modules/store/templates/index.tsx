import { Suspense } from "react"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreSearch from "@modules/store/components/search"
import PaginatedProducts from "./paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import ScrollingMarquee from "@modules/home/components/scrolling-marquee"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

const StoreTemplate = ({
  sortBy,
  page,
  limit,
  view,
  q,
  countryCode,
  heroTitle,
  heroSubtitle,
  announcements,
  heroImage,
  mobileHeroImage,
  titleColor,
  subtitleColor,
  showHero = true,
  showAnnouncements = true,
}: {
  sortBy?: SortOptions
  page?: string
  limit?: string
  view?: string
  q?: string
  countryCode: string
  heroTitle?: string
  heroSubtitle?: string
  announcements?: any[]
  heroImage?: any
  mobileHeroImage?: any
  titleColor?: string
  subtitleColor?: string
  showHero?: boolean
  showAnnouncements?: boolean
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const heroData = heroImage?.data?.attributes || heroImage?.attributes || heroImage || null
  const bannerUrl = heroData?.url
    ? (heroData.url.startsWith("http") ? heroData.url : `${STRAPI_URL}${heroData.url}`)
    : null

  const mobileHeroData = mobileHeroImage?.data?.attributes || mobileHeroImage?.attributes || mobileHeroImage || null
  const mobileBannerUrl = mobileHeroData?.url
    ? (mobileHeroData.url.startsWith("http") ? mobileHeroData.url : `${STRAPI_URL}${mobileHeroData.url}`)
    : null

  const marqueeItems = announcements?.map((a: any, idx: number) => ({
    id: a.id || idx,
    text: a.text || a.attributes?.text || a.data?.attributes?.text
  })).filter(a => a.text) || []

  return (
    <div className="bg-[#FAF9F6] min-h-screen relative pb-12 md:pb-0">
      {/* Store Hero Banner - Fully Responsive & Natural Height */}
      {showHero && (bannerUrl || mobileBannerUrl) && (
        <div className="w-full bg-[#FAF9F6] relative">
          <div className="w-full h-auto">
            {/* Desktop Banner */}
            {bannerUrl && (
              <img
                src={bannerUrl}
                alt={heroTitle || "Shop Crystals"}
                className={`w-full h-auto block ${mobileBannerUrl ? 'hidden md:block' : ''}`}
              />
            )}
            {/* Mobile Banner */}
            {mobileBannerUrl && (
              <img
                src={mobileBannerUrl}
                alt={heroTitle || "Shop Crystals"}
                className={`w-full h-auto block ${bannerUrl ? 'md:hidden' : ''}`}
              />
            )}
          </div>
          
          <div className="absolute inset-0 z-10 flex flex-col justify-end pb-8 md:pb-16 !px-3 md:!px-8 pointer-events-none">
            <div className="content-container w-full">
              {/* We only show text if it's explicitly different from what's in the image */}
              {!(bannerUrl?.includes('followers') || mobileBannerUrl?.includes('followers')) && (
                <div className="flex flex-col gap-y-3 md:gap-y-5 max-w-[650px] pointer-events-auto">
                  <div className="flex flex-col gap-y-1">
                    {heroTitle && (
                      <h1 
                        className="text-4xl md:text-[68px] font-serif leading-tight drop-shadow-sm"
                        style={{ color: titleColor || "#2C1E36" }}
                      >
                        {heroTitle}
                      </h1>
                    )}
                  </div>
                  {heroSubtitle && (
                    <p 
                      className="text-base md:text-2xl font-sans leading-relaxed font-medium"
                      style={{ color: subtitleColor || "#2C1E36" }}
                    >
                      {heroSubtitle}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Show basic header if hero is enabled but no banner image */}
      {showHero && !bannerUrl && (
        <div className="content-container !px-3 md:!px-8 pt-8 md:pt-12">
          <div className="flex flex-col gap-y-4 max-w-[800px]">
            <div className="flex flex-col gap-y-1">
              {heroTitle && (
                <h1 
                  className="text-4xl md:text-[56px] font-serif leading-tight"
                  style={{ color: titleColor || "#2C1E36" }}
                >
                  {heroTitle}
                </h1>
              )}
              <div className="h-1 w-20 bg-[#C5A059] rounded-full mt-1"></div>
            </div>
            {heroSubtitle && (
              <p 
                className="text-base md:text-xl font-sans leading-relaxed italic"
                style={{ color: subtitleColor || "#2C1E36" }}
              >
                {heroSubtitle}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Top Marquee for Store Page - Moved below Hero */}
      {showAnnouncements && marqueeItems.length > 0 && (
        <div className="hidden md:block border-b border-[#C5A059]/10">
          <ScrollingMarquee items={marqueeItems} />
        </div>
      )}

      <div className="content-container !px-3 md:!px-8 py-8 md:py-12" data-testid="category-container">
        {/* Main Content */}
        <div className="w-full">
          {/* Combined Search & Sort Toolbar */}
          <div className="flex flex-row items-center gap-2 md:gap-4 w-full">
            <div className="flex-1 relative z-[20]">
              <StoreSearch initialQuery={q} />
            </div>
            <div className="relative z-[40] flex items-center shrink-0">
              <div className="md:bg-white/70 md:backdrop-blur-md p-0 md:p-3 md:rounded-[32px] md:border md:border-gray-100 md:shadow-xl md:shadow-[#2C1E36]/5 flex items-center">
                <RefinementList sortBy={sort} limit={limit} view={view} />
              </div>
            </div>
          </div>

          <div className="mt-16">
            <Suspense fallback={<SkeletonProductGrid />}>
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                limit={limit}
                view={view}
                q={q}
                countryCode={countryCode}
              />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Marquee - Only for Store Page */}
      {showAnnouncements && marqueeItems.length > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
          <ScrollingMarquee items={marqueeItems} />
        </div>
      )}
    </div>
  )
}

export default StoreTemplate
