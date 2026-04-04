"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import SortProducts, { SortOptions } from "./sort-products"

type RefinementListProps = {
  sortBy: SortOptions
  limit?: string
  view?: string
  search?: boolean
  'data-testid'?: string
}

const showOptions = ["9", "12", "18", "24"]

const GridIcon2 = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="11" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="1" y="11" width="6" height="6" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="11" y="11" width="6" height="6" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

const GridIcon3 = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="2" width="4" height="14" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="7" y="2" width="4" height="14" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="13" y="2" width="4" height="14" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

const GridIcon4 = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="3" height="3" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="6" y="1" width="3" height="3" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="11" y="1" width="3" height="3" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="1" y="6" width="3" height="3" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="6" y="6" width="3" height="3" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="11" y="6" width="3" height="3" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="1" y="11" width="3" height="3" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="6" y="11" width="3" height="3" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="11" y="11" width="3" height="3" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

const RefinementList = ({ sortBy, limit = "12", view = "3", 'data-testid': dataTestId }: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      // reset page to 1 when changing limit or view
      if (name !== 'page') {
          params.set('page', '1')
      }
      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  return (
    <div className="flex items-center gap-4 md:gap-8 flex-wrap" data-testid={dataTestId}>
      {/* Show Per Page */}
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
        <span>Show :</span>
        {showOptions.map((opt, index) => (
          <span key={opt} className="flex flex-row items-center">
            <button
              onClick={() => setQueryParams("limit", opt)}
              className={`hover:text-black transition-colors ${limit === opt ? "text-black font-bold" : ""}`}
            >
              {opt}
            </button>
            {index < showOptions.length - 1 && <span className="ml-2">/</span>}
          </span>
        ))}
      </div>

      {/* View Toggles */}
      <div className="flex items-center gap-3 text-gray-400">
        <button 
          onClick={() => setQueryParams("view", "2")}
          className={`hover:text-black transition-colors ${view === "2" ? "text-black" : ""}`}
          aria-label="2 Columns"
        >
          <GridIcon2 />
        </button>
        <button 
          onClick={() => setQueryParams("view", "3")}
          className={`hover:text-black transition-colors ${view === "3" ? "text-black" : ""}`}
          aria-label="3 Columns"
        >
          <GridIcon3 />
        </button>
        <button 
          onClick={() => setQueryParams("view", "4")}
          className={`hover:text-black transition-colors ${view === "4" ? "text-black" : ""}`}
          aria-label="4 Columns"
        >
          <GridIcon4 />
        </button>
      </div>

      {/* Sort Dropdown */}
      <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} />
    </div>
  )
}

export default RefinementList
