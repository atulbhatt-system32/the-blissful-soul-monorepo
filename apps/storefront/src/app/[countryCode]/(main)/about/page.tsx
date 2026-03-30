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
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-[#0A0A0A] py-24 md:py-32 flex items-center justify-center text-center">
        <h1 className="text-white text-5xl md:text-7xl font-serif uppercase tracking-tight">
          {heroTitle}
        </h1>
      </section>

      {/* Profile Section */}
      <section className="py-20 md:py-32">
        <div className="content-container">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
            {/* Image side */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <div className="relative w-full aspect-square max-w-md rounded-2xl overflow-hidden shadow-2xl border-2 border-pink-50">
                <Image 
                  src={profileImage}
                  alt={name}
                  fill 
                  className="object-cover" 
                />
              </div>
            </div>

            {/* Text side */}
            <div className="w-full lg:w-1/2 flex flex-col items-start text-pink-900 px-4 md:px-0">
              <div className="space-y-6">
                {bioPoints.map((text: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-4">
                    <span className="mt-2 w-2 h-2 bg-pink-400 rounded-full flex-shrink-0" />
                    <p className="text-lg leading-relaxed font-serif text-justify">
                      {text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-12 flex items-center gap-6">
                 <LocalizedClientLink href={ctaLink} className="inline-block px-10 py-4 bg-pink-400 text-white rounded-full font-serif font-black uppercase tracking-widest hover:bg-pink-500 transition-all shadow-lg hover:shadow-2xl">
                    {ctaText}
                 </LocalizedClientLink>
                 <div className="h-1 w-20 bg-pink-100 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section (Extra Branding) */}
      <section className="py-20 bg-pink-50/20 text-center">
         <div className="content-container max-w-4xl px-4">
            <h2 className="text-3xl md:text-5xl font-serif italic text-pink-900/40 mb-8 leading-tight line-clamp-4">
               &quot;{quote}&quot;
            </h2>
            <div className="h-0.5 w-16 bg-pink-300 mx-auto" />
         </div>
      </section>
    </div>
  )
}
