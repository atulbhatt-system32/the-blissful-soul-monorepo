"use client"

import { setAddresses } from "@lib/data/cart"
import compareAddresses from "@lib/util/compare-addresses"
import { CheckCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text, useToggleState } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import Spinner from "@modules/common/icons/spinner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState } from "react"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"

const Addresses = ({
  cart,
  customer,
  isDigitalOnly = false,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
  isDigitalOnly?: boolean
}) => {

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const step = searchParams.get("step")
  const isAddressStep = step === "address"
  
  // Open if explicitly on address step, or if no step is specified and address/email is incomplete
  const isOpen = isAddressStep || (!step && (!cart?.shipping_address?.address_1 || !cart?.email))

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }

  const [message, formAction] = useActionState(setAddresses, null)

  return (
    <div className="bg-transparent">
      <div className="flex flex-row items-center justify-between mb-8">
        <div className="flex flex-col gap-y-1">
           <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#C5A059]">Step I</span>
           <Heading
             level="h2"
             className="flex flex-row text-3xl font-serif text-[#2C1E36] font-bold gap-x-2 items-center"
           >
             {isDigitalOnly ? "Identity" : "Destination"}
             {!isOpen && cart?.shipping_address?.address_1 && cart?.email && (
               <div className="bg-[#C5A059]/10 p-1.5 rounded-full">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
               </div>
             )}
           </Heading>
        </div>
        {!isOpen && cart?.shipping_address && (
          <button
            onClick={handleEdit}
            className="text-[10px] uppercase tracking-widest font-black text-[#C5A059] border-b-2 border-[#C5A059]/30 hover:border-[#C5A059] transition-all pb-0.5"
            data-testid="edit-address-button"
          >
            Refine
          </button>
        )}
      </div>
      {isOpen ? (
        <form action={formAction}>
          <input type="hidden" name="is_digital_only" value={isDigitalOnly ? "true" : "false"} />
          <div className="pb-8 animate-in fade-in slide-in-from-top-2 duration-500">
            <ShippingAddress
              customer={customer}
              checked={sameAsBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
              isDigitalOnly={isDigitalOnly}
            />

            {!sameAsBilling && !isDigitalOnly && (
              <div className="mt-12 px-6 py-8 bg-[#2C1E36]/5 rounded-[2rem] border border-[#2C1E36]/10">
                <Heading
                  level="h2"
                  className="text-xl font-serif text-[#2C1E36] font-bold pb-6"
                >
                  Billing Sanctuary
                </Heading>

                <BillingAddress cart={cart} />
              </div>
            )}
            <div className="mt-10">
               <SubmitButton fullWidth data-testid="submit-address-button">
                {isDigitalOnly ? "Proceed to Offerings" : "Navigate to Logistics"}
               </SubmitButton>
            </div>
            <ErrorMessage error={message} data-testid="address-error-message" />
          </div>
        </form>
      ) : (
        <div className="bg-[#2C1E36]/5 p-8 rounded-[2rem] border border-[#2C1E36]/10 animate-in fade-in zoom-in-95 duration-500">
          <div className="text-small-regular">
            {cart && cart.shipping_address ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div
                    className="flex flex-col gap-y-2"
                    data-testid="shipping-address-summary"
                  >
                    <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-black italic">
                      {isDigitalOnly ? "The Seeker" : "The Vessel's Path"}
                    </span>
                    <div className="flex flex-col text-[#2C1E36] font-medium leading-relaxed">
                      <span className="font-bold">
                        {cart.shipping_address.first_name}{" "}
                        {cart.shipping_address.last_name}
                      </span>
                      {!isDigitalOnly && (
                        <>
                          <span>
                            {cart.shipping_address.address_1}{" "}
                            {cart.shipping_address.address_2}
                          </span>
                          <span>
                            {cart.shipping_address.postal_code}, {cart.shipping_address.city}
                          </span>
                          <span className="uppercase">
                            {cart.shipping_address.country_code}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div
                    className="flex flex-col gap-y-2"
                    data-testid="shipping-contact-summary"
                  >
                    <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-black italic">
                      Communication
                    </span>
                    <div className="flex flex-col text-[#2C1E36] font-medium leading-relaxed">
                      <span>{cart.shipping_address.phone}</span>
                      <span className="break-all">{cart.email}</span>
                    </div>
                  </div>

                  {!isDigitalOnly && (
                    <div
                      className="flex flex-col gap-y-2"
                      data-testid="billing-address-summary"
                    >
                      <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-black italic">
                        Billing Sanctuary
                      </span>
                      <div className="flex flex-col text-[#2C1E36] font-medium leading-relaxed">
                        {sameAsBilling ? (
                          <span className="italic opacity-60 text-xs">Mirror of Delivery</span>
                        ) : (
                          <>
                            <span className="font-bold">
                              {cart.billing_address?.first_name} {cart.billing_address?.last_name}
                            </span>
                            <span>
                              {cart.billing_address?.address_1} {cart.billing_address?.address_2}
                            </span>
                            <span>
                              {cart.billing_address?.postal_code}, {cart.billing_address?.city}
                            </span>
                            <span className="uppercase tracking-tighter">
                              {cart.billing_address?.country_code}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
              </div>
            ) : (
              <div className="flex justify-center py-4">
                <Spinner />
              </div>
            )}
          </div>
        </div>
      )}
      <div className="h-px w-full bg-gray-100 mt-12 mb-12" />
    </div>
  )
}

export default Addresses
