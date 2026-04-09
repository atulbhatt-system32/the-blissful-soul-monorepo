"use client"

import { Radio, RadioGroup } from "@headlessui/react"
import { setShippingMethod } from "@lib/data/cart"
import { calculatePriceForShippingOption } from "@lib/data/fulfillment"
import { convertToLocale } from "@lib/util/money"
import { CheckCircleSolid, Loader } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Button, clx, Heading, Text } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import Divider from "@modules/common/components/divider"
import MedusaRadio from "@modules/common/components/radio"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const PICKUP_OPTION_ON = "__PICKUP_ON"
const PICKUP_OPTION_OFF = "__PICKUP_OFF"

type ShippingProps = {
  cart: HttpTypes.StoreCart
  availableShippingMethods: (HttpTypes.StoreCartShippingOption & { service_zone?: any })[] | null
}

function formatAddress(address: HttpTypes.StoreCartAddress) {
  if (!address) {
    return ""
  }

  let ret = ""

  if (address.address_1) {
    ret += ` ${address.address_1}`
  }

  if (address.address_2) {
    ret += `, ${address.address_2}`
  }

  if (address.postal_code) {
    ret += `, ${address.postal_code} ${address.city}`
  }

  if (address.country_code) {
    ret += `, ${address.country_code.toUpperCase()}`
  }

  return ret
}

