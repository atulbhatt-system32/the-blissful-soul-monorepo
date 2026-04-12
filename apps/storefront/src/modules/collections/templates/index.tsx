import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <>
      <div className="content-container py-4">
        <nav className="flex items-center gap-x-2 text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059]">
          <LocalizedClientLink href="/" className="hover:text-[#2C1E36] transition-colors">
            Home
          </LocalizedClientLink>
          <span className="text-gray-300">/</span>
          <LocalizedClientLink href="/store" className="hover:text-[#2C1E36] transition-colors">
            Store
          </LocalizedClientLink>
          <span className="text-gray-300">/</span>
          <span className="text-[#2C1E36]/60">{collection.title}</span>
        </nav>
      </div>
      <div className="flex flex-col small:flex-row small:items-start py-6 content-container">
        <RefinementList sortBy={sort} />
        <div className="w-full">
          <div className="mb-8 text-2xl-semi">
            <h1>{collection.title}</h1>
          </div>
          <Suspense
            fallback={
              <SkeletonProductGrid
                numberOfProducts={collection.products?.length}
              />
            }
          >
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              collectionId={collection.id}
              countryCode={countryCode}
            />
          </Suspense>
        </div>
      </div>
    </>
  )
}
