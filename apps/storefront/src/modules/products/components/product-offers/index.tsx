import { Gift, ShoppingCart, Tag } from "@medusajs/icons"
import { Text } from "@medusajs/ui"

interface ProductOffersProps {
  storeConfig?: any
}

const ProductOffers = ({ storeConfig }: { storeConfig?: any }) => {
  const structuredOffers = storeConfig?.product_offers || []
  
  if (structuredOffers.length === 0) return null

  const getOfferMeta = (type: string, index: number) => {
    const metas: Record<string, { color: string, icon: any }> = {
      gift: { color: "border-orange-500", icon: <Gift style={{ width: 18, height: 18 }} className="text-[#2C1E36]" /> },
      discount: { color: "border-emerald-500", icon: <ShoppingCart style={{ width: 18, height: 18 }} className="text-[#2C1E36]" /> },
      shipping: { color: "border-blue-500", icon: <ShoppingCart style={{ width: 18, height: 18 }} className="text-[#2C1E36]" /> },
      tag: { color: "border-[#C5A059]", icon: <Tag style={{ width: 18, height: 18 }} className="text-[#2C1E36]" /> }
    }
    
    // Fallback to rotating colors if type is unknown
    if (!metas[type]) {
       const keys = Object.keys(metas)
       return metas[keys[index % keys.length]]
    }
    
    return metas[type]
  }
  
  return (
    <div className="flex flex-col gap-y-5 py-8 border-t border-[#C5A059]/10 mt-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2.5">
          <div className="bg-[#C5A059]/10 p-1.5 rounded-lg">
            <Tag className="text-[#C5A059]" style={{ width: 14, height: 14 }} />
          </div>
          <span className="text-[11px] uppercase tracking-[0.25em] font-black text-[#C5A059]">
            Exclusive Offers
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {structuredOffers.map((offer: any, index: number) => {
          const { color, icon } = getOfferMeta(offer.type, index)

          return (
            <div 
              key={index} 
              className={`flex items-start gap-x-3 bg-[#F8FAFC] p-4 rounded-[12px] border-l-4 ${color} transition-all duration-300 hover:shadow-md hover:bg-white`}
            >
              <div className="flex items-center justify-center pt-0.5">
                {icon}
              </div>
              
              <div className="flex flex-col gap-y-0.5">
                <Text className="text-[14px] text-[#2C1E36] font-bold leading-tight">
                  {offer.title}
                </Text>
                {offer.subtitle && (
                  <Text className="text-[12px] text-[#2C1E36]/60 font-medium leading-normal">
                    {offer.subtitle}
                  </Text>
                )}
                {!offer.subtitle && (
                   <Text className="text-[11px] text-[#2C1E36]/50 font-medium italic">
                     Automatically applied
                   </Text>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}



export default ProductOffers
