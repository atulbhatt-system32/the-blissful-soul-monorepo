import { Metadata } from "next"

import ProfilePhone from "@modules/account//components/profile-phone"
import ProfileBillingAddress from "@modules/account/components/profile-billing-address"
import ProfileEmail from "@modules/account/components/profile-email"
import ProfileName from "@modules/account/components/profile-name"
import ProfilePassword from "@modules/account/components/profile-password"

import { notFound } from "next/navigation"
import { listRegions } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "Profile",
  description: "View and edit your Medusa Store profile.",
}

export default async function Profile() {
  const customer = await retrieveCustomer()
  const regions = await listRegions()

  if (!customer || !regions) {
    notFound()
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 small:px-8" data-testid="profile-page-wrapper">
      <div className="mb-12 flex flex-col gap-y-2">
        <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#C5A059]">Sanctum Identity</span>
        <h1 className="text-4xl font-serif text-[#2C1E36] font-bold">Your Profile</h1>
        <p className="text-sm text-gray-500 italic max-w-lg leading-relaxed mt-2">
          Refine your essence. Manage your personal identification and secure delivery preferences within your digital sanctuary.
        </p>
      </div>
      <div className="flex flex-col gap-y-8 w-full">
        <ProfileName customer={customer} />
        <Divider />
        <ProfileEmail customer={customer} />
        <Divider />
        <ProfilePhone customer={customer} />
        <Divider />
        {/* <ProfilePassword customer={customer} />
        <Divider /> */}
        <ProfileBillingAddress customer={customer} regions={regions} />
      </div>
    </div>
  )
}

const Divider = () => {
  return <div className="w-full h-px bg-gray-200" />
}
;``
