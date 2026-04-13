"use client"

import { clx } from "@medusajs/ui"
import { ArrowRightOnRectangle } from "@medusajs/icons"
import { useParams, usePathname } from "next/navigation"

import ChevronDown from "@modules/common/icons/chevron-down"
import User from "@modules/common/icons/user"
import MapPin from "@modules/common/icons/map-pin"
import Package from "@modules/common/icons/package"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { signout } from "@lib/data/customer"

const AccountNav = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null
}) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }

  const handleLogout = async () => {
    await signout(countryCode)
  }

  return (
    <div className="animate-in fade-in slide-in-from-left-4 duration-700">
      <div className="small:hidden px-4" data-testid="mobile-account-nav">
        {route !== `/${countryCode}/account` ? (
          <LocalizedClientLink
            href="/account"
            className="flex items-center gap-x-2 text-[11px] uppercase tracking-widest font-bold text-[#2C1E36]/60 py-2"
            data-testid="account-main-link"
          >
            <>
              <ChevronDown className="transform rotate-90" width={12} height={12} />
              <span>Back to Account</span>
            </>
          </LocalizedClientLink>
        ) : (
          <div className="py-8">
            <div className="text-3xl font-serif text-[#2C1E36] mb-6 px-4">
              Hello, {customer?.first_name}
            </div>
            <div className="text-base-regular">
              <ul className="space-y-2">
                <li>
                  <LocalizedClientLink
                    href="/account/profile"
                    className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl shadow-sm"
                    data-testid="profile-link"
                  >
                    <div className="flex items-center gap-x-3">
                      <div className="w-10 h-10 rounded-xl bg-[#2C1E36]/5 flex items-center justify-center text-[#2C1E36]">
                        <User size={20} />
                      </div>
                      <span className="font-serif text-[#2C1E36] font-bold">Profile Settings</span>
                    </div>
                    <ChevronDown className="transform -rotate-90 text-gray-300" width={16} height={16} />
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/addresses"
                    className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl shadow-sm"
                    data-testid="addresses-link"
                  >
                    <div className="flex items-center gap-x-3">
                      <div className="w-10 h-10 rounded-xl bg-[#2C1E36]/5 flex items-center justify-center text-[#2C1E36]">
                        <MapPin size={20} />
                      </div>
                      <span className="font-serif text-[#2C1E36] font-bold">Manage Addresses</span>
                    </div>
                    <ChevronDown className="transform -rotate-90 text-gray-300" width={16} height={16} />
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/orders"
                    className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl shadow-sm"
                    data-testid="orders-link"
                  >
                    <div className="flex items-center gap-x-3">
                      <div className="w-10 h-10 rounded-xl bg-[#2C1E36]/5 flex items-center justify-center text-[#2C1E36]">
                        <Package size={20} />
                      </div>
                      <span className="font-serif text-[#2C1E36] font-bold">Order History</span>
                    </div>
                    <ChevronDown className="transform -rotate-90 text-gray-300" width={16} height={16} />
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/sessions"
                    className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl shadow-sm"
                    data-testid="sessions-link"
                  >
                    <div className="flex items-center gap-x-3">
                      <div className="w-10 h-10 rounded-xl bg-[#2C1E36]/5 flex items-center justify-center text-[#2C1E36]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v10l4.5 4.5"/><circle cx="12" cy="12" r="10"/></svg>
                      </div>
                      <span className="font-serif text-[#2C1E36] font-bold">My Sessions</span>
                    </div>
                    <ChevronDown className="transform -rotate-90 text-gray-300" width={16} height={16} />
                  </LocalizedClientLink>
                </li>
                <li className="pt-4">
                  <button
                    type="button"
                    className="flex items-center justify-center p-5 w-full text-red-500 font-bold uppercase tracking-widest text-[11px] bg-red-50 rounded-2xl transition-colors hover:bg-red-100"
                    onClick={handleLogout}
                    data-testid="logout-button"
                  >
                    Log out of account
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="hidden small:block" data-testid="account-nav">
        <div className="pr-12 border-r border-gray-100 min-h-[400px]">
          <div className="pb-8">
            <h3 className="text-xs uppercase tracking-[0.2em] font-black text-[#C5A059]">Dashboard</h3>
          </div>
          <div className="text-base-regular">
            <ul className="flex mb-0 justify-start items-start flex-col gap-y-1 w-full">
              <li className="w-full">
                <AccountNavLink href="/account" route={route!} data-testid="overview-link">
                  Overview
                </AccountNavLink>
              </li>
              <li className="w-full">
                <AccountNavLink href="/account/profile" route={route!} data-testid="profile-link">
                  Account Settings
                </AccountNavLink>
              </li>
              <li className="w-full">
                <AccountNavLink href="/account/addresses" route={route!} data-testid="addresses-link">
                  Manage Addresses
                </AccountNavLink>
              </li>
              <li className="w-full">
                <AccountNavLink href="/account/orders" route={route!} data-testid="orders-link">
                  Order History
                </AccountNavLink>
              </li>
              <li className="w-full">
                <AccountNavLink href="/account/sessions" route={route!} data-testid="sessions-link">
                  Healing Sessions
                </AccountNavLink>
              </li>
              <li className="pt-10 w-full">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-300 hover:text-red-500 transition-colors flex items-center gap-2 group"
                  data-testid="logout-button"
                >
                  <ArrowRightOnRectangle className="group-hover:translate-x-1 transition-transform" />
                  Log out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

type AccountNavLinkProps = {
  href: string
  route: string
  children: React.ReactNode
  "data-testid"?: string
}

const AccountNavLink = ({
  href,
  route,
  children,
  "data-testid": dataTestId,
}: AccountNavLinkProps) => {
  const { countryCode }: { countryCode: string } = useParams()
  const active = route.split(countryCode)[1] === href

  return (
    <LocalizedClientLink
      href={href}
      className={clx(
        "py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-between group",
        {
          "bg-[#2C1E36] text-white shadow-lg shadow-[#2C1E36]/20": active,
          "text-gray-400 hover:text-[#2C1E36] hover:bg-gray-50": !active,
        }
      )}
      data-testid={dataTestId}
    >
      <span>{children}</span>
      {active && (
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
      )}
    </LocalizedClientLink>
  )
}

export default AccountNav
