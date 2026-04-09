import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"
import Image from "next/image"
import { getContactPageData } from "@lib/data/strapi"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()
  const contactData = await getContactPageData()

  return (
    <footer className="w-full">
      <div className="bg-[#120B15] border-t border-white/5 w-full pt-8 md:pt-10 pb-8">
        <div className="content-container flex flex-col w-full text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-12 gap-y-16 mb-8 md:mb-10 mt-4">
            
            {/* Brand & Newsletter Column */}
            <div className="flex flex-col gap-y-10">
              <div className="flex flex-col gap-y-6">
                <LocalizedClientLink href="/" className="flex flex-col items-start translate-x-[-1px]">
                    <span className="font-serif text-[24px] text-white leading-tight font-medium tracking-tight">
                      The Blissful Soul
                    </span>
                </LocalizedClientLink>
                <p className="text-white/50 text-[13px] leading-[1.7] max-w-[280px] font-sans">
                  Healing crystals, sessions, and guidance — curated with care in Delhi and online.
                </p>
              </div>

              {/* Newsletter section */}
              <div className="flex flex-col gap-y-5">
                <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-[#C5A059] font-sans">
                  NEWSLETTER
                </span>
                <p className="text-white/40 text-[13px] font-sans">
                  Occasional drops and session openings.
                </p>
                <div className="flex items-center gap-3 max-w-sm mt-1">
                  <input 
                     type="email" 
                     placeholder="Your email" 
                     className="flex-1 bg-white/[0.03] border border-white/10 rounded-full py-3 px-6 text-sm focus:outline-none focus:border-[#C5A059]/50 transition-colors placeholder:text-white/20 font-sans"
                  />
                  <button className="bg-[#C5A059] text-[#120B15] px-8 py-3 rounded-full text-sm font-bold font-sans hover:opacity-90 transition-all shadow-lg active:scale-95">
                    Join
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Column */}
            <div className="flex flex-col gap-y-8">
              <span className="text-[11px] uppercase tracking-[0.5em] font-bold text-[#C5A059] font-sans">
                CONTACT
              </span>
              <div className="flex flex-col gap-y-6 text-[15px] text-white/50 font-sans leading-relaxed">
                 <p className="max-w-[200px] whitespace-pre-line">
                   {contactData?.address || "The Blissful Soul, Shakti Nagar, Delhi 110007"}
                 </p>
                 <p className="tracking-wide text-white/60">
                   {contactData?.phone || "+91 98116 11341"}
                 </p>
                 <p className="break-all opacity-90 text-white/60">
                   {contactData?.email || "theblissfulsoul27@gmail.com"}
                 </p>
              </div>
            </div>

            {/* Explore Column */}
            <div className="flex flex-col gap-y-8">
               <span className="text-[11px] uppercase tracking-[0.5em] font-bold text-[#C5A059] font-sans">
                EXPLORE
              </span>
              <ul className="flex flex-col gap-y-4 text-[15px] text-white/50 font-sans">
                  <li><LocalizedClientLink href="/about" className="hover:text-[#C5A059] transition-colors">About Master</LocalizedClientLink></li>
                  <li><LocalizedClientLink href="/book-session" className="hover:text-[#C5A059] transition-colors">Book a session</LocalizedClientLink></li>
                  <li><LocalizedClientLink href="/store" className="hover:text-[#C5A059] transition-colors">Shop crystals</LocalizedClientLink></li>
                  <li><LocalizedClientLink href="/contact" className="hover:text-[#C5A059] transition-colors">Contact</LocalizedClientLink></li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="flex flex-col justify-between h-full">
              <div className="flex flex-col gap-y-8">
                <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-[#C5A059] font-sans">
                  LEGAL
                </span>
                <ul className="flex flex-col gap-y-4 text-[15px] text-white/50 font-sans">
                    <li><LocalizedClientLink href="/terms" className="hover:text-[#C5A059] transition-colors">Terms</LocalizedClientLink></li>
                    <li><LocalizedClientLink href="/privacy" className="hover:text-[#C5A059] transition-colors">Privacy</LocalizedClientLink></li>
                    <li><LocalizedClientLink href="/refund-policy" className="hover:text-[#C5A059] transition-colors">Refund policy</LocalizedClientLink></li>
                    <li><LocalizedClientLink href="/shipping-policy" className="hover:text-[#C5A059] transition-colors">Shipping policy</LocalizedClientLink></li>
                </ul>
              </div>
              
              {/* Instagram Icon as seen in image */}
              <div className="mt-12 flex items-center gap-x-4">
                 <a href="https://www.instagram.com/pragya.vijh_astrotalks/" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-[#C5A059] hover:text-[#C5A059] transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                 </a>
              </div>
            </div>
          </div>

          {/* Bottom copyright */}
          <div className="pt-10 border-t border-white/5 flex justify-center items-center">
            <p className="text-[11px] text-white/30 font-medium font-sans tracking-[0.2em] text-center uppercase">
              © {new Date().getFullYear()} The Blissful Soul. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
