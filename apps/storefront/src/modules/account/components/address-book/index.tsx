"use client"

import React, { useState } from "react"
import AddAddress from "../address-card/add-address"
import EditAddress from "../address-card/edit-address-modal"
import { HttpTypes } from "@medusajs/types"

type AddressBookProps = {
  customer: HttpTypes.StoreCustomer
  region: HttpTypes.StoreRegion
  regions: HttpTypes.StoreRegion[]
}

const AddressBook: React.FC<AddressBookProps> = ({ customer, region, regions }) => {
  const { addresses } = customer

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-12 border-b border-gray-100 pb-6 flex-wrap gap-4">
        <div className="flex flex-col gap-y-1">
          <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#C5A059]">Saved Locations</span>
          <p className="text-sm text-gray-400 italic">Explore your collection of sacred addresses.</p>
        </div>

        <AddAddress region={region} addresses={addresses} />
      </div>

      <div className="transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
        {addresses.length > 0 ? (
          <div className="flex flex-col gap-y-4 flex-1">
            {[...addresses]
              .sort((a, b) => {
                const scoreA =
                  (a.is_default_shipping ? 2 : 0) + (a.is_default_billing ? 1 : 0)
                const scoreB =
                  (b.is_default_shipping ? 2 : 0) + (b.is_default_billing ? 1 : 0)
                return scoreB - scoreA
              })
              .map((address) => (
                <EditAddress region={region} address={address} key={address.id} />
              ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
             <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#C5A059] mb-4 shadow-sm italic font-serif text-xl font-bold">!</div>
             <p className="text-[#2C1E36] font-serif font-bold text-lg mb-1 uppercase tracking-tight">No addresses found</p>
             <p className="text-gray-400 text-sm italic font-medium">Add a new address to populate your sacred collection.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AddressBook
