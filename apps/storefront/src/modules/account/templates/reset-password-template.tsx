"use client"

import { useState } from "react"
import { resetPassword } from "@lib/data/customer"
import Input from "@modules/common/components/input"
import ErrorMessage from "@modules/checkout/components/error-message"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button } from "@medusajs/ui"


type Props = {
  token: string
  email: string
}

const ResetPasswordTemplate = ({ token, email }: Props) => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      setLoading(false)
      return
    }

    try {
      const result = await resetPassword(email, token, password)
      if (result.success) {
        setSuccess(true)
      } else {
        setError(result.error || "Failed to reset password.")
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full flex justify-center py-6 md:py-10">
      <div className="max-w-md w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-purple-900/10 border border-purple-50/50">
        <div className="w-20 h-20 bg-[#2C1E36]/5 rounded-full flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 rounded-full border border-[#2C1E36]/10 animate-pulse"></div>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2C1E36" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-serif text-[#2C1E36] mb-3 text-center font-bold tracking-tight">New Password</h1>
        <p className="text-[#665D6B] text-base text-center mb-10 max-w-[280px]">
          Create a secure new password for <span className="font-semibold block text-[#2C1E36] mt-1 italic">${email}</span>
        </p>
        
        {success ? (
          <div className="w-full text-center py-4">
            <div className="bg-green-50/50 border border-green-100 p-8 rounded-3xl mb-8">
              <p className="text-green-800 text-sm font-medium italic leading-relaxed">
                "Your path is renewed."<br/>
                <span className="not-italic block mt-1 text-xs opacity-70">Password reset successful.</span>
              </p>
            </div>
            <LocalizedClientLink 
              href="/account"
              className="bg-[#2C1E36] text-white px-10 py-4.5 rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-[#3D2B4A] transition-all shadow-xl shadow-purple-900/20 inline-block w-full"
            >
              Back to Login
            </LocalizedClientLink>
          </div>
        ) : (
          <form className="w-full flex flex-col gap-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col w-full gap-y-5">
              <Input
                label="New Password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pt-4 pb-1 block w-full h-14 px-6 mt-0 bg-gray-50/50 border border-gray-100 rounded-2xl appearance-none focus:outline-none focus:border-[#2C1E36]/30 transition-all font-sans text-sm"
              />
              <Input
                label="Confirm New Password"
                name="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pt-4 pb-1 block w-full h-14 px-6 mt-0 bg-gray-50/50 border border-gray-100 rounded-2xl appearance-none focus:outline-none focus:border-[#2C1E36]/30 transition-all font-sans text-sm"
              />
            </div>
            
            <ErrorMessage error={error} />
            
            <Button 
              type="submit"
              disabled={loading}
              isLoading={loading}
              className="bg-[#2C1E36] text-white h-14 w-full rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-[#3D2B4A] transition-all shadow-xl shadow-purple-900/20 active:scale-95 flex items-center justify-center mt-2"
            >
              Set New Password
            </Button>

            <LocalizedClientLink 
              href="/account"
              className="text-center text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-[#2C1E36] transition-colors mt-4"
            >
              &larr; Return to Sign in
            </LocalizedClientLink>
          </form>
        )}
      </div>
    </div>
  )
}

export default ResetPasswordTemplate
