import { Heading } from "@medusajs/ui"
import { cookies as nextCookies } from "next/headers"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import { HttpTypes } from "@medusajs/types"
import SessionBooking from "@modules/order/components/session-booking"
import GuestAutoRegister from "@modules/order/components/guest-auto-register"
import { retrieveCustomer } from "@lib/data/customer"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"
  const customer = await retrieveCustomer()

  // Check if order contains a session
  const sessionItems = order.items?.filter((item: any) => {
    const product = item.variant?.product
    return (
      product?.type?.value === "session" || 
      product?.tags?.some((t: any) => t.value === "session") ||
      product?.metadata?.is_service === true ||
      product?.metadata?.is_service === "true"
    )
  })

  const hasSession = sessionItems && sessionItems.length > 0
  const firstSession = hasSession ? sessionItems[0] : null
  const calLink = (firstSession?.variant?.metadata?.cal_link || firstSession?.variant?.product?.metadata?.cal_link) as string | undefined

  return (
    <div className="py-24 min-h-screen bg-[#FBFAF8] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#C5A059]/5 rounded-full blur-3xl -ml-64 -mt-64"></div>
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#2C1E36]/5 rounded-full blur-3xl -mr-64 -translate-y-1/2"></div>

      <div className="content-container flex flex-col justify-center items-center gap-y-16 max-w-4xl h-full w-full relative z-10">
        {isOnboarding && <OnboardingCta orderId={order.id} />}
        
        {!customer && (
          <GuestAutoRegister 
            email={order.email || ""} 
            firstName={order.shipping_address?.first_name || ""} 
            lastName={order.shipping_address?.last_name || ""}
          />
        )}

        <div className="flex flex-col items-center text-center gap-y-8 animate-in fade-in slide-in-from-top-12 duration-1000">
           <div className="relative">
              <div className="absolute inset-0 bg-[#C5A059]/30 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-[#2C1E36] w-24 h-24 rounded-full flex items-center justify-center shadow-2xl shadow-purple-900/40 border-2 border-[#C5A059]/20">
                 <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
           </div>
           
           <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.6em] font-black text-[#C5A059] block animate-in fade-in duration-1000 delay-300">Order Sanctified</span>
              <Heading level="h1" className="text-5xl md:text-7xl font-serif text-[#2C1E36] font-bold leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 italic">
                Thank you for your trust.
              </Heading>
              <div className="h-0.5 w-24 bg-[#C5A059] mx-auto opacity-30 mt-6 rounded-full"></div>
           </div>

           <p className="text-[#685D6B] italic text-xl md:text-2xl max-w-2xl leading-relaxed font-serif animate-in fade-in duration-1000 delay-700">
              Your treasures have been secured. A confirmation of this <span className="text-[#C5A059] font-normal">divine exchange</span> has been sent to your digital portal.
           </p>
        </div>
        
        {hasSession && calLink && (
          <div className="w-full bg-[#2C1E36] p-10 md:p-14 rounded-[3rem] border border-white/5 shadow-2xl shadow-purple-900/20 text-white animate-in zoom-in-95 duration-700">
            <div className="flex flex-col items-center mb-10 text-center gap-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#C5A059]">Action Required</span>
              <Heading level="h2" className="text-3xl font-serif text-white font-bold">
                Schedule Your Session
              </Heading>
              <p className="text-purple-200/70 italic text-sm mt-2">
                Your journey begins with a conversation. Please choose a moment for our energies to meet.
              </p>
            </div>
            <div className="bg-white rounded-[2rem] p-4 text-black">
              <SessionBooking 
                calLink={calLink} 
                customerName={`${order.shipping_address?.first_name} ${order.shipping_address?.last_name}`}
                customerEmail={order.email || ""}
              />
            </div>
          </div>
        )}

        <div
          className="flex flex-col gap-y-12 max-w-4xl h-full bg-white w-full p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-sm"
          data-testid="order-complete-container"
        >
          <OrderDetails order={order} showTrackLink={true} />
          
          <div className="flex flex-col gap-y-4">
            <div className="flex items-center gap-x-4">
               <Heading level="h2" className="text-2xl font-serif text-[#2C1E36] font-bold">
                 Summary
               </Heading>
               <div className="h-px flex-1 bg-gray-100" />
            </div>
            <Items order={order} />
          </div>

          <div className="bg-[#2C1E36]/5 p-8 rounded-[2rem] border border-[#2C1E36]/10">
             <CartTotals totals={order} />
          </div>

          <div className="flex flex-col gap-y-12">
            <ShippingDetails order={order} />
            <PaymentDetails order={order} />
          </div>

          <div className="pt-8 border-t border-gray-100">
            <Help />
          </div>
        </div>
      </div>
    </div>
  )
}
