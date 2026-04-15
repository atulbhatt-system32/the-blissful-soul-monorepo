"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useWishlist } from "@lib/context/wishlist-context"

const WishlistButton = () => {
  const { wishlist } = useWishlist()

  return (
    <LocalizedClientLink
      className="text-foreground hover:text-primary transition-colors p-2 relative"
      href="/wishlist"
      data-testid="nav-wishlist-link"
      aria-label="Wishlist"
    >
      <span className="relative inline-block">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>

        {wishlist.length > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-[#C5A059] text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
            {wishlist.length}
          </span>
        )}
      </span>
    </LocalizedClientLink>
  )
}

export default WishlistButton
