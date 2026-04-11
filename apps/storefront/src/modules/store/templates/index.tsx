import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreSearch from "@modules/store/components/search"

import PaginatedProducts from "./paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const StoreTemplate = ({
  sortBy,
  page,
  limit,
  view,
  q,
  countryCode,
  heroTitle,
  heroSubtitle,
}: {
  sortBy?: SortOptions
  page?: string
  limit?: string
  view?: string
  q?: string
  countryCode: string
  heroTitle?: string
  heroSubtitle?: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <div className="content-container !px-3 md:!px-8 py-8 md:py-16" data-testid="category-container">
        {/* Main Content */}
        <div className="w-full">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-x-2 text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-8">
            <LocalizedClientLink href="/" className="hover:text-[#2C1E36] transition-colors">
              Home
            </LocalizedClientLink>
            <span className="text-gray-300">/</span>
            <span className="text-[#2C1E36]/60">Shop Crystals</span>
          </nav>

          {/* Header Content */}
          <div className="flex flex-col gap-y-6 md:gap-y-10">
            <div className="flex flex-col gap-y-1">
              <h1 className="text-3xl md:text-[48px] font-serif text-[#2C1E36] leading-tight">
                Shop Crystals
              </h1>
              <div className="h-1 w-16 md:w-20 bg-[#C5A059] rounded-full mt-2"></div>
            </div>

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
    </div>
  )
}


export default StoreTemplate
