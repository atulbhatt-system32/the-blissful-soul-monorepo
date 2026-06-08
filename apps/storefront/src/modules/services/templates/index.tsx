import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getServiceCategories } from "@lib/data/categories"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

const ServicesTemplate = async ({
  countryCode,
  heroTitle,
  heroSubtitle,
  heroImage,
  mobileHeroImage,
  titleColor,
  subtitleColor,
  showHero = true,
}: {
  countryCode: string
  heroTitle?: string
  heroSubtitle?: string
  heroImage?: any
  mobileHeroImage?: any
  titleColor?: string
  subtitleColor?: string
  showHero?: boolean
}) => {
  const categories = await getServiceCategories()
  
  const heroData = heroImage?.data?.attributes || heroImage?.attributes || heroImage || null
  const bannerUrl = heroData?.url
    ? (heroData.url.startsWith("http") ? heroData.url : `${STRAPI_URL}${heroData.url}`)
    : null

  const mobileHeroData = mobileHeroImage?.data?.attributes || mobileHeroImage?.attributes || mobileHeroImage || null
  const mobileBannerUrl = mobileHeroData?.url
    ? (mobileHeroData.url.startsWith("http") ? mobileHeroData.url : `${STRAPI_URL}${mobileHeroData.url}`)
    : null



  return (
    <div className="bg-[#FAF9F6] min-h-screen relative overflow-hidden pb-12 md:pb-0">
      {/* Hero Section (Conditional Text/Image with Mobile Support) */}
      {showHero && (heroTitle || bannerUrl || mobileBannerUrl) && (
        <section className={`relative overflow-hidden ${bannerUrl || mobileBannerUrl ? 'w-full h-auto bg-[#FAF9F6]' : 'bg-[#1A0E22] py-16 md:py-24'} flex flex-col items-center justify-center text-center`}>
          {bannerUrl || mobileBannerUrl ? (
            <div className="w-full h-auto">
               {bannerUrl && (
                  <img
                    src={bannerUrl}
                    alt={heroTitle || "Sacred Services"}
                    className={`w-full h-auto block ${mobileBannerUrl ? 'hidden md:block' : ''}`}
                  />
               )}
               {mobileBannerUrl && (
                  <img
                    src={mobileBannerUrl}
                    alt={heroTitle || "Sacred Services"}
                    className={`w-full h-auto block ${bannerUrl ? 'md:hidden' : ''}`}
                  />
               )}
            </div>
          ) : (
            <>
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none"></div>
              <div className="content-container flex flex-col items-center gap-y-7 relative z-10 animate-in fade-in slide-in-from-top-4 duration-1000">
                <span className="text-[10px] md:text-xs uppercase tracking-[0.6em] font-bold text-[#C5A059] font-sans">
                   SACRED SERVICES
                </span>
                <div className="flex flex-col gap-y-5 max-w-4xl px-4">
                  {heroTitle && (
                    <h1 
                      className="font-serif text-4xl md:text-[64px] text-white leading-[1.1] font-medium tracking-tight uppercase"
                      style={titleColor ? { color: titleColor } : undefined}
                    >
                      {heroTitle.includes(' ') ? (
                        <>
                          {heroTitle.split(' ').slice(0, -1).join(' ')} <span className="italic font-normal text-[#C5A059]">{heroTitle.split(' ').slice(-1)}</span>
                        </>
                      ) : heroTitle}
                    </h1>
                  )}
                  {heroSubtitle && (
                    <p 
                      className="text-white/70 text-base md:text-lg max-w-xl mx-auto leading-relaxed font-sans font-medium"
                      style={subtitleColor ? { color: subtitleColor } : undefined}
                    >
                      {heroSubtitle}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </section>
      )}



      {/* Main Content (Grid of Categories) */}
      <div className="content-container !px-4 md:!px-8 py-12 md:py-20">
        {/* Section Heading */}
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-[#2C1E36] mb-5 uppercase tracking-tighter leading-tight font-medium">
            BOOK OUR SACRED SERVICES
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="h-[1px] w-10 bg-[#C5A059]/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]/50" />
            <div className="h-[1px] w-10 bg-[#C5A059]/30" />
          </div>
        </div>

        {/* Categories Grid (Flip Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {categories.map((category) => {
            const images = (category as any).product_category_images as Array<{ url: string }> | undefined
            const imageUrl = images?.[0]?.url
            const color = (category.metadata?.color as string) || "bg-purple-100"
            const oneLiner = (category.metadata?.["one-liner"] as string) || category.description
            
            return (
              <div key={category.id} className="group h-[220px] md:h-[260px] [perspective:1000px]">
                <div className="relative h-full w-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  
                  {/* Front Side */}
                  <div className="absolute inset-0 h-full w-full rounded-[28px] overflow-hidden border border-black/5 shadow-md [backface-visibility:hidden]">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-purple-50 flex items-center justify-center">
                        <span className="text-4xl text-purple-300">✦</span>
                      </div>
                    )}
                  </div>

                  {/* Back Side */}
                  <div className={`absolute inset-0 h-full w-full rounded-[28px] ${color} border border-[#C5A059]/20 shadow-xl [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col items-center justify-center gap-2 px-4 py-4 text-center`}>
                    <div className="flex gap-1 mb-1">
                      <span className="w-1 h-1 rounded-full bg-[#C5A059]/50" />
                      <span className="w-1 h-1 rounded-full bg-[#C5A059]/30" />
                      <span className="w-1 h-1 rounded-full bg-[#C5A059]/50" />
                    </div>
                    <h3 className="text-sm md:text-base font-bold text-[#2C1E36] uppercase tracking-[0.18em] leading-tight">
                      {category.name}
                    </h3>
                    <div className="w-8 h-[1px] bg-[#C5A059]/50" />
                    {oneLiner && (
                      <p className="text-[#665D6B] text-[12px] md:text-[13px] leading-snug font-medium max-w-[90%]">
                        {oneLiner}
                      </p>
                    )}
                    <LocalizedClientLink
                      href={`/services/${category.handle}`}
                      className="mt-1 px-6 py-2 bg-[#C5A059] text-white rounded-full font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-[#C5A059]/25 hover:bg-[#B38E4A] hover:shadow-xl transition-all active:scale-95"
                    >
                      Book Now
                    </LocalizedClientLink>
                  </div>

                </div>
              </div>
            )
          })}
        </div>
      </div>


    </div>
  )
}

export default ServicesTemplate
