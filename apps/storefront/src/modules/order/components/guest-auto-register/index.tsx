"use client"

import { useActionState, useEffect } from "react"
import { signup } from "@lib/data/customer"
import { Button, Input, Heading, Text } from "@medusajs/ui"
import { CheckCircleSolid } from "@medusajs/icons"

type GuestAutoRegisterProps = {
  email: string
  firstName: string
  lastName: string
  phone: string
}

export default function GuestAutoRegister({
  email,
  firstName,
  lastName,
  phone,
}: GuestAutoRegisterProps) {
  // Use React 19 useActionState compatible format or fallback to older useFormState
  const [message, formAction, isPending] = useActionState(signup, null)

  const isSuccess = typeof message === "object" && message?.id

  if (isSuccess) {
    return (
      <div className="w-full bg-green-50 p-6 md:p-8 rounded-2xl border border-green-200 shadow-sm mb-6 flex flex-col items-center text-center gap-2">
        <CheckCircleSolid className="text-green-500 w-10 h-10" />
        <Heading level="h2" className="text-green-900 font-serif">
          Account Created Successfully!
        </Heading>
        <Text className="text-green-800">
          Your order has been seamlessly linked to your new account. You can now log in anytime to track your history and bookings.
        </Text>
      </div>
    )
  }

  return (
    <div className="w-full bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm mb-6">
      <div className="text-center mb-6">
        <Heading level="h2" className="text-2xl font-serif text-gray-900 mb-2">
          Want to track this order easily?
        </Heading>
        <Text className="text-gray-500">
          Set a password for <span className="font-semibold text-gray-900">{email}</span> to secure your account and access all your bookings in one place.
        </Text>
      </div>

      <form action={formAction} className="flex flex-col gap-y-4 max-w-sm mx-auto">
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="first_name" value={firstName} />
        <input type="hidden" name="last_name" value={lastName} />
        <input type="hidden" name="phone" value={phone} />

        <div className="flex flex-col gap-y-2">
          <Input
            type="password"
            name="password"
            required
            placeholder="Enter a secure password"
            autoComplete="new-password"
          />
        </div>

        {typeof message === "string" && (
          <Text className="text-red-500 text-small-regular text-center">
            {message}
          </Text>
        )}

        <Button 
          className="w-full bg-black text-white hover:bg-gray-800 transition-colors mt-2" 
          type="submit" 
          isLoading={isPending}
        >
          Create My Account
        </Button>
      </form>
    </div>
  )
}
