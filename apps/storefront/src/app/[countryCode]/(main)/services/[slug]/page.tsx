import { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Service data - in a real app, this would come from a CMS or database
const serviceData: Record<string, {
  title: string
  description: string
  images: string[]
  packages: Array<{
    name: string
    features: string[]
    price: string
    duration: string
    isUrgent?: boolean
  }>
}> = {
  "kundli": {
    title: "Kundli Reading",
    description: "Unlock the secrets of your destiny with a deep dive into your Vedic birth chart, revealing your true purpose and cosmic roadmap. Our expert astrologer analyzes your birth chart to provide insights into your personality, strengths, challenges, and life path.",
    images: ["/service-kundli.png"],
    packages: [
      {
        name: "Regular Phone Call Session",
        features: ["Detailed chart analysis", "Future predictions", "Q&A session", "By prior appointment only"],
        price: "₹2,999",
        duration: "30 minutes"
      },
      {
        name: "Comprehensive Reading",
        features: ["In-depth analysis of all life aspects", "Remedies & guidance", "Extended Q&A", "Personalized life roadmap"],
        price: "₹4,999",
        duration: "60 minutes"
      },
      {
        name: "Urgent Call Session",
        features: ["Priority scheduling", "Detailed life path guidance", "Immediate remedies", "Conducted on urgent basis"],
        price: "₹6,999",
        duration: "45 minutes",
        isUrgent: true
      }
    ]
  },
  "astrology": {
    title: "Kundli & Tarot",
    description: "Experience the combined power of birth chart wisdom and tarot intuition for a comprehensive understanding of your life's path. This unique session combines Vedic astrology with intuitive tarot readings to provide dual perspectives.",
    images: ["/kundli-and-traot.png"],
    packages: [
      {
        name: "Regular Phone Call Session",
        features: ["Combined chart & card reading", "Intuitive guidance", "Key life insights", "By prior appointment only"],
        price: "₹3,999",
        duration: "45 minutes"
      },
      {
        name: "Deep Insight Session",
        features: ["Extended astrological analysis", "Multiple tarot spreads", "Future roadmap", "Remedies & solutions"],
        price: "₹5,999",
        duration: "75 minutes"
      },
      {
        name: "Urgent Call Session",
        features: ["Fast-tracked booking", "Intensive dual analysis", "Immediate clarity", "Conducted on urgent basis"],
        price: "₹7,999",
        duration: "60 minutes",
        isUrgent: true
      }
    ]
  },
  "tarot": {
    title: "Tarot Card Reading",
    description: "Tarot card reading is an ancient practice that uses a deck of cards to gain insight and guidance on life's questions and challenges. Each card in the deck represents a different archetypal energy, and the combination of cards drawn for a reading can provide a rich and nuanced perspective on any given situation.",
    images: ["/service-tarot.png"],
    packages: [
      {
        name: "Regular Phone Call Session",
        features: ["Unlimited questions till 20 mins", "Questions related to one person only", "By prior appointment only"],
        price: "₹6,500",
        duration: "20 minutes"
      },
      {
        name: "Regular phone Call Session",
        features: ["Unlimited questions till 30 mins", "Questions related to two people", "By prior appointment only"],
        price: "₹11,000",
        duration: "30 minutes"
      },
      {
        name: "Urgent Phone Call Session",
        features: ["Unlimited questions till 30 mins", "Questions related to two people", "Session will be conducted on urgent basis"],
        price: "₹15,000",
        duration: "30 minutes",
        isUrgent: true
      }
    ]
  },
  "counseling": {
    title: "Psychological Counseling",
    description: "Find emotional peace and spiritual clarity through heart-centered guidance tailored to your unique personal journey. Our holistic counseling approach combines spiritual wisdom with practical psychological support.",
    images: ["/service-counseling.png"],
    packages: [
      {
        name: "Regular Session",
        features: ["One-on-one counseling", "Safe, non-judgmental space", "Emotional support", "By prior appointment only"],
        price: "₹2,499",
        duration: "45 minutes"
      },
      {
        name: "Deep Healing Session",
        features: ["Intensive emotional work", "Practical coping tools", "Spiritual guidance", "Personal growth roadmap"],
        price: "₹4,499",
        duration: "90 minutes"
      },
      {
        name: "Urgent Support Session",
        features: ["Immediate availability", "Crisis support & guidance", "Focused resolution", "Conducted on urgent basis"],
        price: "₹5,999",
        duration: "60 minutes",
        isUrgent: true
      }
    ]
  },
  "healing": {
    title: "Reiki Healing",
    description: "Restore your inner balance and vitality through powerful energy work, reiki, and sacred crystal healing therapy. Experience the transformative power of energy healing to release blockages and restore flow.",
    images: ["/service-healing.png"],
    packages: [
      {
        name: "Regular Healing Session",
        features: ["Energy balancing", "Blockage release", "Deep relaxation", "By prior appointment only"],
        price: "₹2,999",
        duration: "45 minutes"
      },
      {
        name: "Chakra Alignment",
        features: ["Full chakra balancing", "Crystal healing therapy", "Aura cleansing", "Post-session guidance"],
        price: "₹4,999",
        duration: "75 minutes"
      },
      {
        name: "Urgent Energy Work",
        features: ["Immediate energetic support", "Intensive blockage clearing", "Vitality boost", "Conducted on urgent basis"],
        price: "₹6,499",
        duration: "60 minutes",
        isUrgent: true
      }
    ]
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
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-[#FDF2F4] py-16 md:py-24">
        <div className="content-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side content */}
            <div className="max-w-xl">
              <span className="text-[12px] md:text-sm uppercase tracking-[0.4em] font-bold text-primary font-sans block mb-4">
                SERVICE
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#2C1E36] leading-tight font-bold mb-8">
                {service.title}
              </h1>
              <p className="text-[#665D6B] text-base md:text-lg font-sans leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Right side image */}
            <div className="relative aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl">
              <Image
                src={service.images[0]}
                alt={service.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Packages Section */}
      <div className="py-20 md:py-32 bg-white">
        <div className="content-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {service.packages.map((pkg, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col h-full bg-white rounded-3xl p-8 shadow-[0_10px_50px_rgba(0,0,0,0.05)] border ${pkg.isUrgent ? 'border-primary/20 scale-105 relative z-10' : 'border-black/5'} transition-all hover:shadow-2xl`}
              >
                {pkg.isUrgent && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest py-1 px-4 rounded-full">
                    Recommended
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="font-serif text-2xl text-[#2C1E36] mb-6 min-h-[64px] flex items-center justify-center">
                    {pkg.name}
                  </h3>
                  
                  <ul className="space-y-4 mb-10 text-left">
                    {pkg.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3 text-[#665D6B] text-sm">
                        <span className="text-primary mt-1">✦</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-8 border-t border-black/5 text-center">
                  <div className="mb-6">
                    <span className="text-[#2C1E36] text-2xl font-bold block mb-1">
                      {pkg.price}
                    </span>
                    <span className="text-[#665D6B] text-xs uppercase tracking-widest">
                      FOR {pkg.duration}
                    </span>
                  </div>

                  <LocalizedClientLink
                    href={`/${countryCode}/book-session`}
                    className={`inline-flex items-center justify-center w-full px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] transition-all active:scale-95 ${
                      pkg.isUrgent 
                        ? 'bg-[#1A0E22] text-white hover:bg-black shadow-xl' 
                        : 'bg-white border-2 border-[#1A0E22] text-[#1A0E22] hover:bg-[#1A0E22] hover:text-white'
                    }`}
                  >
                    <span className="mr-2">✦</span>
                    Book Now
                  </LocalizedClientLink>
                </div>
              </div>
            ))}
          </div>

          {/* GST Disclaimer */}
          <div className="mt-20 text-center">
            <p className="text-[#C5A059] text-[11px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
              All the above mentioned charges are inclusive of 18% GST
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
