import { Metadata } from "next"
import WishlistTemplate from "@modules/wishlist/templates"
import { getRegion } from "@lib/data/regions"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Wishlist",
  description: "A sanctuary for your most-loved crystals and healing sessions.",
}

export default async function WishlistPage({ 
  params 
}: { 
  params: Promise<{ countryCode: string }> 
}) {
  const { countryCode } = await params
  const region = await getRegion(countryCode)

  if (!region) {
    return notFound()
  }

  return (
    <WishlistTemplate 
      region={region} 
      countryCode={countryCode} 
    />
  )
}
