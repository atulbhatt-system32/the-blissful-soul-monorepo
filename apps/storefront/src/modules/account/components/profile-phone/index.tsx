"use client"

import React, { useEffect, useActionState } from "react";

import Input from "@modules/common/components/input"

import AccountInfo from "../account-info"
import { HttpTypes } from "@medusajs/types"
import { updateCustomer } from "@lib/data/customer"
import { canonicalPhone } from "@lib/util/phone"
import { validatePhone } from "@lib/util/validation"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const ProfilePhone: React.FC<MyInformationProps> = ({ customer }) => {
  const [successState, setSuccessState] = React.useState(false)
  const [phone, setPhone] = React.useState(customer.phone ?? "")
  const [error, setError] = React.useState<string | undefined>()
  const [touched, setTouched] = React.useState(false)

  const updateCustomerPhone = async (
    _currentState: Record<string, unknown>,
    formData: FormData
  ) => {
    const submitted = formData.get("phone") as string

    // Re-checked here because a form action is a public endpoint; the inline
    // check below is only for immediate feedback.
    const invalid = validatePhone(submitted)
    if (invalid) {
      return { success: false, error: invalid }
    }

    const customer = {
      // Stored canonically so sign-in by phone can match it.
      phone: canonicalPhone(submitted),
    }

    try {
      await updateCustomer(customer)
      return { success: true, error: null }
    } catch (error: any) {
      return { success: false, error: error.toString() }
    }
  }

  const [state, formAction] = useActionState(updateCustomerPhone, {
    error: false,
    success: false,
  })

  const handleSubmit = (formData: FormData) => {
    const invalid = validatePhone(phone)

    if (invalid) {
      setTouched(true)
      setError(invalid)
      return
    }

    setError(undefined)
    formAction(formData)
  }

  const clearState = () => {
    setSuccessState(false)
    setPhone(customer.phone ?? "")
    setError(undefined)
    setTouched(false)
  }

  useEffect(() => {
    setSuccessState(state.success)
  }, [state])

  return (
    <form action={handleSubmit} className="w-full" noValidate>
      <AccountInfo
        label="Phone"
        currentInfo={customer.phone ?? "Not provided"}
        isSuccess={successState}
        isError={!!state.error}
        errorMessage={state.error}
        clearState={clearState}
        data-testid="account-phone-editor"
      >
        <div className="grid grid-cols-1 gap-y-2">
          <Input
            label="Phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
              if (touched) setError(validatePhone(e.target.value) ?? undefined)
            }}
            onBlur={() => {
              setTouched(true)
              setError(validatePhone(phone) ?? undefined)
            }}
            error={touched ? error : undefined}
            data-testid="phone-input"
          />
          {!(touched && error) && (
            <p className="text-gray-400 text-[11px] px-1 leading-relaxed">
              10-digit mobile number, with or without +91.
            </p>
          )}
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfilePhone
