import { Suspense } from "react"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreSearch from "@modules/store/components/search"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import ScrollingMarquee from "@modules/home/components/scrolling-marquee"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

const CoursesTemplate = ({
  sortBy,
  page,
  limit,
  view,
  q,
  countryCode,
  categoryId,
  courseData,
}: {
  sortBy?: SortOptions
  page?: string
  limit?: string
  view?: string
  q?: string
  countryCode: string
  categoryId?: string
  courseData?: any
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="bg-[#FAF9F6] min-h-screen relative pb-12 md:pb-0">
      
      {/* Custom Hero Section for Courses */}
      <section className="relative overflow-hidden bg-[#1A0E22] py-16 md:py-24 flex flex-col items-center justify-center text-center">
        {courseData?.show_image && courseData?.hero_image?.url && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 z-0"
            style={{ backgroundImage: `url(${STRAPI_URL}${courseData.hero_image.url})` }}
          />
        )}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none z-0"></div>
        <div className="content-container flex flex-col items-center gap-y-7 relative z-10 animate-in fade-in slide-in-from-top-4 duration-1000">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.6em] font-bold text-[#C5A059] font-sans">
             {courseData?.heading || "LEARN & GROW"}
          </span>
          <div className="flex flex-col gap-y-5 max-w-4xl px-4">
            <h1 className="font-serif text-4xl md:text-[64px] text-white leading-[1.1] font-medium tracking-tight uppercase drop-shadow-md">
              {courseData?.title_primary || "Spiritual"} <span className="italic font-normal text-[#C5A059]">{courseData?.title_secondary || "Courses"}</span>
            </h1>
            <p className="text-white/80 text-base md:text-lg max-w-xl mx-auto leading-relaxed font-sans font-medium drop-shadow-md">
              {courseData?.description || "Explore our curated selection of deeply transformative spiritual courses, designed to awaken your consciousness."}
            </p>
          </div>
        </div>
      </section>

      <div className="content-container !px-3 md:!px-8 py-8 md:py-12" data-testid="category-container">
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
                categoryId={categoryId}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoursesTemplate
