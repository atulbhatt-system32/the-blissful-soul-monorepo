import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Checkout",
}

export default async function Checkout() {
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  return (
    <div className="bg-[#fdfcfb] min-h-screen">
      <div className="grid grid-cols-1 small:grid-cols-[1fr_480px] content-container gap-x-20 py-12">
        <div className="animate-in fade-in slide-in-from-left-4 duration-700">
          <PaymentWrapper cart={cart}>
            <CheckoutForm cart={cart} customer={customer} />
          </PaymentWrapper>
        </div>
        <aside className="relative">
          <div className="sticky top-24 bg-[#2C1E36] rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-purple-900/20 text-white min-h-[600px] border border-white/5">
            <CheckoutSummary cart={cart} />
          </div>
        </aside>
      </div>
    </div>
  )
}

