"use client"

import React, { useEffect, useActionState } from "react"
import Input from "@modules/common/components/input"
import AccountInfo from "../account-info"
import { HttpTypes } from "@medusajs/types"
import { toast } from "@medusajs/ui"
import { updateCustomerPassword } from "@lib/data/customer"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const ProfilePassword: React.FC<MyInformationProps> = ({ customer }) => {
  const [successState, setSuccessState] = React.useState(false)

  const [state, formAction] = useActionState(updateCustomerPassword, {
    success: false,
    error: null,
  })

  useEffect(() => {
    if (state.success) {
      toast.success("Password updated successfully")
      setSuccessState(true)
    } else if (state.error) {
      toast.error(state.error)
    }
  }, [state])

  const clearState = () => {
    setSuccessState(false)
  }

  return (
    <form
      action={formAction}
      onReset={() => clearState()}
      className="w-full"
    >
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
            data-testid="old-password-input"
          />
          <Input
            label="New Password"
            type="password"
            name="new_password"
            required
            data-testid="new-password-input"
          />
          <Input
            label="Confirm New Password"
            type="password"
            name="confirm_password"
            required
            data-testid="confirm-password-input"
          />
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfilePassword
