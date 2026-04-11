import { getContactPageData } from "@lib/data/strapi"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  const contactData = await getContactPageData()

  return (
    <footer className="w-full">
      <div className="bg-[#120B15] border-t border-white/5 w-full pt-8 md:pt-10 pb-8">
        <div className="content-container flex flex-col w-full text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-12 gap-y-12 md:gap-y-16 mb-8 md:mb-10 mt-4">
            
            {/* Brand Column */}
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
                </ul>
              </div>
              
               {/* Social Icons */}
               <div className="mt-8 md:mt-12 flex items-center gap-x-3">
                  {/* Instagram */}
                  <a href={contactData?.instagram_url || "https://www.instagram.com/pragya.vijh_astrotalks/"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-[#C5A059] hover:text-[#C5A059] transition-all">
                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                  {/* WhatsApp */}
                  <a href={`https://wa.me/${(contactData?.whatsapp || "+919811611341").replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-[#C5A059] hover:text-[#C5A059] transition-all">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03a11.984 11.984 0 001.594 6.06L0 24l6.105-1.603a11.96 11.96 0 005.937 1.57h.005c6.637 0 12.032-5.396 12.035-12.032a11.82 11.82 0 00-3.52-8.509z"/></svg>
                  </a>
                  {/* Facebook */}
                  <a href={contactData?.facebook_url || "https://www.facebook.com/pragyavijh/"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-[#C5A059] hover:text-[#C5A059] transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </a>
                  {/* Mail */}
                  <a href={`mailto:${contactData?.email || "theblissfulsoul27@gmail.com"}`} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-[#C5A059] hover:text-[#C5A059] transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
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
