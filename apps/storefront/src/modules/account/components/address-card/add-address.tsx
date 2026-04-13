"use client"

import { Plus } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"
import { useEffect, useState, useActionState } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import CountrySelect from "@modules/checkout/components/country-select"
import Input from "@modules/common/components/input"
import Modal from "@modules/common/components/modal"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { HttpTypes } from "@medusajs/types"
import { addCustomerAddress } from "@lib/data/customer"

const AddAddress = ({
  region,
  addresses,
}: {
  region: HttpTypes.StoreRegion
  addresses: HttpTypes.StoreCustomerAddress[]
}) => {
  const [successState, setSuccessState] = useState(false)
  const { state, open, close: closeModal } = useToggleState(false)

  const [formState, formAction] = useActionState(addCustomerAddress, {
    isDefaultShipping: addresses.length === 0,
    isDefaultBilling: false,
    success: false,
    error: null,
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

  return (
    <>
      <Button
        className="bg-[#2C1E36] text-white rounded-xl px-4 sm:px-6 py-2.5 h-auto text-[11px] uppercase tracking-widest font-black transition-all hover:opacity-90 shadow-lg shadow-purple-900/10 active:scale-95 flex items-center gap-x-2"
        onClick={open}
        data-testid="add-address-button"
      >
        <Plus size={16} />
        <span className="hidden sm:inline">Add Address</span>
      </Button>

      <Modal isOpen={state} close={close} data-testid="add-address-modal">
        <Modal.Title>
          <Heading className="font-serif text-[#2C1E36] text-xl font-bold">Add New Address</Heading>
        </Modal.Title>
        <form action={formAction}>
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
                      defaultChecked={true}
                      className="w-4 h-4 accent-[#2C1E36] cursor-pointer"
                    />
                    <span className="text-sm text-[#2C1E36] font-semibold group-hover:text-[#C5A059] transition-colors">Shipping</span>
                  </label>
                  <label className="flex items-center gap-x-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="address_type" 
                      value="billing" 
                      className="w-4 h-4 accent-[#2C1E36] cursor-pointer"
                    />
                    <span className="text-sm text-[#2C1E36] font-semibold group-hover:text-[#C5A059] transition-colors">Billing</span>
                  </label>
                  <label className="flex items-center gap-x-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="address_type" 
                      value="other" 
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
                  data-testid="first-name-input"
                />
                <Input
                  label="Last name"
                  name="last_name"
                  required
                  autoComplete="family-name"
                  data-testid="last-name-input"
                />
              </div>
              <Input
                label="Company"
                name="company"
                autoComplete="organization"
                data-testid="company-input"
              />
              <Input
                label="Address"
                name="address_1"
                required
                autoComplete="address-line1"
                data-testid="address-1-input"
              />
              <Input
                label="Apartment, suite, etc."
                name="address_2"
                autoComplete="address-line2"
                data-testid="address-2-input"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Postal code"
                  name="postal_code"
                  required
                  autoComplete="postal-code"
                  data-testid="postal-code-input"
                />
                <Input
                  label="City"
                  name="city"
                  required
                  autoComplete="locality"
                  data-testid="city-input"
                />
              </div>
              <Input
                label="Province / State"
                name="province"
                autoComplete="address-level1"
                data-testid="state-input"
              />
              <CountrySelect
                region={region}
                name="country_code"
                required
                autoComplete="country"
                data-testid="country-select"
              />
              <Input
                label="Phone"
                name="phone"
                type="phone"
                required
                autoComplete="phone"
                data-testid="phone-input"
              />
            </div>
            {formState.error && (
              <div
                className="text-rose-500 text-xs font-medium py-2 mt-2"
                data-testid="address-error"
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
                Save Address
              </SubmitButton>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}

export default AddAddress
