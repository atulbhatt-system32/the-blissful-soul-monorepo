import { notFound } from "next/navigation"
import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  // Walk up to the root so the breadcrumb reads Shop Collection > Bracelets.
  // Collected child-first, so reverse before rendering.
  const parents: HttpTypes.StoreProductCategory[] = []

  const collectParents = (current: HttpTypes.StoreProductCategory) => {
    if (current.parent_category) {
      parents.push(current.parent_category)
      collectParents(current.parent_category)
    }
  }

  collectParents(category)
  parents.reverse()

  const children = category.category_children ?? []

  return (
    <div
      className="bg-[#FAF9F6] min-h-screen"
      data-testid="category-container"
    >
      <div className="content-container !px-3 md:!px-8 py-8 md:py-14">
        {/* Breadcrumb */}
        <nav
          className="flex flex-wrap items-center gap-x-2 text-[11px] md:text-xs uppercase tracking-[0.2em] font-sans text-[#665D6B] mb-5"
          aria-label="Breadcrumb"
        >
          <LocalizedClientLink href="/store" className="hover:text-[#2C1E36] transition-colors">
            Shop
          </LocalizedClientLink>
          {parents.map((parent) => (
            <span key={parent.id} className="flex items-center gap-x-2">
              <span className="text-[#C5A059]">/</span>
              <LocalizedClientLink
                href={`/categories/${parent.handle}`}
                className="hover:text-[#2C1E36] transition-colors"
                data-testid="sort-by-link"
              >
                {parent.name}
              </LocalizedClientLink>
            </span>
          ))}
          <span className="text-[#C5A059]">/</span>
          <span className="text-[#2C1E36] font-bold">{category.name}</span>
        </nav>

        {/* Title */}
        <div className="flex flex-col gap-y-3 max-w-[800px] mb-8 md:mb-12">
          <h1
            className="text-3xl md:text-[52px] font-serif text-[#2C1E36] leading-tight"
            data-testid="category-page-title"
          >
            {category.name}
          </h1>
          <div className="h-1 w-20 bg-[#C5A059] rounded-full" />
          {category.description && (
            <p className="text-base md:text-lg text-[#665D6B] font-sans leading-relaxed italic mt-2">
              {category.description}
            </p>
          )}
        </div>

        {/* Sub-categories, when this is a parent like Shop Collection */}
        {children.length > 0 && (
          <div className="flex flex-wrap gap-2 md:gap-3 mb-8 md:mb-12">
            {children.map((child) => (
              <LocalizedClientLink
                key={child.id}
                href={`/categories/${child.handle}`}
                className="px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-white border border-purple-50/70 text-[11px] md:text-xs uppercase tracking-[0.12em] font-bold text-[#2C1E36] shadow-sm hover:shadow-md hover:border-[#C5A059]/40 transition-all duration-300"
              >
                {child.name}
              </LocalizedClientLink>
            ))}
          </div>
        )}

        {/* Sort toolbar — matches the shop page */}
        <div className="flex justify-end mb-8">
          <div className="relative z-[40] flex items-center shrink-0">
            <div className="md:bg-white/70 md:backdrop-blur-md p-0 md:p-3 md:rounded-[32px] md:border md:border-gray-100 md:shadow-xl md:shadow-[#2C1E36]/5 flex items-center">
              <RefinementList sortBy={sort} data-testid="sort-by-container" />
            </div>
          </div>
        </div>

        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            categoryId={category.id}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}
