import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import MedusaCTA from "@modules/layout/components/medusa-cta"
import { Text } from "@medusajs/ui"
import Image from "next/image"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full bg-white relative small:min-h-screen">
      <div className="h-16 bg-white border-b ">
        <nav className="flex h-full items-center content-container justify-between">
          <LocalizedClientLink
            href="/cart"
            className="text-[10px] uppercase tracking-[0.2em] font-black text-[#C5A059] flex items-center gap-x-2 group hover:text-[#2C1E36] transition-all"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90 group-hover:-translate-x-1 transition-transform" size={14} />
            <span>Back</span>
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/"
            className="flex flex-col items-center"
            data-testid="store-link"
          >
            <Image 
              src="/logo.png" 
              alt="The Blissful Soul" 
              width={180} 
              height={60} 
              className="h-10 w-auto md:h-12"
            />
          </LocalizedClientLink>
          
          <div className="flex-1 basis-0" />
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">{children}</div>
      <div className="py-4 w-full flex items-center justify-center">
        <Text className="flex gap-x-2 txt-compact-small-plus items-center text-[#2C1E36]/30 uppercase tracking-[0.2em] font-bold text-[10px]">
          © {new Date().getFullYear()} The Blissful Soul
        </Text>
      </div>
    </div>
  )
}
