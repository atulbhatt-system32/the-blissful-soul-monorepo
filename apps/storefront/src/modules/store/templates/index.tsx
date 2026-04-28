import { Suspense } from "react"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreSearch from "@modules/store/components/search"
import PaginatedProducts from "./paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import DiscountMarquee from "@modules/layout/components/discount-marquee"

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
  showHero?: boolean
  showAnnouncements?: boolean
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const heroData = heroImage?.data?.attributes || heroImage?.attributes || heroImage || null
  const bannerUrl = heroData?.url
    ? (heroData.url.startsWith("http") ? heroData.url : `${STRAPI_URL}${heroData.url}`)
    : null

  const announcementMessages = announcements?.map((a: any) => a.text || a.attributes?.text || a.data?.attributes?.text).filter(Boolean) || []

  return (
    <div className="bg-[#FAF9F6] min-h-screen relative pb-12 md:pb-0">
      {/* Top Marquee for Store Page */}
      {showAnnouncements && (
        <div className="hidden md:block">
          <DiscountMarquee messages={announcementMessages} />
        </div>
      )}

      {/* Store Hero Banner */}
      {showHero && bannerUrl && (
        <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden bg-gray-100">
          <Image
            src={bannerUrl}
            alt={heroTitle || "Shop Crystals"}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Subtle Bottom Fade to blend with page background */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-transparent to-transparent opacity-40" />
          
          <div className="content-container relative z-10 h-full flex flex-col justify-center py-8 md:py-16 !px-3 md:!px-8">
            {/* Breadcrumb inside banner */}
            <nav className="flex items-center gap-x-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#2C1E36]/50 mb-4 md:mb-8">
              <LocalizedClientLink href="/" className="hover:text-[#2C1E36] transition-colors">
                Home
              </LocalizedClientLink>
              <span className="text-[#2C1E36]/20">/</span>
              <span className="text-[#2C1E36]/80">Shop Crystals</span>
            </nav>

            <div className="flex flex-col gap-y-3 md:gap-y-5 max-w-[650px] p-4 md:p-0 rounded-2xl md:bg-transparent bg-white/10 backdrop-blur-[2px] md:backdrop-blur-0">
              <div className="flex flex-col gap-y-1">
                {heroTitle && (
                  <h1 className="text-4xl md:text-[68px] font-serif text-[#2C1E36] leading-tight drop-shadow-sm">
                    {heroTitle}
                  </h1>
                )}
                <div className="h-1.5 w-24 bg-[#C5A059] rounded-full shadow-sm"></div>
              </div>
              {heroSubtitle && (
                <p className="text-[#2C1E36]/90 text-base md:text-2xl font-sans leading-relaxed font-medium">
                  {heroSubtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Show basic header if hero is enabled but no banner image */}
      {showHero && !bannerUrl && (
        <div className="content-container !px-3 md:!px-8 pt-8 md:pt-12">
          <nav className="flex items-center gap-x-2 text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-4">
            <LocalizedClientLink href="/" className="hover:text-[#2C1E36] transition-colors">
              Home
            </LocalizedClientLink>
            <span className="text-gray-300">/</span>
            <span className="text-[#2C1E36]/60">Shop Crystals</span>
          </nav>
          <div className="flex flex-col gap-y-4 max-w-[800px]">
            <div className="flex flex-col gap-y-1">
              {heroTitle && (
                <h1 className="text-4xl md:text-[56px] font-serif text-[#2C1E36] leading-tight">
                  {heroTitle}
                </h1>
              )}
              <div className="h-1 w-20 bg-[#C5A059] rounded-full mt-1"></div>
            </div>
            {heroSubtitle && (
              <p className="text-[#2C1E36]/80 text-base md:text-xl font-sans leading-relaxed italic">
                {heroSubtitle}
              </p>
            )}
          </div>
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

      {/* Mobile Sticky Discount Bar - Only for Store Page */}
      {showAnnouncements && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
          <DiscountMarquee messages={announcementMessages} />
        </div>
      )}
    </div>
  )
}

export default StoreTemplate
