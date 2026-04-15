"use client"

import { useActionState, useEffect, useRef, startTransition } from "react"
import { lookupOrder } from "@lib/data/orders"
import { Heading, Text, Button } from "@medusajs/ui"
import Input from "@modules/common/components/input"
import { HttpTypes } from "@medusajs/types"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import ErrorMessage from "@modules/checkout/components/error-message"
import { useRouter, useParams } from "next/navigation"
import { ArrowRightMini } from "@medusajs/icons"

import CartTotals from "@modules/common/components/cart-totals"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"

const OrderLookupTemplate = ({ 
  customer,
  recentOrders = [],
  initialDisplayId,
  initialEmail,
}: { 
  customer: HttpTypes.StoreCustomer | null
  recentOrders?: HttpTypes.StoreOrder[]
  initialDisplayId?: string
  initialEmail?: string
}) => {
  const [state, formAction, isPending] = useActionState(lookupOrder, {
    success: false,
    error: null,
    order: null,
  })

  const router = useRouter()
  const params = useParams()
  const countryCode = params.countryCode as string
  const hasTriggered = useRef(false)

  useEffect(() => {
    if (initialDisplayId && initialEmail && !hasTriggered.current) {
      hasTriggered.current = true
      const formData = new FormData()
      formData.append("display_id", initialDisplayId)
      formData.append("email", initialEmail)
      startTransition(() => {
        formAction(formData)
      })
    }
  }, [initialDisplayId, initialEmail, formAction])

  if (state.success && state.order) {
    const order = state.order
    
    return (
      <div className="py-8 md:py-16 min-h-[calc(100vh-64px)] w-full flex justify-center px-4 md:px-8 bg-gray-50/30">
        <div className="content-container flex flex-col items-center gap-y-6 md:gap-y-10 max-w-4xl h-full w-full animate-in fade-in slide-in-from-bottom-4 duration-700">

          <div
            className="flex flex-col gap-4 max-w-4xl h-full bg-white w-full py-8 md:py-12 px-4 md:px-12 rounded-3xl md:rounded-[3rem] border border-gray-100 shadow-xl shadow-purple-900/5"
            data-testid="order-complete-container"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-8 mb-8">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#C5A059] block mb-2">Detailed Retrieval</span>
                <Heading
                  level="h1"
                  className="font-serif text-[#2C1E36] text-4xl"
                >
                  Order Details
                </Heading>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-gray-400 block mb-1">Status Overview</span>
              </div>
            </div>

            <OrderDetails order={order} showStatus showTrackLink={false} />


            <div className="space-y-12">
              <section>
                <div className="flex items-center gap-x-3 mb-6">
                   <div className="w-1 h-6 bg-[#C5A059] rounded-full" />
                   <Heading level="h2" className="text-xl font-serif text-[#2C1E36]">Collection Summary</Heading>
                </div>
                <Items order={order} />
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-gray-50">
                <section>
                   <div className="flex items-center gap-x-3 mb-6">
                      <div className="w-1 h-6 bg-[#C5A059] rounded-full" />
                      <Heading level="h2" className="text-xl font-serif text-[#2C1E36]">Logistics</Heading>
                   </div>
                   <ShippingDetails order={order} />
                </section>
                <section>
                   <div className="flex items-center gap-x-3 mb-6">
                      <div className="w-1 h-6 bg-[#C5A059] rounded-full" />
                      <Heading level="h2" className="text-xl font-serif text-[#2C1E36]">Financials</Heading>
                   </div>
                   <CartTotals totals={order} />
                </section>
              </div>

              <section className="pt-8 border-t border-gray-50">
                 <div className="flex items-center gap-x-3 mb-6">
                    <div className="w-1 h-6 bg-[#C5A059] rounded-full" />
                    <Heading level="h2" className="text-xl font-serif text-[#2C1E36]">Payment Method</Heading>
                 </div>
                 <PaymentDetails order={order} />
              </section>
            </div>

            <div className="mt-16 pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1" />
              <Button 
                variant="secondary" 
                className="rounded-xl px-8 py-4 h-auto text-[10px] uppercase tracking-widest font-black bg-[#2C1E36]/5 text-[#2C1E36] hover:bg-[#2C1E36] hover:text-white transition-all border-none"
                onClick={() => window.location.href = `/${countryCode}/order/lookup`}
              >
                Track Another Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isPending) {
    return (
      <div className="w-full flex flex-col items-center justify-center px-8 py-32 min-h-[60vh] bg-white animate-in fade-in duration-300">
        <div className="animate-spin h-12 w-12 border-[3px] border-[#2C1E36]/20 border-t-[#2C1E36] rounded-full mb-6" />
        <Text className="text-sm text-gray-500 font-serif italic">Retrieving your order details…</Text>
      </div>
    )
  }

  return (
    <div className="w-full flex justify-center px-8 py-24 min-h-[60vh] bg-white animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-md w-full flex flex-col items-center">
        <div className="w-20 h-20 bg-[#2C1E36]/5 rounded-full flex items-center justify-center text-[#2C1E36] mb-8">
           <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        </div>
        <Heading level="h1" className="text-4xl font-serif text-[#2C1E36] mb-4 text-center">
          Track Your Treasure
        </Heading>

        {/* {state.error && (
          <div className="w-full mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
            <ErrorMessage error={state.error} data-testid="lookup-error-message" />
          </div>
        )} */}

        {!customer && (
          <Text className="text-center text-sm text-gray-500 mb-10 max-w-[320px] leading-relaxed italic">
            Enter your order details below to reveal the status of your Blissful Soul collection.
          </Text>
        )}

        {customer && recentOrders.length > 0 && (
          <Text className="text-center text-sm text-gray-500 mb-10 max-w-[320px] leading-relaxed italic">
            Select an order below to view its tracking details.
          </Text>
        )}

        {customer && recentOrders.length === 0 && (
          <Text className="text-center text-sm text-gray-500 mb-10 max-w-[320px] leading-relaxed italic">
            You don&apos;t have any recent orders to track at the moment.
          </Text>
        )}

        {recentOrders.length > 0 && (
          <div className="w-full mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex items-center gap-x-3 mb-6">
              <div className="h-px flex-1 bg-gray-100" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#C5A059]">Your Recent Orders</span>
              <div className="h-px flex-1 bg-gray-100" />
            </div>
            <div className="grid grid-cols-1 gap-3">
              {recentOrders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => {
                    window.location.href = `/${countryCode}/order/lookup?display_id=${order.display_id}&email=${encodeURIComponent(order.email || "")}`
                  }}
                  className="flex items-center justify-between p-4 bg-[#2C1E36]/5 hover:bg-[#2C1E36] hover:text-white rounded-2xl border border-[#2C1E36]/10 transition-all text-left group"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-black uppercase tracking-widest">Order #{order.display_id}</span>
                    <span className="text-[10px] opacity-60 font-serif italic italic text-current">
                       {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Track</span>
                    <ArrowRightMini className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {!customer && (
          <div className="w-full bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-purple-900/5 transition-all">
            <form className="w-full flex flex-col gap-y-6" action={formAction}>
              <div className="flex flex-col w-full gap-y-4">
                <Input
                  label="Order Reference Number"
                  name="display_id"
                  type="text"
                  required
                  defaultValue={initialDisplayId}
                  data-testid="order-id-input"
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  defaultValue={initialEmail || ""}
                  data-testid="email-input"
                />
              </div>
              <ErrorMessage error={state.error} data-testid="lookup-error-message" />
              <SubmitButton data-testid="lookup-button" className="w-full bg-[#2C1E36] text-white rounded-2xl py-5 h-auto text-[11px] uppercase tracking-[0.2em] font-black hover:opacity-90 shadow-xl shadow-purple-900/10 active:scale-95 transition-all mt-2">
                Locate Order
              </SubmitButton>
            </form>
          </div>
        )}

        {!customer && (
          <div className="mt-12 flex flex-col items-center gap-y-4">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-300">
              Preferred Experience
            </span>
            <Button 
              variant="secondary" 
              className="rounded-xl px-10 py-4 h-auto text-[10px] uppercase tracking-widest font-black bg-[#C5A059]/5 text-[#C5A059] hover:bg-[#C5A059] hover:text-white transition-all border-none"
              onClick={() => router.push(`/${countryCode}/account`)}
            >
              Sign In for Full History
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderLookupTemplate
