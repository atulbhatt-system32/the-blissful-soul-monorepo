import { Metadata } from "next"
import { notFound } from "next/navigation"

import AddressBook from "@modules/account/components/address-book"

import { getRegion, listRegions } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "Addresses",
  description: "View your addresses",
}

export default async function Addresses(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const customer = await retrieveCustomer()
  const region = await getRegion(countryCode)
  const regions = await listRegions()

  if (!customer || !region || !regions) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="addresses-page-wrapper">
      <div className="mb-12 flex flex-col gap-y-2">
        <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#C5A059]">My Account</span>
        <h1 className="text-4xl font-serif text-[#2C1E36] font-bold">Manage Addresses</h1>
        <p className="text-sm text-gray-500 italic max-w-lg leading-relaxed mt-2">
          Manage your saved delivery addresses.
        </p>
      </div>
      <AddressBook customer={customer} region={region} regions={regions} />
    </div>
  )
}
