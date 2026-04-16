"use client"

import { useState } from "react"
import SearchModal from "@modules/layout/components/search-modal"

const SearchToggle = ({ countryCode }: { countryCode: string }) => {
  const [isOpen, setIsOpen] = useState(false)

  const openSearch = () => setIsOpen(true)
  const closeSearch = () => setIsOpen(false)

  return (
    <>
      <button 
        onClick={openSearch}
        className="text-[#130E14] hover:text-[#3B2244] transition-colors p-2 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </button>

      <SearchModal 
        isOpen={isOpen} 
        close={closeSearch} 
        countryCode={countryCode} 
      />
    </>
  )
}

export default SearchToggle
