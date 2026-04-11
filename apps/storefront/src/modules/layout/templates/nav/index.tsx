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
import SearchToggle from "@modules/layout/components/search-toggle"
import StickyWrapper from "@modules/layout/components/sticky-wrapper"


export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: HttpTypes.StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <StickyWrapper>
      <PromotionBanner />
      <header className="w-full h-24 border-b border-metal/10 duration-200 !bg-white transition-all relative z-[101]">
        <nav className="content-container flex items-center justify-between w-full h-full">
          
          {/* Left Section: Logo */}
          <div className="flex items-center">
            <LocalizedClientLink
              href="/"
              className="flex flex-col items-start"
              data-testid="nav-store-link"
            >
              <span className="font-serif text-xl md:text-2xl text-primary leading-tight font-medium">
                The Blissful Soul
              </span>
              <span className="text-[9px] md:text-[10px] text-primary/80 uppercase tracking-[0.3em] font-sans font-bold -mt-1">
                HEALING & CRYSTALS
              </span>
            </LocalizedClientLink>
          </div>

          {/* Right Section: Navigation & Actions */}
          <div className="flex items-center gap-x-3 md:gap-x-5">
            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-x-8 mr-4">
              <LocalizedClientLink 
                href="/about" 
                className="font-sans text-[13px] font-medium text-foreground/70 hover:text-primary transition-colors"
              >
                About
              </LocalizedClientLink>
              <LocalizedClientLink 
                href="/store" 
                className="font-sans text-[13px] font-medium text-foreground/70 hover:text-primary transition-colors"
              >
                Shop Crystals
              </LocalizedClientLink>
              <LocalizedClientLink 
                href="/book-session" 
                className="font-sans text-[13px] font-medium text-foreground/70 hover:text-primary transition-colors"
              >
                Sessions
              </LocalizedClientLink>
            </div>

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

              {/* Mobile Cart Direct Link */}
              <div className="sm:hidden flex items-center">
                <LocalizedClientLink 
                  href="/cart" 
                  className="p-3 -m-1 text-foreground hover:text-primary transition-colors flex items-center justify-center relative z-20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                </LocalizedClientLink>
              </div>

              {/* Account Icon - Desktop Only */}
              <LocalizedClientLink
                className="text-foreground hover:text-primary transition-colors hidden sm:block p-2"
                href="/account"
                data-testid="nav-account-link"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </LocalizedClientLink>

              {/* Mobile Search Toggle */}
              <div className="sm:hidden">
                <SearchToggle countryCode={currentLocale || "in"} />
              </div>

              {/* Menu trigger on extreme right */}
              <div className="ml-0.5">
                <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
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
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-pink-900 border px-4 py-2 rounded-xl text-xs font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
           Need help? Chat with us!
        </span>
      </a>
    </StickyWrapper>
  )
}
