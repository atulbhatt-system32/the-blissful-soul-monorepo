import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import PromotionBanner from "@modules/layout/components/promotion-banner"
import { getStorePageData } from "@lib/data/strapi"
import SearchToggle from "@modules/layout/components/search-toggle"
import NavLinks from "@modules/layout/components/nav-links"
import StickyWrapper from "@modules/layout/components/sticky-wrapper"
import WishlistButton from "@modules/layout/components/wishlist-button"
import MobileCartButton from "../../components/mobile-cart-button"
import { retrieveCart } from "@lib/data/cart"

export default async function Nav() {
  const [regions, locales, currentLocale, storeConfig, cart] = await Promise.all([
    listRegions().then((regions: HttpTypes.StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
    getStorePageData(),
    retrieveCart().catch(() => null),
  ])

  return (
    <StickyWrapper>
      {storeConfig?.show_announcement !== false && (
        <PromotionBanner announcements={storeConfig?.announcements} />
      )}
      <header className="w-full h-20 md:h-24 border-b border-metal/10 duration-200 !bg-white transition-all relative z-[101]">
        <nav className="content-container flex items-center justify-between w-full h-full">
          
          {/* Left Section: Logo */}
          <div className="flex items-center">
            <LocalizedClientLink
              href="/"
              className="flex items-center gap-x-3 md:gap-x-4 group"
              data-testid="nav-store-link"
            >
              {/* Logo image (visible on all screens now) */}
              <div className="relative w-10 h-10 md:w-14 md:h-14 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="The Blissful Soul"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Text content */}
              <div className="flex flex-col items-start min-w-0">
                <span className="font-serif text-base md:text-xl text-primary leading-tight font-medium truncate">
                  The Blissful Soul
                </span>
                <span className="text-[7px] md:text-[9px] text-primary/80 uppercase tracking-widest font-sans font-bold -mt-0.5 md:-mt-1 whitespace-nowrap">
                  HEALING & CRYSTALS
                </span>
              </div>
            </LocalizedClientLink>
          </div>

          {/* Right Section: Navigation & Actions */}
          <div className="flex items-center gap-x-3 md:gap-x-5">
            {/* Desktop Navigation Links */}
            <NavLinks />

            <div className="flex items-center gap-x-1 md:gap-x-2 border-l border-metal/10 pl-3 md:pl-6">
              {/* Desktop/Tablet Search */}
              <div className="hidden sm:block">
                <SearchToggle countryCode={currentLocale || "in"} />
              </div>
               
              {/* Desktop/Tablet Cart with Dropdown */}
              <div className="hidden sm:block">
                <Suspense fallback={<span>0</span>}>
                  <CartButton />
                </Suspense>
              </div>

              {/* Wishlist Icon with Count - Desktop */}
              <div className="hidden sm:block">
                <WishlistButton />
              </div>

              {/* Mobile Actions (Cart Only - Wishlist is in Menu) */}
              <div className="sm:hidden flex items-center gap-x-0.5">
                <MobileCartButton cart={cart} />
              </div>


              {/* Mobile Search Toggle */}
              <div className="sm:hidden">
                <SearchToggle countryCode={currentLocale || "in"} />
              </div>

              {/* Menu trigger on extreme right */}
              <div className="flex items-center">
                <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} cart={cart} />
              </div>
            </div>
          </div>
        </nav>
      </header>
      
      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/919811611341" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[60] bg-[#25D366] p-3 rounded-full shadow-[0_10px_25px_-5px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform duration-300 group flex items-center justify-center border-2 border-white/20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 448 512" fill="white">
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.7 17.8 69.4 27.2 106.2 27.2 122.4 0 222-99.6 222-222 0-59.3-23-115.1-65-157.1zM223.9 446.7c-33.1 0-65.5-8.9-93.7-25.7l-6.7-4-69.6 18.3 18.6-67.9-4.4-7c-18.4-29.4-28.1-63.3-28.1-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 54 81.2 54.1 130.5 0 101.7-82.8 184.5-184.6 184.5zm101.1-138.1c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.7-30.6-38.1-3.2-5.4-.3-8.3 2.4-11.1 2.5-2.5 5.5-6.4 8.3-9.6 2.8-3.2 3.7-5.5 5.6-9.2 1.9-3.7 1-6.9-.5-9.6-1.5-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.7 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
        </svg>
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-[#2C1E36] text-[#C5A059] border border-[#C5A059]/20 px-4 py-2 rounded-xl text-xs font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
           Need help? Chat with us!
        </span>
      </a>
    </StickyWrapper>
  )
}
