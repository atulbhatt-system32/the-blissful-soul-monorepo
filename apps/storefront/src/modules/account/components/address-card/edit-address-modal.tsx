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
      {/* Address Card */}
      <div
        className={clx(
          "bg-white p-4 sm:p-5 rounded-xl border transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-2 duration-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
          {
            "border-[#2C1E36] ring-1 ring-[#2C1E36]/10 shadow-md": isActive,
            "border-gray-200": !isActive
          }
        )}
        data-testid="address-container"
      >
        <div className="flex flex-col min-w-0">
          {(address.is_default_shipping || address.is_default_billing) && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {address.is_default_shipping && (
                <span className="bg-[#2C1E36] text-white text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full font-bold">
                  Shipping
                </span>
              )}
              {address.is_default_billing && (
                <span className="bg-[#C5A059] text-white text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full font-bold">
                  Billing
                </span>
              )}
            </div>
          )}
          <Heading
            className="text-left text-[#2C1E36] font-bold text-base mb-1"
            data-testid="address-name"
          >
            {address.first_name} {address.last_name}
          </Heading>
          
          <div className="flex flex-col text-gray-500 text-sm leading-relaxed">
            {address.company && (
              <Text
                className="font-medium text-[#2C1E36]/60 text-xs"
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
        
        <div className="flex items-center gap-x-4 flex-shrink-0">
          <button
            className="text-[11px] uppercase tracking-widest font-bold text-[#2C1E36] flex items-center gap-x-1.5 hover:text-[#C5A059] transition-all whitespace-nowrap"
            onClick={open}
            data-testid="address-edit-button"
          >
            <Edit style={{ width: 14, height: 14 }} />
            Edit
          </button>
          <button
            className="text-[11px] uppercase tracking-widest font-bold text-gray-400 flex items-center gap-x-1.5 hover:text-red-500 transition-all whitespace-nowrap"
            onClick={removeAddress}
            data-testid="address-delete-button"
          >
            {removing ? <Spinner /> : <Trash style={{ width: 14, height: 14 }} />}
            Remove
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={state} close={close} data-testid="edit-address-modal">
        <Modal.Title>
          <Heading className="font-serif text-[#2C1E36] text-xl font-bold">Edit Address</Heading>
        </Modal.Title>
        <form action={formAction}>
          <input type="hidden" name="addressId" value={address.id} />
          <Modal.Body>
            <div className="flex flex-col gap-y-3">
              <div className="flex flex-col gap-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-black">Set as Primary Address For</span>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <label className="flex items-center gap-x-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="address_type" 
                      value="shipping" 
                      defaultChecked={address.is_default_shipping}
                      className="w-4 h-4 accent-[#2C1E36] cursor-pointer"
                    />
                    <span className="text-sm text-[#2C1E36] font-semibold group-hover:text-[#C5A059] transition-colors">Shipping</span>
                  </label>
                  <label className="flex items-center gap-x-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="address_type" 
                      value="billing" 
                      defaultChecked={address.is_default_billing}
                      className="w-4 h-4 accent-[#2C1E36] cursor-pointer"
                    />
                    <span className="text-sm text-[#2C1E36] font-semibold group-hover:text-[#C5A059] transition-colors">Billing</span>
                  </label>
                  <label className="flex items-center gap-x-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="address_type" 
                      value="other" 
                      defaultChecked={!address.is_default_shipping && !address.is_default_billing}
                      className="w-4 h-4 accent-[#2C1E36] cursor-pointer"
                    />
                    <span className="text-sm text-[#2C1E36] font-semibold group-hover:text-[#C5A059] transition-colors">None</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
              <div className="grid grid-cols-2 gap-3">
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
                required
                autoComplete="phone"
                defaultValue={address.phone || undefined}
                data-testid="phone-input"
              />
            </div>
            {formState.error && (
              <div
                className="text-rose-500 text-xs font-medium py-2 mt-2"
              >
                {formState.error}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <div className="flex gap-3 w-full">
              <Button
                type="reset"
                variant="secondary"
                onClick={close}
                className="flex-1 h-11 rounded-xl text-[11px] uppercase tracking-widest font-black"
                data-testid="cancel-button"
              >
                Cancel
              </Button>
              <SubmitButton 
                data-testid="save-button" 
                className="flex-1 h-11 rounded-xl text-[11px] uppercase tracking-widest font-black bg-[#2C1E36] text-white hover:bg-[#3D2B4A] transition-all"
              >
                Save Changes
              </SubmitButton>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}

export default EditAddress
