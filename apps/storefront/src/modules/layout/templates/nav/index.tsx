import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import PromotionBanner from "@modules/layout/components/promotion-banner"
import SearchToggle from "@modules/layout/components/search-toggle"


export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <PromotionBanner />
      <header className="sticky top-0 z-[100] h-24 mx-auto border-b border-metal/10 duration-200 bg-background/85 backdrop-blur-md transition-all">
        <nav className="content-container flex items-center justify-between w-full h-full">
          {/* Logo Section */}
          <div className="flex-1 basis-0 h-full flex items-center">
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

          {/* Centered Navigation */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="flex items-center gap-x-1 bg-white/20 rounded-full px-1 py-1 border border-black/5 shadow-sm">
              <LocalizedClientLink 
                href="/" 
                className="font-sans text-[13px] font-medium transition-all duration-300 h-10 flex items-center px-6 rounded-full text-foreground/70 hover:text-[#2C1E36]"
                activeClassName="!bg-[#2C1E36] !text-white shadow-sm font-semibold"
              >
                Home
              </LocalizedClientLink>
              <LocalizedClientLink 
                href="/about" 
                className="font-sans text-[13px] font-medium transition-all duration-300 h-10 flex items-center px-6 rounded-full text-foreground/70 hover:text-[#2C1E36]"
                activeClassName="!bg-[#2C1E36] !text-white shadow-sm font-semibold"
              >
                About
              </LocalizedClientLink>
              <LocalizedClientLink 
                href="/book-session" 
                className="font-sans text-[13px] font-medium transition-all duration-300 h-10 flex items-center px-6 rounded-full text-foreground/70 hover:text-[#2C1E36]"
                activeClassName="!bg-[#2C1E36] !text-white shadow-sm font-semibold"
              >
                Book your session
              </LocalizedClientLink>
              <LocalizedClientLink 
                href="/store" 
                className="font-sans text-[13px] font-medium transition-all duration-300 h-10 flex items-center px-6 rounded-full text-foreground/70 hover:text-[#2C1E36]"
                activeClassName="!bg-[#2C1E36] !text-white shadow-sm font-semibold"
              >
                Shop Crystals
              </LocalizedClientLink>
              <LocalizedClientLink 
                href="/contact" 
                className="font-sans text-[13px] font-medium transition-all duration-300 h-10 flex items-center px-6 rounded-full text-foreground/70 hover:text-[#2C1E36]"
                activeClassName="!bg-[#2C1E36] !text-white shadow-sm font-semibold"
              >
                Contact
              </LocalizedClientLink>
            </div>
          </div>

          {/* Action Icons Section */}
          <div className="flex items-center gap-x-1.5 h-full flex-1 basis-0 justify-end">
            <div className="flex items-center">
               <SearchToggle countryCode={currentLocale || "in"} />
               
               {/* Track Order Icon */}
               <LocalizedClientLink
                className="text-foreground hover:text-primary transition-colors hidden md:block p-2"
                href="/order/lookup"
                title="Track Order"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="m7.5 4.27 9 5.15"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/><circle cx="18.5" cy="17.5" r="3.5"/><polyline points="17 17.5 18 18.5 20 16.5"/>
                </svg>
              </LocalizedClientLink>

               {/* Wishlist Icon */}
               <LocalizedClientLink
                className="text-foreground hover:text-primary transition-colors hidden sm:block p-2"
                href="/wishlist"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </LocalizedClientLink>

               {/* Cart Icon wrapper */}
               <div className="relative text-foreground hover:text-primary transition-all p-2 flex items-center justify-center">
                <Suspense fallback={<span>0</span>}>
                  <CartButton />
                </Suspense>
              </div>

              {/* Account Icon */}
              <LocalizedClientLink
                className="text-foreground hover:text-primary transition-colors hidden sm:block p-2"
                href="/account"
                data-testid="nav-account-link"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </LocalizedClientLink>
            </div>
            
            {/* Mobile Menu */}
            <div className="lg:hidden">
               <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
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
    </div>
  )

}
