import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Account Login",
  description: "Sign in to your The Blissful Soul account.",
}

export default function Login() {
  return <LoginTemplate />
}
