import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"

const Help = () => {
  return (
    <div className="mt-6">
      <Heading className="text-sm font-serif text-[#2C1E36] mb-4">Assistance Required?</Heading>
      <div className="text-xs font-bold my-2">
        <ul className="gap-y-3 flex flex-col">
          <li>
            <LocalizedClientLink href="/contact" className="text-[#C5A059] hover:text-[#2C1E36] transition-colors uppercase tracking-widest">
              Connect with Concierge
            </LocalizedClientLink>
          </li>
          <li>
            <LocalizedClientLink href="/contact" className="text-[#C5A059] hover:text-[#2C1E36] transition-colors uppercase tracking-widest">
              Returns & Exchanges
            </LocalizedClientLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Help
