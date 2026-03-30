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
      <header className="relative h-20 mx-auto border-b duration-200 bg-white border-ui-border-base">
        <nav className="content-container flex items-center justify-between w-full h-full">
          {/* Logo */}
          <div className="flex-1 basis-0 h-full flex items-center">
            <LocalizedClientLink
              href="/"
              className="flex items-center gap-2"
              data-testid="nav-store-link"
            >
              <Image 
                src="/logo.png" 
                alt="The Blissful Soul" 
                width={150} 
                height={60} 
                className="object-contain max-h-16"
              />
            </LocalizedClientLink>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-x-8 h-full">
            <LocalizedClientLink href="/" className="font-serif text-sm uppercase tracking-widest hover:text-pink-600 transition-colors" activeClassName="text-pink-600 font-bold">
              Home
            </LocalizedClientLink>
            <LocalizedClientLink href="/about" className="font-serif text-sm uppercase tracking-widest hover:text-pink-600 transition-colors" activeClassName="text-pink-600 font-bold">
              About Master
            </LocalizedClientLink>
            <LocalizedClientLink href="/book-session" className="font-serif text-sm uppercase tracking-widest hover:text-pink-600 transition-colors" activeClassName="text-pink-600 font-bold">
              Book Your Session
            </LocalizedClientLink>
            <LocalizedClientLink href="/store" className="font-serif text-sm uppercase tracking-widest hover:text-pink-600 transition-colors" activeClassName="text-pink-600 font-bold">
              Shop Crystals
            </LocalizedClientLink>
            <LocalizedClientLink href="/contact" className="font-serif text-sm uppercase tracking-widest hover:text-pink-600 transition-colors" activeClassName="text-pink-600 font-bold">
              Contact Us
            </LocalizedClientLink>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-x-5 h-full flex-1 basis-0 justify-end">
            <div className="flex items-center gap-x-4">
               <SearchToggle countryCode={currentLocale || "in"} />
              
               <LocalizedClientLink
                className="hover:text-pink-600 transition-colors hidden sm:block"
                href="/account"
                data-testid="nav-account-link"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </LocalizedClientLink>

              <div className="relative bg-pink-100 p-2 rounded-full text-pink-600 hover:bg-pink-200 transition-colors">
                <Suspense fallback={<span>0</span>}>
                  <CartButton />
                </Suspense>
              </div>
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
        href="https://wa.me/9191191191XX" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[60] bg-[#25D366] p-3 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-15.313c-.112-.245-.23-.25-.336-.254-.087-.003-.188-.003-.288-.003-.1 0-.263.038-.4.188-.138.15-.525.513-.525 1.25s.538 1.45.613 1.55c.075.1 1.058 1.615 2.563 2.264.358.153.638.245.855.315.36.113.688.098.948.06.29-.043.888-.363 1.013-.715.125-.353.125-.655.087-.718-.037-.063-.137-.1-.287-.175s-.887-.438-1.025-.487c-.138-.05-.238-.075-.338.075s-.387.487-.475.588-.175.112-.325.038c-.15-.075-.63-.232-1.2-.742-.444-.396-.744-.885-.83-1.036-.088-.15-.01-.23.065-.304.068-.066.15-.175.225-.263.075-.088.1-.15.15-.25s.025-.188-.012-.263c-.037-.075-.337-.813-.462-1.114z"/>
        </svg>
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-pink-900 border px-4 py-2 rounded-xl text-xs font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
           Need help? Chat with us!
        </span>
      </a>
    </div>
  )

}
