import { Metadata } from "next"

import ProfilePhone from "@modules/account//components/profile-phone"
import ProfileEmail from "@modules/account/components/profile-email"
import ProfileName from "@modules/account/components/profile-name"
import ProfilePassword from "@modules/account/components/profile-password"

import { notFound } from "next/navigation"
import { listRegions } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "Profile",
  description: "View and edit your The Blissful Soul profile.",
}

export default async function Profile() {
  const customer = await retrieveCustomer()
  const regions = await listRegions()

  if (!customer || !regions) {
    notFound()
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 small:px-8" data-testid="profile-page-wrapper">
      <div className="mb-6 flex flex-col gap-y-1">
        <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#C5A059]">Sanctum Identity</span>
        <h1 className="text-3xl font-serif text-[#2C1E36] font-bold">Your Profile</h1>
        <p className="text-xs text-gray-500 italic max-w-lg leading-relaxed mt-1">
          Refine your essence. Manage your identification and security within your digital sanctuary.
        </p>
      </div>
      <div className="flex flex-col w-full">
        <ProfileName customer={customer} />
        <ProfileEmail customer={customer} />
        <ProfilePhone customer={customer} />
        <ProfilePassword customer={customer} />
      </div>
    </div>
  )
}

const Divider = () => {
  return <div className="w-full h-px bg-gray-200" />
}
;``
