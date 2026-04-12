"use client"

import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import React, { Fragment, useState } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"

const SideMenuItems = {
  Home: "/",
  "About Master": "/about",
  "Book Your Session": "/book-session",
  "Shop Crystals": "/store",
  "Track Order": "/order/lookup",
  Contact: "/contact",
  Account: "/account",
  Wishlist: "/wishlist",
  Cart: "/cart",
}

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

const SideMenu = ({ regions, locales, currentLocale }: SideMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()

  const openPopup = () => setIsOpen(true)
  const closePopup = () => setIsOpen(false)

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <button
          data-testid="nav-menu-button"
          onClick={openPopup}
          className="relative h-full flex items-center transition-all ease-out duration-200 focus:outline-none hover:text-primary group"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="group-hover:scale-110 transition-transform duration-200"
          >
            <line x1="4" x2="20" y1="12" y2="12"/>
            <line x1="4" x2="20" y1="6" y2="6"/>
            <line x1="4" x2="20" y1="18" y2="18"/>
          </svg>
        </button>

        <Transition show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-[150]" onClose={closePopup}>
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
            </TransitionChild>

            <div className="fixed inset-0 overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                  <TransitionChild
                    as={Fragment}
                    enter="transform transition ease-in-out duration-400"
                    enterFrom="translate-x-full"
                    enterTo="translate-x-0"
                    leave="transform transition ease-in-out duration-300"
                    leaveFrom="translate-x-0"
                    leaveTo="translate-x-full"
                  >
                    <DialogPanel className="pointer-events-auto w-screen max-w-[400px]">
                      <div className="flex h-full flex-col bg-[#1a0f21] px-10 pt-16 pb-8 shadow-2xl">
                        <div className="flex items-center justify-end mb-8 pr-2">
                          <button
                            type="button"
                            className="text-[#C5A059] hover:rotate-90 transition-transform duration-300 p-2.5 outline-none bg-white/5 rounded-full hover:bg-white/10"
                            onClick={closePopup}
                          >
                            <span className="sr-only">Close menu</span>
                            <XMark aria-hidden="true" className="h-6 w-6" />
                          </button>
                        </div>

                        <div className="flex-1 overflow-y-auto no-scrollbar py-2">
                          <nav className="flex flex-col gap-y-4">
                            {Object.entries(SideMenuItems).map(([name, href]) => (
                              <LocalizedClientLink
                                key={name}
                                href={href}
                                className="text-xl md:text-2xl font-serif text-white hover:text-[#C5A059] transition-all block py-2 border-b border-white/5 tracking-wide"
                                activeClassName="!text-[#C5A059] font-bold"
                                onClick={closePopup}
                                data-testid={`${name.toLowerCase()}-link`}
                              >
                                {name}
                              </LocalizedClientLink>
                            ))}
                          </nav>
                        </div>

                        <div className="mt-auto flex flex-col gap-y-8 pt-10 border-t border-white/10">
                          <div className="flex flex-col gap-y-4">
                            {!!locales?.length && (
                              <div className="flex justify-between items-center text-white/60 hover:text-white transition-colors cursor-pointer group">
                                <LanguageSelect
                                  toggleState={languageToggleState}
                                  locales={locales}
                                  currentLocale={currentLocale}
                                />
                                <ArrowRightMini className={clx("transition-transform duration-150 group-hover:translate-x-1", languageToggleState.state ? "-rotate-90" : "")} />
                              </div>
                            )}
                            <div className="flex justify-between items-center text-white/60 hover:text-white transition-colors cursor-pointer group">
                              {regions && <CountrySelect toggleState={countryToggleState} regions={regions} />}
                              <ArrowRightMini className={clx("transition-transform duration-150 group-hover:translate-x-1", countryToggleState.state ? "-rotate-90" : "")} />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <Text className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">
                              © {new Date().getFullYear()} The Blissful Soul.
                            </Text>
                          </div>
                        </div>
                      </div>
                    </DialogPanel>
                  </TransitionChild>
                </div>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  )
}

export default SideMenu
