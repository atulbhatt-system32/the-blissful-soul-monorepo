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

const RefinementList = ({ sortBy, limit = "12", view = "4", 'data-testid': dataTestId }: RefinementListProps) => {
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
    <div className="flex items-center gap-4 md:gap-8 flex-wrap relative z-[40]" data-testid={dataTestId}>
      {/* Show Per Page - Hidden on Mobile */}
      <div className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2C1E36]">
        <span className="mr-1">Show:</span>
        <div className="flex items-center bg-white rounded-full px-3 py-1 border border-gray-100 shadow-md">
          {showOptions.map((opt, index) => (
            <div key={opt} className="flex items-center">
              <button
                onClick={() => setQueryParams("limit", opt)}
                className={`transition-all px-2 text-xs font-bold ${limit === opt ? "text-[#C5A059] scale-110" : "text-[#2C1E36]/50 hover:text-[#C5A059]"}`}
              >
                {opt}
              </button>
              {index < showOptions.length - 1 && <span className="text-gray-100 font-light mx-1">|</span>}
            </div>
          ))}
        </div>
      </div>

      {/* View Toggles - Hidden on Mobile */}
      <div className="hidden md:flex items-center gap-1 bg-white rounded-full p-1 border border-gray-100 shadow-md">
        {[
          { id: "2", icon: <GridIcon2 /> },
          { id: "3", icon: <GridIcon3 /> },
          { id: "4", icon: <GridIcon4 /> }
        ].map((v) => (
          <button 
            key={v.id}
            onClick={() => setQueryParams("view", v.id)}
            className={`p-2 rounded-full transition-all duration-300 ${view === v.id ? "bg-[#2C1E36] text-[#C5A059] shadow-inner" : "text-[#2C1E36]/40 hover:text-[#2C1E36] hover:bg-gray-100"}`}
            aria-label={`${v.id} Columns`}
          >
            {v.icon}
          </button>
        ))}
      </div>

      {/* Sort Dropdown - Always Visible */}
      <div className="w-full md:w-auto flex justify-center md:justify-start">
        <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} />
      </div>
    </div>
  )
}

export default RefinementList
