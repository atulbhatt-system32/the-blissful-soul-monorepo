"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"

export default function StoreSearch({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(initialQuery)

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      return params.toString()
    },
    [searchParams]
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Trigger the Next.js router to refresh with the new parameter
    router.replace(`${pathname}?${createQueryString("q", query)}`)
  }

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-x-2 max-w-2xl w-full">
      <div className="relative flex-1 group">
        <div className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-[#2C1E36]/40 group-focus-within:text-[#C5A059] transition-colors pointer-events-none border-r border-gray-100 pr-2 md:pr-3">
          <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search crystals..."
          className="w-full bg-white border border-gray-100 py-3 md:py-3.5 pl-12 md:pl-16 pr-4 md:pr-6 rounded-[32px] text-xs md:text-sm focus:outline-none focus:border-[#2C1E36]/30 transition-all font-sans italic hover:border-gray-200 placeholder:text-[#2C1E36]/40 shadow-sm hover:shadow-md focus:shadow-lg focus:shadow-[#2C1E36]/5"
        />
      </div>
      <button type="submit" className="hidden sm:flex bg-[#2C1E36] text-white px-5 md:px-8 py-3 md:py-3.5 rounded-[32px] text-[13px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-[#2C1E36]/20 active:scale-95 items-center justify-center">
        <span className="hidden md:inline">Search</span>
        <svg className="inline md:hidden w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </form>
  )
}
