"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type GuestAutoRegisterProps = {
  email: string
  firstName: string
  lastName?: string
}

export default function GuestAutoRegister({ email, firstName, lastName }: GuestAutoRegisterProps) {
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [checkLoading, setCheckLoading] = useState(true)
  const [hasAccount, setHasAccount] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAccount = async () => {
      try {
        const res = await fetch(`/api/check-account?email=${encodeURIComponent(email)}`)
        const data = await res.json()
        if (data.exists) {
          setHasAccount(true)
        }
      } catch (err) {
        console.error("Failed to check account status:", err)
      } finally {
        setCheckLoading(false)
      }
    }
    checkAccount()
  }, [email])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/guest-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.refresh()
        }, 2000)
      } else {
        setError(data.message || "Failed to create account. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  if (checkLoading) {
    return (
      <div className="mt-8 flex items-center justify-center gap-2 text-gray-400 text-sm italic">
        <div className="w-4 h-4 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin"></div>
        Checking account status...
      </div>
    )
  }

  if (hasAccount) {
    return (
      <div className="bg-[#2C1E36]/5 border border-[#2C1E36]/10 rounded-2xl p-6 md:p-8 mt-4 shadow-sm animate-in fade-in duration-500">
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md mb-4 border border-[#2C1E36]/5">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#2C1E36]">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h3 className="font-serif text-2xl text-[#2C1E36] mb-1">Welcome back, {firstName}!</h3>
          <p className="text-gray-500 mb-6">You already have an account with us. Log in to view all your session details in one place.</p>
          
          <button 
            onClick={() => router.push("/account")}
            className="w-full max-w-sm bg-[#2C1E36] hover:opacity-90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#2C1E36]/10 uppercase tracking-widest text-sm"
          >
            Login to View Sessions
          </button>
          
          <LocalizedClientLink 
            href="/account/sessions"
            className="mt-6 text-sm font-semibold text-[#2C1E36]/70 hover:text-[#2C1E36] hover:underline transition-colors"
          >
            Or lookup this session as guest
          </LocalizedClientLink>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-100 rounded-2xl p-6 mt-8 animate-in fade-in slide-in-from-bottom-4">
        <div className="flex items-center gap-3 text-green-700 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <h3 className="font-bold text-lg">Account Secured!</h3>
        </div>
        <p className="text-green-600">Your account is ready. You can now manage and reschedule your sessions anytime.</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-[#2C1E36]/5 to-transparent border border-[#2C1E36]/10 rounded-2xl p-6 md:p-8 mt-4 shadow-sm">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md border border-[#2C1E36]/5 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#2C1E36]">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
        </div>
        <div className="text-center md:text-left">
          <h3 className="font-serif text-2xl text-[#2C1E36] mb-1">Secure your session</h3>
          <p className="text-gray-500">Pick a password to easily track and reschedule your bookings anytime.</p>
        </div>
      </div>

      <form onSubmit={handleRegister} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choose a master password"
            required
            minLength={6}
            className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2C1E36]/20 focus:border-[#2C1E36]/30 outline-none transition-all placeholder:text-gray-400"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !password}
          className="bg-[#2C1E36] hover:opacity-90 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-[#2C1E36]/10 disabled:bg-gray-300 disabled:shadow-none uppercase tracking-widest text-sm"
        >
          {loading ? "Creating..." : "Save Password"}
        </button>
      </form>

      {error && (
        <p className="mt-3 text-sm text-red-500 font-medium text-center">{error}</p>
      )}

      <div className="mt-8 flex flex-col items-center gap-4">
        <p className="text-[11px] text-gray-400 leading-relaxed italic text-center max-w-sm">
          *By setting a password, you enable easy cancellations and date changes for all your "The Blissful Soul" sessions.
        </p>
        
        <LocalizedClientLink 
          href="/account/sessions"
          className="text-sm font-semibold text-[#2C1E36]/70 hover:text-[#2C1E36] hover:underline transition-colors"
        >
          Or lookup this session as guest
        </LocalizedClientLink>
      </div>
    </div>
  )
}
