import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  limit,
  view,
  countryCode,
  heroTitle,
  heroSubtitle,
}: {
  sortBy?: SortOptions
  page?: string
  limit?: string
  view?: string
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
                    0 pieces
                  </span>
                </div>
                
                <RefinementList sortBy={sort} limit={limit} view={view} />
              </div>

              {/* Search Bar */}
              <div className="flex items-center gap-x-2 max-w-2xl w-full">
                <div className="relative flex-1 group">
                  <input 
                    type="text" 
                    placeholder="Search crystals..."
                    className="w-full bg-white border border-gray-100 py-3.5 px-6 rounded-[32px] text-sm focus:outline-none focus:border-[#2C1E36]/30 transition-all font-sans italic"
                  />
                </div>
                <button className="bg-[#2C1E36] text-white px-8 py-3.5 rounded-[32px] text-[13px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg active:scale-95 whitespace-nowrap">
                  Search
                </button>
              </div>
            </div>

            <Suspense fallback={<SkeletonProductGrid />}>
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                limit={limit}
                view={view}
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
