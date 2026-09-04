"use client"

import React, { useEffect, useActionState, useState } from "react"
import Input from "@modules/common/components/input"
import AccountInfo from "../account-info"
import { HttpTypes } from "@medusajs/types"
import { toast } from "@medusajs/ui"
import { updateCustomerPassword } from "@lib/data/customer"
import {
  PASSWORD_MIN_LENGTH,
  collectErrors,
  validatePassword,
  validatePasswordConfirmation,
} from "@lib/util/validation"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const FIELDS = ["old_password", "new_password", "confirm_password"] as const

/** The server action re-checks all of this before touching the auth provider. */
function validateForm(values: Record<string, string>) {
  return collectErrors({
    // The current password is only checked for presence — it was set under
    // whatever rules applied at the time, and the backend verifies it anyway.
    old_password: values.old_password
      ? null
      : "Enter your current password.",
    new_password:
      validatePassword(values.new_password) ??
      (values.old_password && values.new_password === values.old_password
        ? "New password must be different from your current password."
        : null),
    confirm_password: validatePasswordConfirmation(
      values.new_password,
      values.confirm_password
    ),
  })
}

const ProfilePassword: React.FC<MyInformationProps> = ({ customer }) => {
  const [successState, setSuccessState] = React.useState(false)
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(FIELDS.map((f) => [f, ""]))
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const [state, formAction] = useActionState(updateCustomerPassword, {
    success: false,
    error: null,
  })

  useEffect(() => {
    if (state.success) {
      toast.success("Password updated successfully")
      setSuccessState(true)
      setValues(Object.fromEntries(FIELDS.map((f) => [f, ""])))
      setTouched({})
      setErrors({})
    } else if (state.error) {
      toast.error(state.error)
    }
  }, [state])

  const clearState = () => {
    setSuccessState(false)
    setValues(Object.fromEntries(FIELDS.map((f) => [f, ""])))
    setTouched({})
    setErrors({})
  }

  const setField = (name: string, value: string) => {
    const next = { ...values, [name]: value }
    setValues(next)

    if (touched[name]) {
      const found = validateForm(next)
      setErrors((prev) => ({ ...prev, [name]: found[name] ?? "" }))
    }
  }

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
    const found = validateForm(values)
    setErrors((prev) => ({ ...prev, [name]: found[name] ?? "" }))
  }

  const handleSubmit = (formData: FormData) => {
    const found = validateForm(values)

    if (Object.keys(found).length > 0) {
      setErrors(found)
      setTouched(Object.fromEntries(FIELDS.map((f) => [f, true])))
      return
    }

    setErrors({})
    formAction(formData)
  }

  const fieldError = (name: string) =>
    touched[name] && errors[name] ? errors[name] : undefined

  return (
    <form action={handleSubmit} onReset={() => clearState()} className="w-full" noValidate>
      <AccountInfo
        label="Password"
        currentInfo={
          <span className="text-gray-400 font-normal">••••••••••••</span>
        }
        isSuccess={successState}
        isError={false}
        errorMessage={undefined}
        clearState={clearState}
        data-testid="account-password-editor"
      >
        <div className="grid grid-cols-1 gap-y-3">
          <Input
            label="Current Password"
            name="old_password"
            required
            type="password"
            autoComplete="current-password"
            value={values.old_password}
            onChange={(e) => setField("old_password", e.target.value)}
            onBlur={() => handleBlur("old_password")}
            error={fieldError("old_password")}
            data-testid="old-password-input"
          />
          <Input
            label="New Password"
            type="password"
            name="new_password"
            required
            autoComplete="new-password"
            value={values.new_password}
            onChange={(e) => setField("new_password", e.target.value)}
            onBlur={() => handleBlur("new_password")}
            error={fieldError("new_password")}
            data-testid="new-password-input"
          />
          <Input
            label="Confirm New Password"
            type="password"
            name="confirm_password"
            required
            autoComplete="new-password"
            value={values.confirm_password}
            onChange={(e) => setField("confirm_password", e.target.value)}
            onBlur={() => handleBlur("confirm_password")}
            error={fieldError("confirm_password")}
            data-testid="confirm-password-input"
          />
          {!fieldError("new_password") && (
            <p className="text-gray-400 text-[11px] px-1 leading-relaxed">
              At least {PASSWORD_MIN_LENGTH} characters, including a letter and
              a number.
            </p>
          )}
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfilePassword
