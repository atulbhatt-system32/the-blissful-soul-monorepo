import { Metadata } from "next"
import { getContactPageData } from "@lib/data/strapi"
import ContactForm from "@modules/contact/components/contact-form"

export const metadata: Metadata = {
  title: "Contact",
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

      {/* Contact Content */}
      <section className="py-24 md:py-32 relative overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C5A059]/5 rounded-full blur-3xl -mr-64 -mt-64"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#2C1E36]/5 rounded-full blur-3xl -ml-64 -mb-64"></div>
        
        <div className="content-container relative z-10">
          <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-32">
            
            {/* Form Column */}
            <div className="w-full lg:w-3/5 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="mb-16">
                <span className="text-[10px] text-[#C5A059] font-bold uppercase tracking-[0.5em] mb-6 block">Get in Touch</span>
                <h2 className="text-4xl md:text-6xl font-serif text-[#2C1E36] uppercase tracking-tight leading-[1.1]">
                   {formTitle.split(' ').map((word: string, i: number) => (
                     <span key={i} className={i % 2 === 1 ? 'italic font-normal text-[#C5A059] ml-2' : ''}>{word} </span>
                   ))}
                </h2>
                <div className="h-1 w-20 bg-[#C5A059] mt-8 rounded-full"></div>
              </div>
              
              <ContactForm />
            </div>

             {/* Social & Info Column */}
            <div className="w-full lg:w-2/5 flex flex-col items-start lg:pl-16 mt-20 lg:mt-0">
                <div className="space-y-12 w-full">
                  <div className="text-[#2C1E36] space-y-12 font-sans">
                     <div className="space-y-4 group">
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059] group-hover:translate-x-1 transition-transform block">Location</span>
                        <p className="text-2xl font-serif text-[#2C1E36] leading-relaxed italic opacity-80 whitespace-pre-line group-hover:opacity-100 transition-opacity">
                           {contactData?.address || "Shakti Nagar,\nDelhi 110007"}
                        </p>
                     </div>
                     
                     <div className="flex flex-col gap-10 pt-12 border-t border-[#2C1E36]/5">
                        <div className="space-y-3 group">
                           <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059] group-hover:translate-x-1 transition-transform block">Contact</span>
                           <p className="text-xl font-serif italic text-[#2C1E36]">{contactData?.phone || "+91 98116 11341"}</p>
                           <p className="text-sm font-sans opacity-60 hover:opacity-100 transition-opacity cursor-pointer">{email}</p>
                        </div>

                        <div className="space-y-6 pt-12 border-t border-[#2C1E36]/5">
                          <h3 className="text-4xl font-serif text-[#2C1E36] leading-tight active-state">
                             Follow Us <br/> <span className="text-[#C5A059] italic font-normal">On Social</span>
                          </h3>
                          
                          <div className="flex flex-wrap gap-5 mt-8">
                            {[
                              { icon: 'instagram', url: instagramUrl },
                              { icon: 'whatsapp', url: `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}` },
                              { icon: 'facebook', url: facebookUrl },
                              { icon: 'mail', url: `mailto:${email}` }
                            ].map((social, i) => (
                              <a 
                                key={i}
                                href={social.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="w-14 h-14 rounded-full border border-[#2C1E36]/5 bg-white flex items-center justify-center text-[#2C1E36] hover:bg-[#2C1E36] hover:text-white hover:scale-110 transition-all shadow-lg shadow-purple-900/5 group"
                              >
                                {social.icon === 'instagram' && <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>}
                                {social.icon === 'whatsapp' && <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03a11.984 11.984 0 001.594 6.06L0 24l6.105-1.603a11.96 11.96 0 005.937 1.57h.005c6.637 0 12.032-5.396 12.035-12.032a11.82 11.82 0 00-3.52-8.509z"/></svg>}
                                {social.icon === 'facebook' && <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>}
                                {social.icon === 'mail' && <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>}
                              </a>
                            ))}
                          </div>
                        </div>
                     </div>
                  </div>
                </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
