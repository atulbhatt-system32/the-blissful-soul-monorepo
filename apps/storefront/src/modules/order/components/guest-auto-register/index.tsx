"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

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
    return <div className="mt-8 animate-pulse text-gray-400 text-sm italic">Checking account status...</div>
  }

  if (hasAccount) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 mt-8 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Welcome back, {firstName}!</h3>
            <p className="text-sm text-gray-500">You already have an account with us.</p>
          </div>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
          <p className="text-sm text-gray-600">Log in to view all your session details in one place.</p>
          <button 
            onClick={() => router.push("/account/sessions")}
            className="whitespace-nowrap bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-blue-100"
          >
            Go to Sessions
          </button>
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
    <div className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100 rounded-2xl p-6 mt-8 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500 font-bold">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Secure your session</h3>
          <p className="text-sm text-gray-500">Pick a password to easily track and reschedule your bookings.</p>
        </div>
      </div>

      <form onSubmit={handleRegister} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choose a password"
            required
            minLength={6}
            className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !password}
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-pink-100 disabled:bg-gray-300 disabled:shadow-none font-sans"
        >
          {loading ? "Creating..." : "Save Password"}
        </button>
      </form>

      {error && (
        <p className="mt-3 text-sm text-red-500 font-medium">{error}</p>
      )}

      <p className="mt-4 text-[11px] text-gray-400 leading-relaxed italic">
        *By setting a password, you enable easy cancellations and date changes for all your "The Blissful Soul" sessions.
      </p>
    </div>
  )
}
