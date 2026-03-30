import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"
import Image from "next/image"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="bg-white border-t border-pink-100 w-full pt-20 pb-10">
      <div className="content-container flex flex-col w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          {/* Brand Info */}
          <div className="flex flex-col gap-y-6">
            <LocalizedClientLink href="/" className="flex items-center">
               <Image src="/logo.png" alt="The Blissful Soul" width={180} height={70} className="object-contain" />
            </LocalizedClientLink>
            <p className="text-pink-800/70 text-sm leading-relaxed max-w-xs font-serif italic text-justify px-2 line-clamp-4">
              Your soulful destination for crystals, tarot, and holistic healing. Embrace the energy of the universe with our curated spiritual collections.
            </p>
            <div className="flex items-center gap-x-4">
               {/* Social links */}
               <a href="https://www.instagram.com/pragya.vijh_astrotalks/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 hover:bg-pink-500 hover:text-white transition-all shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
               </a>
               <a href="https://www.facebook.com/pragyavijh/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 hover:bg-pink-500 hover:text-white transition-all shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
               </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-y-6">
            <span className="font-serif text-lg font-bold text-pink-900 uppercase tracking-widest">
              Quick Links
            </span>
            <ul className="flex flex-col gap-y-3 text-sm text-pink-800/80">
                <li><LocalizedClientLink href="/" className="hover:text-pink-500 transition-colors">Home</LocalizedClientLink></li>
                <li><LocalizedClientLink href="/about" className="hover:text-pink-500 transition-colors">About Master</LocalizedClientLink></li>
                <li><LocalizedClientLink href="/book-session" className="hover:text-pink-500 transition-colors">Book Your Service</LocalizedClientLink></li>
                <li><LocalizedClientLink href="/store" className="hover:text-pink-500 transition-colors">Shop Now</LocalizedClientLink></li>
                <li><a href="https://www.instagram.com/pragya.vijh_astrotalks/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors">Instagram</a></li>
                <li><a href="https://www.facebook.com/pragyavijh/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors">Facebook</a></li>
                <li><LocalizedClientLink href="/contact" className="hover:text-pink-500 transition-colors">Contact Us</LocalizedClientLink></li>
            </ul>
          </div>

          {/* Shop Categories */}
          <div className="flex flex-col gap-y-6">
             <span className="font-serif text-lg font-bold text-pink-900 uppercase tracking-widest">
              Shop Categories
            </span>
            <ul className="flex flex-col gap-y-3 text-sm text-pink-800/80">
               {productCategories?.slice(0, 5).map(c => (
                 <li key={c.id}>
                    <LocalizedClientLink href={`/categories/${c.handle}`} className="hover:text-pink-500 transition-colors">
                      {c.name}
                    </LocalizedClientLink>
                 </li>
               ))}
            </ul>
          </div>

          {/* Contact info */}
          <div className="flex flex-col gap-y-6">
             <span className="font-serif text-lg font-bold text-pink-900 uppercase tracking-widest">
              Contact Us
            </span>
            <div className="flex flex-col gap-y-4 text-sm text-pink-800/80">
               <div className="flex items-start gap-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <span>Phone: +919811611341</span>
               </div>
               <div className="flex items-start gap-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-400"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  <span>Email: theblissfulsoul27@gmail.com</span>
               </div>
               <div className="flex items-start gap-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-400"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>The Blissful Soul Shakti Nagar, Delhi 110007</span>
               </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-pink-100 flex flex-col md:flex-row justify-between items-center gap-y-4">
          <Text className="text-xs text-pink-800/60 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-full px-2">
            © {new Date().getFullYear()} The Blissful Soul. All rights reserved.
          </Text>
          <div className="flex items-center gap-x-6 text-xs text-pink-800/60 font-medium">
             <LocalizedClientLink href="/terms" className="hover:text-pink-500 transition-colors">Terms of Service</LocalizedClientLink>
             <LocalizedClientLink href="/privacy" className="hover:text-pink-500 transition-colors">Privacy Policy</LocalizedClientLink>
          </div>
        </div>
      </div>
    </footer>
  )
}

