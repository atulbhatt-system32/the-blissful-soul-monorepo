"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"
import { trackFbEvent } from "@lib/util/fbq"
import {
  PASSWORD_MIN_LENGTH,
  collectErrors,
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordConfirmation,
  validatePhone,
} from "@lib/util/validation"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

/** Validates the whole form. The server action re-checks all of this. */
function validateForm(values: Record<string, string>) {
  return collectErrors({
    first_name: validateName(values.first_name, "First name"),
    last_name: validateName(values.last_name, "Last name"),
    email: validateEmail(values.email),
    phone: validatePhone(values.phone),
    password: validatePassword(values.password),
    confirm_password: validatePasswordConfirmation(
      values.password,
      values.confirm_password
    ),
  })
}

const FIELDS = [
  "first_name",
  "last_name",
  "email",
  "phone",
  "password",
  "confirm_password",
] as const

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)
  const hasSubmitted = useRef(false)
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(FIELDS.map((f) => [f, ""]))
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (hasSubmitted.current && message === null) {
      trackFbEvent("Lead")
    }
  }, [message])

  const setField = (name: string, value: string) => {
    const next = { ...values, [name]: value }
    setValues(next)

    // Only re-validate a field the user has already left, so errors don't
    // appear while they are still typing their first attempt.
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
    hasSubmitted.current = true
    formAction(formData)
  }

  const fieldError = (name: string) =>
    touched[name] && errors[name] ? errors[name] : undefined

  return (
    <div
      className="max-w-sm flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700"
      data-testid="register-page"
    >
      <h1 className="text-3xl font-serif text-[#2C1E36] mb-4 text-center">
        Create Your Account
      </h1>
      <p className="text-center text-sm text-gray-500 mb-8 max-w-[280px]">
        Create an account to shop, save wishlists, and track your orders.
      </p>
      <form className="w-full flex flex-col" action={handleSubmit} noValidate>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="First name"
            name="first_name"
            required
            autoComplete="given-name"
            value={values.first_name}
            onChange={(e) => setField("first_name", e.target.value)}
            onBlur={() => handleBlur("first_name")}
            error={fieldError("first_name")}
            data-testid="first-name-input"
          />
          <Input
            label="Last name"
            name="last_name"
            required
            autoComplete="family-name"
            value={values.last_name}
            onChange={(e) => setField("last_name", e.target.value)}
            onBlur={() => handleBlur("last_name")}
            error={fieldError("last_name")}
            data-testid="last-name-input"
          />
          <Input
            label="Email"
            name="email"
            required
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => setField("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            error={fieldError("email")}
            data-testid="email-input"
          />
          <Input
            label="Phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            value={values.phone}
            onChange={(e) => setField("phone", e.target.value)}
            onBlur={() => handleBlur("phone")}
            error={fieldError("phone")}
            data-testid="phone-input"
          />
          <Input
            label="Password"
            name="password"
            required
            type="password"
            autoComplete="new-password"
            value={values.password}
            onChange={(e) => setField("password", e.target.value)}
            onBlur={() => handleBlur("password")}
            error={fieldError("password")}
            data-testid="password-input"
          />
          <Input
            label="Confirm password"
            name="confirm_password"
            required
            type="password"
            autoComplete="new-password"
            value={values.confirm_password}
            onChange={(e) => setField("confirm_password", e.target.value)}
            onBlur={() => handleBlur("confirm_password")}
            error={fieldError("confirm_password")}
            data-testid="confirm-password-input"
          />
        </div>

        {!fieldError("password") && (
          <p className="text-gray-400 text-[11px] mt-2 px-1 leading-relaxed">
            At least {PASSWORD_MIN_LENGTH} characters, including a letter and a
            number.
          </p>
        )}
        <p className="text-gray-400 text-[11px] mt-1 px-1 leading-relaxed">
          You can sign in with either your email or your phone number.
        </p>

        <ErrorMessage error={message} data-testid="register-error" />
        <span className="text-center text-gray-400 text-[11px] mt-8 leading-relaxed">
          By joining, you agree to Pragya Vijh&apos;s{" "}
          <LocalizedClientLink
            href="/privacy"
            className="text-[#2C1E36] font-bold underline underline-offset-4"
          >
            Privacy Policy
          </LocalizedClientLink>{" "}
          and{" "}
          <LocalizedClientLink
            href="/terms"
            className="text-[#2C1E36] font-bold underline underline-offset-4"
          >
            Terms of Service
          </LocalizedClientLink>
          .
        </span>
        <SubmitButton
          className="w-full mt-10 bg-[#2C1E36] text-white rounded-2xl h-14 text-[11px] uppercase tracking-[0.2em] font-black hover:opacity-90 shadow-xl shadow-purple-900/10 active:scale-95 transition-all"
          data-testid="register-button"
        >
          Create Account
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Already a member?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="underline"
        >
          Sign in
        </button>
        .
      </span>
    </div>
  )
}

export default Register
