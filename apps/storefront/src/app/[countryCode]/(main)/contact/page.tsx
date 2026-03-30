import { Metadata } from "next"
import { getContactPageData } from "@lib/data/strapi"

export const metadata: Metadata = {
  title: "Contact Us | The Blissful Soul",
  description: "Get in touch with us for any questions about our crystals, tarot readings, or healing sessions.",
}

export default async function ContactPage() {
  const contactData = await getContactPageData()

  const formTitle = contactData?.form_title || "Contact Us For Any Questions"
  const mapEmbedUrl = contactData?.map_embed_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.222345091234!2d77.190123456789!3d28.678901234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5862000001%3A0x6e29787d2105156a!2sShakti%20Nagar%2C%20Delhi%2C%20110007!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
  const facebookUrl = contactData?.facebook_url || "https://www.facebook.com/pragyavijh/"
  const instagramUrl = contactData?.instagram_url || "https://www.instagram.com/pragya.vijh_astrotalks/"
  const email = contactData?.email || "theblissfulsoul27@gmail.com"
  const whatsapp = contactData?.whatsapp || "+919811611341"

  return (
    <div className="bg-white min-h-screen">
      {/* Map Section */}
      <section className="w-full h-[450px] bg-pink-50 relative overflow-hidden group">
         <iframe 
            src={mapEmbedUrl}
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: 'grayscale(1) contrast(1.2) opacity(0.8) invert(0.05)' }} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="group-hover:opacity-100 transition-opacity duration-700"
         ></iframe>
         <div className="absolute top-6 left-6 z-10">
            <button className="bg-white/90 backdrop-blur px-4 py-2 rounded shadow-lg text-xs font-bold text-pink-900 flex items-center gap-2 hover:bg-pink-500 hover:text-white transition-all">
               OPEN IN MAPS
               <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </button>
         </div>
      </section>

      {/* Contact Content */}
      <section className="py-24 md:py-32">
        <div className="content-container">
          <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-24">
            
            {/* Form Column */}
            <div className="w-full lg:w-3/5">
              <h2 className="text-2xl md:text-3xl font-serif text-pink-950 mb-12 uppercase tracking-widest">
                {formTitle}
              </h2>
              
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-serif text-pink-900/60 ml-1">Your Name</label>
                    <input type="text" className="w-full bg-white border border-pink-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-200 focus:border-pink-300 outline-none transition-all shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-serif text-pink-900/60 ml-1">Your Email</label>
                    <input type="email" className="w-full bg-white border border-pink-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-200 focus:border-pink-300 outline-none transition-all shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-serif text-pink-900/60 ml-1">Phone Number</label>
                    <input type="tel" className="w-full bg-white border border-pink-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-200 focus:border-pink-300 outline-none transition-all shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-serif text-pink-900/60 ml-1">Company</label>
                    <input type="text" className="w-full bg-white border border-pink-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-200 focus:border-pink-300 outline-none transition-all shadow-sm" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-serif text-pink-900/60 ml-1">Your Message</label>
                  <textarea rows={6} className="w-full bg-white border border-pink-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-200 focus:border-pink-300 outline-none transition-all shadow-sm resize-none"></textarea>
                </div>
                
                <button type="button" className="px-10 py-4 bg-pink-300 text-white rounded-xl font-serif font-bold uppercase tracking-widest hover:bg-pink-400 transition-all shadow-lg hover:shadow-2xl">
                   Ask a Question
                </button>
              </form>
            </div>

            {/* Social Column */}
            <div className="w-full lg:w-2/5 flex flex-col items-start lg:items-center text-left lg:text-center justify-center border-l-0 lg:border-l border-pink-50 lg:pl-24">
                <div className="space-y-4">
                  <p className="font-serif italic text-2xl text-pink-400">Contact Details</p>
                  <div className="text-pink-950 space-y-2 text-sm md:text-base font-serif tracking-wide">
                     <p className="flex items-start gap-2">
                        <span className="font-bold opacity-70">Address:</span> 
                        <span>The Blissful Soul Shakti Nagar, Delhi 110007</span>
                     </p>
                     <p className="flex items-center gap-2">
                        <span className="font-bold opacity-70">Phone:</span>
                        <span>+919811611341</span>
                     </p>
                     <p className="flex items-center gap-2">
                        <span className="font-bold opacity-70">Email:</span>
                        <span>theblissfulsoul27@gmail.com</span>
                     </p>
                  </div>
                </div>

                <div className="space-y-2 mt-12">
                  <p className="font-serif italic text-2xl text-pink-400">Follow us on</p>
                  <h3 className="text-5xl md:text-7xl font-serif text-pink-950">
                     Our <span className="text-pink-300">Channels</span>
                  </h3>
                </div>
               
               <div className="flex flex-wrap gap-4 mt-12">
                  {/* Facebook */}
                  <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-xl border border-pink-200 flex items-center justify-center text-pink-400 hover:bg-pink-400 hover:text-white hover:scale-110 transition-all cursor-pointer shadow-sm">
                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </a>
                  {/* Instagram */}
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-xl border border-pink-200 flex items-center justify-center text-pink-400 hover:bg-pink-400 hover:text-white hover:scale-110 transition-all cursor-pointer shadow-sm">
                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                  {/* Mail */}
                  <a href={`mailto:${email}`} className="w-14 h-14 rounded-xl border border-pink-200 flex items-center justify-center text-pink-400 hover:bg-pink-400 hover:text-white hover:scale-110 transition-all cursor-pointer shadow-sm">
                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </a>
                  {/* WhatsApp */}
                  <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-xl border border-pink-200 flex items-center justify-center text-pink-400 hover:bg-pink-400 hover:text-white hover:scale-110 transition-all cursor-pointer shadow-sm">
                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-14.7 8.38 8.38 0 0 1 3.8.9L21 3v8.5Z"/></svg>
                  </a>
               </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
