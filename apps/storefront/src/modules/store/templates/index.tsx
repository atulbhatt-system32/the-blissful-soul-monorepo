import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreSearch from "@modules/store/components/search"

import PaginatedProducts from "./paginated-products"

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
      <div className="content-container py-12 md:py-20" data-testid="category-container">
        <div className="flex flex-col lg:flex-row gap-x-16">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-1/5 flex flex-col gap-y-12 mb-12 lg:mb-0">
            {/* Categories */}
            <div className="flex flex-col gap-y-6">
              <h3 className="text-[10px] font-bold text-[#C5A059] uppercase tracking-[0.3em] font-sans">
                Categories
              </h3>
              <ul className="flex flex-col gap-y-4">
                <li className="relative pl-4">
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C5A059] rounded-full"></div>
                  <button className="text-sm font-bold text-[#2C1E36] hover:text-[#C5A059] transition-colors">
                    All
                  </button>
                </li>
              </ul>
            </div>

            {/* Product Type */}
            <div className="flex flex-col gap-y-6">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] font-sans">
                Product Type
              </h3>
              <ul className="flex flex-col gap-y-4">
                <li className="relative pl-4">
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C5A059] rounded-full"></div>
                  <button className="text-sm font-bold text-[#2C1E36] hover:text-[#C5A059] transition-colors font-sans">
                    All types
                  </button>
                </li>
                <li className="pl-4">
                  <button className="text-sm font-medium text-gray-500 hover:text-[#2C1E36] transition-colors font-sans">
                    Physical
                  </button>
                </li>
                <li className="pl-4">
                  <button className="text-sm font-medium text-gray-500 hover:text-[#2C1E36] transition-colors font-sans">
                    Digital
                  </button>
                </li>
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header Content */}
            <div className="flex flex-col gap-y-8 mb-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between items-start gap-y-6">
                <div className="flex flex-col gap-y-2">
                  <h1 className="text-4xl md:text-[44px] font-serif text-[#2C1E36] leading-tight">
                    Shop Crystals
                  </h1>
                  <span className="text-sm text-gray-400 font-medium font-sans">
                    {/* Items count removed temporarily or handle via dynamic if available */}
                  </span>
                </div>
                
                <RefinementList sortBy={sort} limit={limit} view={view} />
              </div>

              {/* Search Bar */}
              <StoreSearch initialQuery={q} />
            </div>

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
