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
    <div className="bg-[#FBFAF8] min-h-screen">
      {/* Map Section */}
      <section className="w-full h-[500px] bg-[#2C1E36]/5 relative overflow-hidden group">
         <iframe 
            src={mapEmbedUrl}
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: 'grayscale(1) contrast(1.1) brightness(0.9) invert(0.05)' }} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="group-hover:opacity-100 transition-opacity duration-1000 ease-out"
         ></iframe>
         <div className="absolute top-8 left-8 z-10 animate-in fade-in slide-in-from-left-4 duration-700">
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("The Blissful Soul Shakti Nagar Delhi")}`}
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-[#2C1E36] text-white px-6 py-3 rounded-full shadow-2xl text-[10px] font-bold tracking-[0.2em] flex items-center gap-3 hover:bg-[#C5A059] transition-all transform hover:-translate-y-1"
            >
               FIND US ON MAPS
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
         </div>
      </section>

      {/* Contact Content */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2C1E36]/5 rounded-full blur-3xl -ml-48 -mb-48"></div>
        
        <div className="content-container relative z-10">
          <div className="flex flex-col lg:flex-row justify-between gap-20 lg:gap-32">
            
            {/* Form Column */}
            <div className="w-full lg:w-3/5 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="mb-12">
                <span className="text-[10px] text-[#C5A059] font-bold uppercase tracking-[0.4em] mb-4 block">Get in Touch</span>
                <h2 className="text-4xl md:text-5xl font-serif text-[#2C1E36] uppercase tracking-tight leading-tight">
                  {formTitle}
                </h2>
              </div>
              
              <form className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                  <div className="space-y-3 group">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#2C1E36]/40 ml-1 transition-colors group-focus-within:text-[#C5A059]">Your Name</label>
                    <input type="text" className="w-full bg-white border-b border-[#2C1E36]/10 px-1 py-3 focus:border-[#C5A059] outline-none transition-all font-sans text-[#2C1E36] placeholder:text-gray-300" placeholder="Apurv..." />
                  </div>
                  <div className="space-y-3 group">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#2C1E36]/40 ml-1 transition-colors group-focus-within:text-[#C5A059]">Email Address</label>
                    <input type="email" className="w-full bg-white border-b border-[#2C1E36]/10 px-1 py-3 focus:border-[#C5A059] outline-none transition-all font-sans text-[#2C1E36] placeholder:text-gray-300" placeholder="your@email.com" />
                  </div>
                  <div className="space-y-3 group">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#2C1E36]/40 ml-1 transition-colors group-focus-within:text-[#C5A059]">Phone Number</label>
                    <input type="tel" className="w-full bg-white border-b border-[#2C1E36]/10 px-1 py-3 focus:border-[#C5A059] outline-none transition-all font-sans text-[#2C1E36] placeholder:text-gray-300" placeholder="+91..." />
                  </div>
                  <div className="space-y-3 group">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#2C1E36]/40 ml-1 transition-colors group-focus-within:text-[#C5A059]">Regarding</label>
                    <input type="text" className="w-full bg-white border-b border-[#2C1E36]/10 px-1 py-3 focus:border-[#C5A059] outline-none transition-all font-sans text-[#2C1E36] placeholder:text-gray-300" placeholder="Healing session..." />
                  </div>
                </div>
                
                <div className="space-y-3 group">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#2C1E36]/40 ml-1 transition-colors group-focus-within:text-[#C5A059]">Your Message</label>
                  <textarea rows={4} className="w-full bg-white border-b border-[#2C1E36]/10 px-1 py-3 focus:border-[#C5A059] outline-none transition-all font-sans text-[#2C1E36] placeholder:text-gray-300 resize-none" placeholder="How can we help your journey?"></textarea>
                </div>
                
                <button type="button" className="px-14 py-5 bg-[#2C1E36] text-white rounded-full font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-[#3D2B4A] transition-all shadow-2xl shadow-purple-900/20 hover:-translate-y-1 active:scale-95">
                   Send Message
                </button>
              </form>
            </div>

             {/* Social Column */}
            <div className="w-full lg:w-2/5 flex flex-col items-start lg:items-center text-left lg:text-center justify-start lg:pl-16">
                <div className="space-y-8 w-full max-w-sm">
                  <div className="text-[#2C1E36] space-y-8 font-sans">
                     <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059] mb-2 block">Location</span>
                        <p className="text-xl font-serif text-[#2C1E36] leading-relaxed italic opacity-80 whitespace-pre-line">
                           {contactData?.address || "Shakti Nagar, Delhi 110007"}
                        </p>
                     </div>
                     
                     <div className="flex flex-col lg:items-center gap-6 pt-4 border-t border-[#2C1E36]/5">
                       <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059] mb-1 block">Quick Connect</span>
                          <p className="text-lg font-serif italic text-[#2C1E36]">{contactData?.phone || "+91 98116 11341"}</p>
                          <p className="text-sm font-sans opacity-60">{email}</p>
                       </div>
                     </div>
                  </div>
                </div>

                <div className="space-y-6 mt-20 w-full text-left lg:text-center">
                  <h3 className="text-4xl md:text-5xl font-serif text-[#2C1E36] leading-tight">
                     Join Our <span className="text-[#C5A059] italic font-normal">Spirit</span>
                  </h3>
                </div>
               
               <div className="flex flex-wrap lg:justify-center gap-4 mt-10">
                  {/* Instagram */}
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="w-16 h-16 rounded-full border border-[#2C1E36]/10 flex items-center justify-center text-[#2C1E36] hover:bg-[#2C1E36] hover:text-white hover:scale-110 transition-all cursor-pointer shadow-xl shadow-purple-900/5 group">
                    <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                  {/* WhatsApp */}
                  <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-16 h-16 rounded-full border border-[#2C1E36]/10 flex items-center justify-center text-[#2C1E36] hover:bg-[#2C1E36] hover:text-white hover:scale-110 transition-all cursor-pointer shadow-xl shadow-purple-900/5 group">
                    <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03a11.984 11.984 0 001.594 6.06L0 24l6.105-1.603a11.96 11.96 0 005.937 1.57h.005c6.637 0 12.032-5.396 12.035-12.032a11.82 11.82 0 00-3.52-8.509z"/></svg>
                  </a>
                  {/* Facebook */}
                  <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="w-16 h-16 rounded-full border border-[#2C1E36]/10 flex items-center justify-center text-[#2C1E36] hover:bg-[#2C1E36] hover:text-white hover:scale-110 transition-all cursor-pointer shadow-xl shadow-purple-900/5 group">
                    <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </a>
                  {/* Mail */}
                  <a href={`mailto:${email}`} className="w-16 h-16 rounded-full border border-[#2C1E36]/10 flex items-center justify-center text-[#2C1E36] hover:bg-[#2C1E36] hover:text-white hover:scale-110 transition-all cursor-pointer shadow-xl shadow-purple-900/5 group">
                    <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </a>
               </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
