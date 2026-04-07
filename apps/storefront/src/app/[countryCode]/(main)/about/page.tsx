import { Metadata } from "next"
import Image from "next/image"
import { getAboutPageData } from "@lib/data/strapi"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "About Master Pragya | The Blissful Soul",
  description: "Learn more about Master Pragya Vijh, the founder of The Blissful Soul, a leading expert in astrology and psychology.",
}

const defaultBioPoints = [
  "Master Pragya Vijh has been awarded as the Most Profound Astrologer and Psychologist in Delhi. Being the founder CEO of The blissful Soul, she is a leading expert in optimizing your mental health, emotional fitness and stability in life.",
  "Master Pragya Vijh is a highly sought-after psychologist and tarot reader and has held top positions in organizational setups in Delhi, India having guided more than 25,000 individuals till date.",
  "Her educational background can be well traced from top Universities like University of Delhi and Amity University for her studies of Psychology.",
  "Followed by infinite courses in the astrological field of Reiki healing, Chakra balancing, Tarot courses from worldwide based institutes."
]

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

export default async function AboutPage() {
  const aboutData = await getAboutPageData()
  
  const heroTitle = aboutData?.hero_title || "About The Master"
  const name = aboutData?.name || "Master Pragya Vijh"
  const profileImage = aboutData?.profile_image?.url 
    ? `${STRAPI_URL}${aboutData.profile_image.url}` 
    : "/master-pragya.png"
  
  const bioPoints = aboutData?.bio_points?.length > 0 
    ? aboutData.bio_points.map((bp: any) => bp.text)
    : defaultBioPoints

  const ctaText = aboutData?.cta_text || "Get in Touch"
  const ctaLink = aboutData?.cta_link || "/contact"
  const quote = aboutData?.quote || "Healing is a journey of coming back home to yourself."

  return (
    <div className="bg-[#FBFAF8] min-h-screen relative overflow-hidden">
      {/* Decorative Accents */}
      <div className="absolute top-[20%] right-0 w-[500px] h-[500px] bg-[#C5A059]/5 rounded-full blur-[120px] -mr-64 pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-0 w-[400px] h-[400px] bg-[#2C1E36]/5 rounded-full blur-[100px] -ml-48 pointer-events-none"></div>

      {/* Hero Section */}
      <section className="bg-[#1A0E22] py-16 md:py-20 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none"></div>
        <div className="content-container flex flex-col items-center gap-y-7 relative z-10 animate-in fade-in slide-in-from-top-4 duration-1000">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.6em] font-bold text-[#C5A059] font-sans">
             THE LINEAGE
          </span>
          <div className="flex flex-col gap-y-5 max-w-4xl">
            <h1 className="font-serif text-4xl md:text-[64px] text-white leading-[1.1] font-medium tracking-tight">
              About the <span className="italic font-normal text-[#C5A059]">Master</span>
            </h1>
            <p className="text-white/40 text-base md:text-lg max-w-xl mx-auto leading-relaxed font-sans font-medium">
              A synthesis of psychological depth, cosmic wisdom, and holistic healing — guided by Master Pragya Vijh.
            </p>
          </div>
        </div>
      </section>

      {/* Profile Section */}
      <section className="py-24 md:py-40">
        <div className="content-container">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-16 lg:gap-24">
            {/* Image side */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="relative w-full aspect-[4/5] max-w-md rounded-[2.5rem] overflow-hidden shadow-[0_32px_80px_rgba(44,30,54,0.15)] border-[12px] border-white group">
                <Image 
                  src={profileImage}
                  alt={name}
                  fill 
                  className="object-cover transition-transform duration-[2000ms] group-hover:scale-105" 
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[2.5rem]"></div>
              </div>
            </div>

            {/* Text side */}
            <div className="w-full lg:w-1/2 flex flex-col items-start px-4 md:px-0 animate-in fade-in slide-in-from-right-8 duration-1000">
               <div className="mb-12">
                  <span className="text-[10px] text-[#C5A059] font-bold uppercase tracking-[0.4em] mb-4 block">Biography</span>
                  <h2 className="text-3xl md:text-4xl font-serif text-[#2C1E36] font-medium italic">Meet Pragya Vijh</h2>
                  <div className="w-16 h-0.5 bg-[#C5A059] mt-6"></div>
               </div>

              <div className="space-y-8">
                {bioPoints.map((text: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-6 group">
                    <span className="mt-1.5 w-5 h-5 flex items-center justify-center bg-[#F5F4F0] rounded-full flex-shrink-0 text-[#C5A059] transition-all group-hover:bg-[#2C1E36] group-hover:text-white border border-[#C5A059]/20 shadow-sm">
                       <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    </span>
                    <p className="text-lg leading-relaxed font-sans text-[#665D6B] opacity-90 group-hover:opacity-100 transition-opacity">
                      {text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-16 w-full flex items-center justify-center lg:justify-start gap-8">
                 <LocalizedClientLink href={ctaLink} className="group relative px-14 py-5 bg-[#2C1E36] text-white rounded-full font-bold uppercase tracking-[0.2em] text-[11px] overflow-hidden transition-all shadow-2xl shadow-purple-900/20 active:scale-95">
                    <span className="relative z-10">{ctaText}</span>
                    <div className="absolute inset-0 bg-[#C5A059] translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                 </LocalizedClientLink>
                 <div className="hidden md:block h-px w-24 bg-gradient-to-r from-[#C5A059]/40 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section (Extra Branding) */}
      <section className="py-32 bg-[#2C1E36] relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]"></div>
         <div className="content-container max-w-5xl px-4 relative z-10">
            <div className="flex flex-col items-center text-center">
              <span className="text-[#C5A059] text-5xl font-serif mb-8">&ldquo;</span>
              <h2 className="text-3xl md:text-5xl font-serif italic text-white/90 mb-12 leading-[1.3] max-w-4xl tracking-tight">
                {quote}
              </h2>
              <div className="h-px w-24 bg-[#C5A059]/30" />
            </div>
         </div>
      </section>
    </div>
  )
}
