import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  heroTitle,
  heroSubtitle,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  heroTitle?: string
  heroSubtitle?: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="bg-[#FAF9F6]">
      {/* Hero Header */}
      <section className="bg-[#0A0A0A] py-16 md:py-24 flex flex-col items-center justify-center text-center mb-8">
        <h1 className="text-white text-5xl md:text-7xl font-serif uppercase tracking-tight">
          {heroTitle || "Show Crystals"}
        </h1>
        {heroSubtitle && (
          <p className="text-white/60 text-lg md:text-xl font-serif mt-4 max-w-2xl px-4">
            {heroSubtitle}
          </p>
        )}
      </section>

      <div className="content-container py-6" data-testid="category-container">
        <div className="flex flex-col w-full">
          {/* Breadcrumbs and Filters wrapper */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-pink-100 pb-6 gap-4">
             <div className="text-xs text-gray-400 font-medium">
                Home / {heroTitle || "Show Crystals"}
             </div>
             
             <RefinementList sortBy={sort} />
          </div>

          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              countryCode={countryCode}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate
