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
        className="hover:text-pink-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
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
