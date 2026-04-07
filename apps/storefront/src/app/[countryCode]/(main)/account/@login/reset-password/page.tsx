import { Metadata } from "next"
import ResetPasswordTemplate from "@modules/account/templates/reset-password-template"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your account.",
}

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ResetPasswordPage({ searchParams }: Props) {
  const resolvedParams = await searchParams
  const token = resolvedParams.token as string
  const email = resolvedParams.email as string

  if (!token || !email) {
    return notFound()
  }

  return <ResetPasswordTemplate token={token} email={email} />
}