const Shipping: React.FC<ShippingProps> = ({
  cart,
  availableShippingMethods,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)

  const [showPickupOptions, setShowPickupOptions] =
    useState<string>(PICKUP_OPTION_OFF)
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<
    Record<string, number>
  >({})
  const [error, setError] = useState<string | null>(null)
  const [shippingMethodId, setShippingMethodId] = useState<string | null>(
    cart.shipping_methods?.at(-1)?.shipping_option_id || null
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "delivery"

  const _shippingMethods = availableShippingMethods?.filter(
    (sm: any) => sm.service_zone?.fulfillment_set?.type !== "pickup"
  )

  const _pickupMethods = availableShippingMethods?.filter(
    (sm: any) => sm.service_zone?.fulfillment_set?.type === "pickup"
  )

  const hasPickupOptions = !!_pickupMethods?.length

  useEffect(() => {
    setIsLoadingPrices(true)

    if (_shippingMethods?.length) {
      const promises = _shippingMethods
        .filter((sm) => sm.price_type === "calculated")
        .map((sm) => calculatePriceForShippingOption(sm.id, cart.id))

      if (promises.length) {
        Promise.allSettled(promises).then((res) => {
          const pricesMap: Record<string, number> = {}
          res
            .filter((r) => r.status === "fulfilled")
            .forEach((p) => (pricesMap[p.value?.id || ""] = p.value?.amount!))

          setCalculatedPricesMap(pricesMap)
          setIsLoadingPrices(false)
        })
      }
    }

    if (_pickupMethods?.find((m) => m.id === shippingMethodId)) {
      setShowPickupOptions(PICKUP_OPTION_ON)
    }
  }, [availableShippingMethods])

  // Auto-select the only shipping option when delivery step opens
  // Only if no method is already attached to the cart
  const [autoSelectDone, setAutoSelectDone] = useState(false)
  useEffect(() => {
    if (
      isOpen && 
      !shippingMethodId && 
      !autoSelectDone &&
      !cart.shipping_methods?.length &&
      _shippingMethods?.length === 1
    ) {
      setAutoSelectDone(true)
      handleSetShippingMethod(_shippingMethods[0].id, "shipping")
    }
  }, [isOpen])

  const handleEdit = () => {
    router.push(pathname + "?step=delivery", { scroll: false })
  }

  const handleSubmit = () => {
    router.push(pathname + "?step=payment", { scroll: false })
  }

  const handleSetShippingMethod = async (
    id: string,
    variant: "shipping" | "pickup"
  ) => {
    setError(null)

    if (variant === "pickup") {
      setShowPickupOptions(PICKUP_OPTION_ON)
    } else {
      setShowPickupOptions(PICKUP_OPTION_OFF)
    }

    let currentId: string | null = null
    setIsLoading(true)
    setShippingMethodId((prev) => {
      currentId = prev
      return id
    })

    await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
      .catch((err) => {
        setShippingMethodId(currentId)

        setError(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <div className="bg-transparent">
      <div className="flex flex-row items-center justify-between mb-8">
        <div className="flex flex-col gap-y-1">
           <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#C5A059]">Step II</span>
           <Heading
             level="h2"
             className={clx(
               "flex flex-row text-3xl font-serif text-[#2C1E36] font-bold gap-x-2 items-center",
               {
                 "opacity-50": !isOpen && (cart.shipping_methods?.length ?? 0) === 0,
               }
             )}
           >
             Logistics
             {!isOpen && (cart.shipping_methods?.length ?? 0) > 0 && (
               <div className="bg-[#C5A059]/10 p-1.5 rounded-full">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
               </div>
             )}
           </Heading>
        </div>
        {!isOpen &&
          cart?.shipping_address &&
          cart?.billing_address &&
          cart?.email && (
            <button
              onClick={handleEdit}
              className="text-[10px] uppercase tracking-widest font-black text-[#C5A059] border-b-2 border-[#C5A059]/30 hover:border-[#C5A059] transition-all pb-0.5"
              data-testid="edit-delivery-button"
            >
              Refine
            </button>
          )}
      </div>
      {isOpen ? (
        <div className="animate-in fade-in slide-in-from-top-2 duration-500 pb-8">
          <div className="grid">
            <div className="flex flex-col gap-y-1 mb-8">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-black italic">
                Method of Arrival
              </span>
              <p className="text-sm text-gray-500 italic">
                Choose the path your sacred items will take to reach you.
              </p>
            </div>
            
            <div data-testid="delivery-options-container">
              <div className="flex flex-col gap-y-4">
                {hasPickupOptions && (
                  <RadioGroup
                    value={showPickupOptions}
                    onChange={(value) => {
                      const id = _pickupMethods.find(
                        (option) => !option.insufficient_inventory
                      )?.id

                      if (id) {
                        handleSetShippingMethod(id, "pickup")
                      }
                    }}
                  >
                    <Radio
                      value={PICKUP_OPTION_ON}
                      data-testid="delivery-option-radio"
                      className={clx(
                        "flex items-center justify-between cursor-pointer p-6 border rounded-[1.5rem] transition-all duration-300",
                        showPickupOptions === PICKUP_OPTION_ON 
                          ? "border-[#2C1E36] bg-[#2C1E36]/5 shadow-lg shadow-purple-900/5 scale-[1.02]" 
                          : "border-gray-100 hover:border-gray-300 bg-white"
                      )}
                    >
                      <div className="flex items-center gap-x-4">
                        <MedusaRadio
                          checked={showPickupOptions === PICKUP_OPTION_ON}
                        />
                        <span className="text-sm font-bold text-[#2C1E36]">
                          Personal Collection (Pickup)
                        </span>
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-[#C5A059]">
                        Complimentary
                      </span>
                    </Radio>
                  </RadioGroup>
                )}
                
                <RadioGroup
                  value={shippingMethodId}
                  className="flex flex-col gap-y-3"
                  onChange={(v) => {
                    if (v) {
                      return handleSetShippingMethod(v, "shipping")
                    }
                  }}
                >
                  {_shippingMethods?.map((option) => {
                    const isDisabled =
                      option.price_type === "calculated" &&
                      !isLoadingPrices &&
                      typeof calculatedPricesMap[option.id] !== "number"

                    const isSelected = option.id === shippingMethodId

                    return (
                      <Radio
                        key={option.id}
                        value={option.id}
                        data-testid="delivery-option-radio"
                        disabled={isDisabled}
                        className={clx(
                          "flex items-center justify-between cursor-pointer p-6 border rounded-[1.5rem] transition-all duration-300 outline-none",
                          isSelected
                            ? "border-[#2C1E36] bg-[#2C1E36]/5 shadow-lg shadow-purple-900/5 scale-[1.02]"
                            : "border-gray-100 hover:border-gray-300 bg-white",
                          {
                            "opacity-50 cursor-not-allowed grayscale": isDisabled,
                          }
                        )}
                      >
                        <div className="flex items-center gap-x-4">
                          <MedusaRadio
                            checked={isSelected}
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-[#2C1E36]">
                              {option.name}
                            </span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-tighter">
                               Standard Passage
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-black text-[#2C1E36]">
                          {option.price_type === "flat" ? (
                            convertToLocale({
                              amount: option.amount!,
                              currency_code: cart?.currency_code,
                            })
                          ) : calculatedPricesMap[option.id] ? (
                            convertToLocale({
                              amount: calculatedPricesMap[option.id],
                              currency_code: cart?.currency_code,
                            })
                          ) : isLoadingPrices ? (
                            <Loader className="animate-spin text-[#C5A059]" />
                          ) : (
                            "-"
                          )}
                        </span>
                      </Radio>
                    )
                  })}
                </RadioGroup>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <ErrorMessage
              error={error}
              data-testid="delivery-option-error-message"
            />
            <Button
              size="large"
              className="w-full rounded-xl py-4 h-auto text-[11px] uppercase tracking-[0.2em] font-black transition-all shadow-xl active:scale-95 shadow-purple-900/10 bg-[#2C1E36] text-white hover:opacity-90 disabled:bg-gray-200 disabled:text-gray-400"
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={!shippingMethodId}
              data-testid="submit-delivery-option-button"
            >
              Secure Choice & Continue
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-[#2C1E36]/5 p-8 rounded-[2rem] border border-[#2C1E36]/10 animate-in fade-in zoom-in-95 duration-500">
          <div className="text-small-regular">
            {cart && (cart.shipping_methods?.length ?? 0) > 0 ? (
              <div className="flex flex-col gap-y-2">
                <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-black italic">
                   Selected Path
                </span>
                <div className="flex items-center justify-between text-[#2C1E36] font-bold">
                  <span>{cart.shipping_methods!.at(-1)!.name}</span>
                  <span className="text-[#C5A059]">
                    {convertToLocale({
                      amount: cart.shipping_methods!.at(-1)!.amount!,
                      currency_code: cart?.currency_code,
                    })}
                  </span>
                </div>
              </div>
            ) : (
               <span className="text-sm text-gray-400 italic">Logistics pending...</span>
            )}
          </div>
        </div>
      )}
      <div className="h-px w-full bg-gray-100 mt-12 mb-12" />
    </div>
  )
}

export default Shipping
