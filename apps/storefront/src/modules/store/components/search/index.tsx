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
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search crystals..."
          className="w-full bg-white border border-gray-100 py-3.5 px-6 rounded-[32px] text-sm focus:outline-none focus:border-[#2C1E36]/30 transition-all font-sans italic"
        />
      </div>
      <button type="submit" className="bg-[#2C1E36] text-white px-8 py-3.5 rounded-[32px] text-[13px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg active:scale-95 whitespace-nowrap">
        Search
      </button>
    </form>
  )
}
