import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const EmptyCartMessage = () => {
  return (
    <div className="py-24 px-2 flex flex-col justify-center items-center text-center animate-in fade-in zoom-in duration-1000" data-testid="empty-cart-message">
       <div className="w-32 h-32 bg-[#2C1E36]/5 rounded-full flex items-center justify-center text-[#2C1E36] mb-8 relative">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <div className="absolute top-0 right-0 w-8 h-8 bg-[#C5A059] rounded-full border-4 border-white flex items-center justify-center shadow-lg">
             <span className="text-[12px] font-black text-[#2C1E36]">0</span>
          </div>
       </div>
      <Heading
        level="h1"
        className="text-5xl font-serif text-[#2C1E36] font-bold mb-4"
      >
        Your Cart is Empty
      </Heading>
      <div className="w-16 h-1 bg-[#C5A059]/20 mb-6 rounded-full" />
      <Text className="text-base text-gray-400 italic mb-12 max-w-[320px] leading-relaxed">
        Your cart is empty. Browse our collection to find something you love.
      </Text>
      <div>
        <LocalizedClientLink href="/store" className="bg-[#2C1E36] text-white px-12 py-5 rounded-2xl text-[12px] uppercase tracking-[0.25em] font-black hover:bg-[#C5A059] hover:text-[#2C1E36] transition-all shadow-2xl shadow-purple-900/20 active:scale-95 inline-block">
           Browse the Shop
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default EmptyCartMessage
