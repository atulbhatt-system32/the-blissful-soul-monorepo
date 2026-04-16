"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useState } from "react"

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cartState?.items?.reduce((acc, item) => acc + (item.total ?? 0), 0) ?? 0
  const timedOpen = () => {
    open()
    const timer = setTimeout(close, 5000)
    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }
    open()
  }

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const pathname = usePathname()

  // Open dropdown only when a product is explicitly added to cart
  useEffect(() => {
    const handleItemAdded = () => {
      if (!pathname.includes("/cart")) timedOpen()
    }
    window.addEventListener("cart:item-added", handleItemAdded)
    return () => window.removeEventListener("cart:item-added", handleItemAdded)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <div
      className="relative z-50 flex items-center"
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      <Popover className="relative flex items-center justify-center">
        <PopoverButton className="focus:outline-none p-2 transition-all hover:opacity-80">
          <div className="relative group/cart flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-colors group-hover/cart:text-primary pt-0.5">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#2C1E36] text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-background shadow-sm">
                {totalItems}
              </span>
            )}
          </div>
        </PopoverButton>
        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <PopoverPanel
            static
            className="hidden small:block absolute top-[calc(100%+8px)] right-0 bg-white shadow-2xl shadow-purple-900/10 rounded-[2rem] border border-gray-100 w-[380px] text-ui-fg-base overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300"
            data-testid="nav-cart-dropdown"
          >
            <div className="p-4 flex items-center justify-between border-b border-gray-50">
              <h3 className="text-lg font-serif text-[#2C1E36] font-bold">Your Selection</h3>
              <span className="text-[9px] uppercase tracking-widest text-[#C5A059] font-black">
                {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
              </span>
            </div>
            {cartState && cartState.items?.length ? (
              <>
                <div className="overflow-y-scroll max-h-[280px] px-4 py-3 grid grid-cols-1 gap-y-4 no-scrollbar">
                  {cartState.items
                    .sort((a, b) => {
                      return (a.created_at ?? "") > (b.created_at ?? "")
                        ? -1
                        : 1
                    })
                    .map((item) => (
                      <div
                        className="grid grid-cols-[64px_1fr] gap-x-4 group"
                        key={item.id}
                        data-testid="cart-item"
                      >
                        <LocalizedClientLink
                          href={`/products/${item.product_handle}`}
                          className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 shadow-sm"
                        >
                          <Thumbnail
                            thumbnail={item.thumbnail}
                            images={item.variant?.product?.images}
                            size="square"
                            className="group-hover:scale-105 transition-transform duration-700"
                          />
                        </LocalizedClientLink>
                        <div className="flex flex-col justify-between py-0.5">
                          <div className="flex flex-col">
                            <div className="flex items-start justify-between">
                              <div className="flex flex-col overflow-ellipsis whitespace-nowrap mr-2 w-[160px]">
                                <h3 className="text-[13px] font-serif text-[#2C1E36] font-bold overflow-hidden text-ellipsis">
                                  <LocalizedClientLink
                                    href={`/products/${item.product_handle}`}
                                    data-testid="product-link"
                                  >
                                    {item.product_title || item.title}
                                  </LocalizedClientLink>
                                </h3>
                                <div className="text-[8px] uppercase tracking-widest text-[#C5A059] font-black opacity-80">
                                  <LineItemOptions
                                    variant={item.variant}
                                    metadata={item.metadata}
                                    data-testid="cart-item-variant"
                                  />
                                </div>
                                <span
                                  className="text-[9px] text-gray-400 font-bold"
                                  data-testid="cart-item-quantity"
                                >
                                  Qty: {item.quantity}
                                </span>
                              </div>
                              <div className="flex justify-end text-[12px] font-black text-[#2C1E36]">
                                <LineItemPrice
                                  item={item}
                                  style="tight"
                                  currencyCode={cartState.currency_code}
                                />
                              </div>
                            </div>
                          </div>
                          <div
                            className="text-[8px] uppercase tracking-widest text-gray-300 font-black hover:text-red-500 transition-colors w-fit"
                          >
                             <DeleteButton id={item.id} className="text-inherit" data-testid="cart-item-remove-button">
                                Remove
                             </DeleteButton>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="px-6 py-5 bg-gray-50/50 flex flex-col gap-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                       <span className="text-[9px] uppercase tracking-widest text-gray-400 font-black">Subtotal</span>
                    </div>
                    <span
                      className="text-lg font-serif font-black text-[#2C1E36]"
                      data-testid="cart-subtotal"
                      data-value={subtotal}
                    >
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cartState.currency_code,
                      })}
                    </span>
                  </div>
                  <LocalizedClientLink href="/cart" passHref className="w-full">
                    <Button
                      className="w-full bg-[#2C1E36] text-white rounded-xl py-3.5 h-auto text-[10px] uppercase tracking-[0.2em] font-black hover:opacity-90 shadow-xl shadow-purple-900/10 active:scale-95 transition-all"
                      data-testid="go-to-cart-button"
                      onClick={close}
                    >
                      Enter Checkout
                    </Button>
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div>
                <div className="flex py-12 flex-col gap-y-4 items-center justify-center text-center px-6">
                  <div className="w-12 h-12 bg-[#2C1E36]/5 rounded-full flex items-center justify-center text-[#2C1E36]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <h3 className="text-base font-serif text-[#2C1E36] font-bold">Your Vessel is Empty</h3>
                    <p className="text-[10px] text-gray-400 italic">Let your journey begin.</p>
                  </div>
                  <LocalizedClientLink href="/store">
                    <Button 
                      onClick={close}
                      className="bg-[#2C1E36] text-white rounded-lg px-8 py-3 h-auto text-[9px] uppercase tracking-[0.2em] font-black hover:opacity-90 transition-all border-none"
                    >
                      Explore Store
                    </Button>
                  </LocalizedClientLink>
                </div>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown
