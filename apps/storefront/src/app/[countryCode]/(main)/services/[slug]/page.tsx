import { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Service data - in a real app, this would come from a CMS or database
const serviceData: Record<string, {
  title: string
  description: string
  fullDescription: string[]
  images: string[]
  price: string
  duration: string
}> = {
  "kundli": {
    title: "Kundli Reading",
    description: "Personalised Vedic birth chart analysis and future predictions",
    fullDescription: [
      "Unlock the secrets of your destiny with a deep dive into your Vedic birth chart, revealing your true purpose and cosmic roadmap.",
      "Our expert astrologer analyzes your birth chart to provide insights into your personality, strengths, challenges, and life path.",
      "Discover the influence of planetary positions on various aspects of your life including career, relationships, health, and spirituality.",
      "Get personalized remedies and guidance to overcome obstacles and enhance positive influences in your life."
    ],
    images: ["/service-kundli.png"],
    price: "₹2,999",
    duration: "60 mins"
  },
  "astrology": {
    title: "Kundli & Tarot",
    description: "Experience the combined power of birth chart wisdom and tarot intuition",
    fullDescription: [
      "Experience the combined power of birth chart wisdom and tarot intuition for a comprehensive understanding of your life's path.",
      "This unique session combines Vedic astrology with intuitive tarot readings to provide dual perspectives on your questions.",
      "Get detailed analysis of your planetary positions along with tarot card insights for immediate guidance.",
      "Perfect for those seeking both traditional astrological wisdom and intuitive card readings."
    ],
    images: ["/kundli-and-traot.png"],
    price: "₹3,999",
    duration: "90 mins"
  },
  "tarot": {
    title: "Tarot Reading",
    description: "Receive clear, intuitive answers to your most pressing questions",
    fullDescription: [
      "Receive clear, intuitive answers to your most pressing questions through the mystical and divine guidance of the Tarot.",
      "Our skilled tarot reader uses ancient wisdom to provide insights into love, career, health, and spiritual growth.",
      "Each session is personalized to address your specific concerns and provide actionable guidance.",
      "Discover what the cards reveal about your past, present, and potential future paths."
    ],
    images: ["/service-tarot.png"],
    price: "₹1,999",
    duration: "45 mins"
  },
  "counseling": {
    title: "Counseling",
    description: "Find emotional peace and spiritual clarity through heart-centered guidance",
    fullDescription: [
      "Find emotional peace and spiritual clarity through heart-centered guidance tailored to your unique personal journey.",
      "Our holistic counseling approach combines spiritual wisdom with practical psychological support.",
      "Work through emotional blocks, relationship issues, career challenges, and personal growth obstacles.",
      "Receive compassionate guidance and practical tools to navigate life's transitions with grace."
    ],
    images: ["/service-counseling.png"],
    price: "₹2,499",
    duration: "60 mins"
  },
  "healing": {
    title: "Healing",
    description: "Restore your inner balance and vitality through powerful energy work",
    fullDescription: [
      "Restore your inner balance and vitality through powerful energy work, reiki, and sacred crystal healing therapy.",
      "Experience the transformative power of energy healing to release blockages and restore flow in your body and mind.",
      "Our healing sessions combine Reiki, crystal therapy, and intuitive energy work for holistic wellness.",
      "Feel the shift as stagnant energy is cleared and replaced with revitalizing, healing energy."
    ],
    images: ["/service-healing.png"],
    price: "₹2,999",
    duration: "75 mins"
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const service = serviceData[slug]
  
  if (!service) {
    return {
      title: "Service Not Found"
    }
  }

  return {
    title: `${service.title} | The Blissful Soul`,
    description: service.description,
  }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string; countryCode: string }> }) {
  const { slug, countryCode } = await params
  const service = serviceData[slug]

  if (!service) {
    notFound()
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      {/* Header */}
      <div className="bg-[#1A0E22] py-16 md:py-24">
        <div className="content-container">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold text-[#C5A059] font-sans block mb-4">
              Service
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight font-semibold mb-6">
              {service.title}
            </h1>
            <p className="text-white/60 text-lg md:text-xl font-sans leading-relaxed max-w-2xl mx-auto">
              {service.description}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 md:py-24">
        <div className="content-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            
            {/* Left Side - Description */}
            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-black/5">
                <h2 className="font-serif text-2xl md:text-3xl text-[#2C1E36] mb-6">
                  About This Service
                </h2>
                <div className="space-y-4">
                  {service.fullDescription.map((paragraph, index) => (
                    <p key={index} className="text-[#665D6B] text-base leading-relaxed font-sans">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Service Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C5A059] font-sans block mb-2">
                    Duration
                  </span>
                  <span className="text-[#2C1E36] text-lg font-serif font-semibold">
                    {service.duration}
                  </span>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C5A059] font-sans block mb-2">
                    Price
                  </span>
                  <span className="text-[#2C1E36] text-lg font-serif font-semibold">
                    {service.price}
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <LocalizedClientLink
                href={`/${countryCode}/book-session`}
                className="inline-block w-full sm:w-auto px-8 py-4 bg-[#C5A059] text-white rounded-full text-sm font-bold uppercase tracking-[0.2em] shadow-lg hover:shadow-xl hover:bg-[#B38E4A] transition-all active:scale-95 text-center"
              >
                Book Now
              </LocalizedClientLink>
            </div>

            {/* Right Side - Images */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F5F4F0]">
                  <Image
                    src={service.images[0]}
                    alt={service.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              
              {/* Additional Info Card */}
              <div className="bg-[#2C1E36] rounded-3xl p-8 text-white">
                <h3 className="font-serif text-xl mb-4">What to Expect</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-[#C5A059] mt-1">✓</span>
                    <span className="text-white/80 text-sm">Personalized one-on-one session</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#C5A059] mt-1">✓</span>
                    <span className="text-white/80 text-sm">Detailed analysis and guidance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#C5A059] mt-1">✓</span>
                    <span className="text-white/80 text-sm">Practical remedies and solutions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#C5A059] mt-1">✓</span>
                    <span className="text-white/80 text-sm">Confidential and safe space</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
