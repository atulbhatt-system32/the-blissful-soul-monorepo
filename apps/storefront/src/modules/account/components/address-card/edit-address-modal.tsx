"use client"

import React, { useEffect, useState, useActionState } from "react"
import { PencilSquare as Edit, Trash } from "@medusajs/icons"
import { Button, Heading, Text, clx } from "@medusajs/ui"

import useToggleState from "@lib/hooks/use-toggle-state"
import CountrySelect from "@modules/checkout/components/country-select"
import Input from "@modules/common/components/input"
import Modal from "@modules/common/components/modal"
import Spinner from "@modules/common/icons/spinner"
import MapPin from "@modules/common/icons/map-pin"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { HttpTypes } from "@medusajs/types"
import {
  deleteCustomerAddress,
  updateCustomerAddress,
} from "@lib/data/customer"

type EditAddressProps = {
  region: HttpTypes.StoreRegion
  address: HttpTypes.StoreCustomerAddress
  isActive?: boolean
}

const EditAddress: React.FC<EditAddressProps> = ({
  region,
  address,
  isActive = false,
}) => {
  const [removing, setRemoving] = useState(false)
  const [successState, setSuccessState] = useState(false)
  const { state, open, close: closeModal } = useToggleState(false)

  const [formState, formAction] = useActionState(updateCustomerAddress, {
    success: false,
    error: null,
    addressId: address.id,
  })

  const close = () => {
    setSuccessState(false)
    closeModal()
  }

  useEffect(() => {
    if (successState) {
      close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successState])

  useEffect(() => {
    if (formState.success) {
      setSuccessState(true)
    }
  }, [formState])

  const removeAddress = async () => {
    setRemoving(true)
    await deleteCustomerAddress(address.id)
    setRemoving(false)
  }

  return (
    <>
      <div
        className={clx(
          "bg-white p-6 md:p-8 rounded-[2.5rem] border transition-all hover:shadow-lg hover:shadow-purple-900/5 animate-in fade-in slide-in-from-bottom-2 duration-500 flex flex-col md:flex-row md:items-center md:justify-between gap-6",
          {
            "border-[#2C1E36] ring-1 ring-[#2C1E36]/10 shadow-lg shadow-purple-900/5": isActive,
            "border-gray-100": !isActive
          }
        )}
        data-testid="address-container"
      >
        <div className="flex flex-col">
          {(address.is_default_shipping || address.is_default_billing) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {address.is_default_shipping && (
                <span className="bg-[#2C1E36] text-white text-[9px] uppercase tracking-widest px-3 py-1 rounded-full font-black shadow-sm flex items-center gap-1 scale-95 origin-left">
                  <span className="w-1 h-1 rounded-full bg-[#C5A059] animate-pulse"></span>
                  Primary Shipping
                </span>
              )}
              {address.is_default_billing && (
                <span className="bg-[#C5A059] text-white text-[9px] uppercase tracking-widest px-3 py-1 rounded-full font-black shadow-sm flex items-center gap-1 scale-95 origin-left">
                  <span className="w-1 h-1 rounded-full bg-white"></span>
                  Primary Billing
                </span>
              )}
            </div>
          )}    <Heading
            className="text-left font-serif text-[#2C1E36] font-bold text-xl mb-3"
            data-testid="address-name"
          >
            {address.first_name} {address.last_name}
          </Heading>
          
          <div className="flex flex-col gap-y-1 text-gray-500 text-sm italic">
            {address.company && (
              <Text
                className="font-bold text-[#2C1E36]/60 not-italic mb-1"
                data-testid="address-company"
              >
                {address.company}
              </Text>
            )}
            <span data-testid="address-address">
              {address.address_1}
              {address.address_2 && <span>, {address.address_2}</span>}
            </span>
            <span data-testid="address-postal-city">
              {address.postal_code}, {address.city}
            </span>
            <span data-testid="address-province-country">
              {address.province && `${address.province}, `}
              {address.country_code?.toUpperCase()}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-x-6 md:pl-8 md:border-l border-gray-100 h-full">
          <button
            className="text-[11px] uppercase tracking-widest font-bold text-[#2C1E36] flex items-center gap-x-2 border-b-2 border-transparent hover:border-[#2C1E36] transition-all pb-1 whitespace-nowrap"
            onClick={open}
            data-testid="address-edit-button"
          >
            <Edit size={16} />
            Modify
          </button>
          <button
            className="text-[11px] uppercase tracking-widest font-bold text-gray-400 flex items-center gap-x-2 hover:text-red-500 transition-all pb-1 whitespace-nowrap"
            onClick={removeAddress}
            data-testid="address-delete-button"
          >
            {removing ? <Spinner /> : <Trash size={16} />}
            Remove
          </button>
        </div>
      </div>

      <Modal isOpen={state} close={close} data-testid="edit-address-modal">
        <Modal.Title>
          <Heading className="mb-2">Edit address</Heading>
        </Modal.Title>
        <form action={formAction}>
          <input type="hidden" name="addressId" value={address.id} />
          <Modal.Body>
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-col gap-y-3 mb-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-black">Set as Primary Address For</span>
                <div className="flex gap-x-8">
                  <label className="flex items-center gap-x-2.5 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="address_type" 
                      value="shipping" 
                      defaultChecked={address.is_default_shipping}
                      className="w-4 h-4 accent-[#2C1E36] cursor-pointer"
                    />
                    <span className="text-sm font-serif text-[#2C1E36] font-bold group-hover:text-[#C5A059] transition-colors">Shipping</span>
                  </label>
                  <label className="flex items-center gap-x-2.5 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="address_type" 
                      value="billing" 
                      defaultChecked={address.is_default_billing}
                      className="w-4 h-4 accent-[#2C1E36] cursor-pointer"
                    />
                    <span className="text-sm font-serif text-[#2C1E36] font-bold group-hover:text-[#C5A059] transition-colors">Billing</span>
                  </label>
                  <label className="flex items-center gap-x-2.5 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="address_type" 
                      value="other" 
                      defaultChecked={!address.is_default_shipping && !address.is_default_billing}
                      className="w-4 h-4 accent-[#2C1E36] cursor-pointer"
                    />
                    <span className="text-sm font-serif text-[#2C1E36] font-bold group-hover:text-[#C5A059] transition-colors">None</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-y-2">
              <div className="grid grid-cols-2 gap-x-2">
                <Input
                  label="First name"
                  name="first_name"
                  required
                  autoComplete="given-name"
                  defaultValue={address.first_name || undefined}
                  data-testid="first-name-input"
                />
                <Input
                  label="Last name"
                  name="last_name"
                  required
                  autoComplete="family-name"
                  defaultValue={address.last_name || undefined}
                  data-testid="last-name-input"
                />
              </div>
              <Input
                label="Company"
                name="company"
                autoComplete="organization"
                defaultValue={address.company || undefined}
                data-testid="company-input"
              />
              <Input
                label="Address"
                name="address_1"
                required
                autoComplete="address-line1"
                defaultValue={address.address_1 || undefined}
                data-testid="address-1-input"
              />
              <Input
                label="Apartment, suite, etc."
                name="address_2"
                autoComplete="address-line2"
                defaultValue={address.address_2 || undefined}
                data-testid="address-2-input"
              />
              <div className="grid grid-cols-[144px_1fr] gap-x-2">
                <Input
                  label="Postal code"
                  name="postal_code"
                  required
                  autoComplete="postal-code"
                  defaultValue={address.postal_code || undefined}
                  data-testid="postal-code-input"
                />
                <Input
                  label="City"
                  name="city"
                  required
                  autoComplete="locality"
                  defaultValue={address.city || undefined}
                  data-testid="city-input"
                />
              </div>
              <Input
                label="Province / State"
                name="province"
                autoComplete="address-level1"
                defaultValue={address.province || undefined}
                data-testid="state-input"
              />
              <CountrySelect
                name="country_code"
                region={region}
                required
                autoComplete="country"
                defaultValue={address.country_code || undefined}
                data-testid="country-select"
              />
              <Input
                label="Phone"
                name="phone"
                autoComplete="phone"
                defaultValue={address.phone || undefined}
                data-testid="phone-input"
              />
              </div>
            </div>
            {formState.error && (
              <div className="text-rose-500 text-small-regular py-2">
                {formState.error}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <div className="flex gap-3 mt-6">
              <Button
                type="reset"
                variant="secondary"
                onClick={close}
                className="h-10 px-8 rounded-xl text-[11px] uppercase tracking-widest font-black"
                data-testid="cancel-button"
              >
                Cancel
              </Button>
              <SubmitButton data-testid="save-button" className="px-8 rounded-xl h-10 text-[11px] uppercase tracking-widest font-black">Save</SubmitButton>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}

export default EditAddress
