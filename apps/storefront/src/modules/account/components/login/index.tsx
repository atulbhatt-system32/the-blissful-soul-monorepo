import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700"
      data-testid="login-page"
    >
      <h1 className="text-3xl font-serif text-[#2C1E36] mb-4 text-center">
        Welcome Back
      </h1>
      <p className="text-center text-sm text-gray-500 mb-8 max-w-[280px]">
        Sign in to your account to continue shopping.
      </p>
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Email"
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
          <div className="flex justify-end -mt-1">
             <button
                type="button"
                onClick={() => setCurrentView(LOGIN_VIEW.FORGOT_PASSWORD)}
                className="text-xsmall-regular text-[#2C1E36] hover:underline font-medium"
             >
                Forgot password?
             </button>
          </div>
        </div>
        <ErrorMessage error={message} data-testid="login-error-message" />
        <span className="text-center text-gray-400 text-[11px] mt-8 leading-relaxed block">
          By signing in, you agree to The Blissful Soul&apos;s{" "}
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
        <SubmitButton data-testid="sign-in-button" className="w-full mt-10 bg-[#2C1E36] text-white rounded-2xl h-14 text-[11px] uppercase tracking-[0.2em] font-black hover:opacity-90 shadow-xl shadow-purple-900/10 active:scale-95 transition-all">
          Authorize Session
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Not a member?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="underline"
          data-testid="register-button"
        >
          Join us
        </button>
        .
      </span>
      <span className="text-center text-ui-fg-base text-small-regular mt-2">
        Ordered as a guest?{" "}
        <LocalizedClientLink href="/order/lookup" className="underline">
          Track your order
        </LocalizedClientLink>
        .
      </span>
    </div>
  )
}

export default Login
