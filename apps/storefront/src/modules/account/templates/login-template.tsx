"use client"

import { useState } from "react"

import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"
import { requestPasswordReset } from "@lib/data/customer"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
  FORGOT_PASSWORD = "forgot-password",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState("sign-in")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleView = (view: string) => {
    setCurrentView(view)
    setSuccess(false)
    setError(null)
  }

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await requestPasswordReset(email)
      if (result.success) {
        setSuccess(true)
      } else {
        setError(result.error || "Failed to send reset link.")
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full flex justify-start px-4 md:px-8 py-8">
      {currentView === "sign-in" ? (
        <Login setCurrentView={toggleView} />
      ) : currentView === "register" ? (
        <Register setCurrentView={toggleView} />
      ) : (
        <div className="max-w-sm w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4">
           <h1 className="text-large-semi uppercase mb-6">Forgot Password</h1>
           
           {success ? (
             <div className="bg-green-50 border border-green-100 p-6 rounded-2xl text-center">
                <p className="text-green-700 text-sm font-medium mb-4 italic">
                  Link Sent! Please check your email inbox (and spam) to reset your password.
                </p>
                <button 
                  onClick={() => toggleView("sign-in")}
                  className="bg-[#2C1E36] text-white px-8 py-3 rounded-xl text-xs font-bold uppercase"
                >
                  Back to Login
                </button>
             </div>
           ) : (
             <>
               <p className="text-center text-base-regular text-ui-fg-base mb-8">
                 Enter your email address and we'll send you a link to reset your password.
               </p>
               <form className="w-full flex flex-col gap-y-4" onSubmit={handleResetRequest}>
                 <div className="flex flex-col w-full">
                   <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2 font-sans">Email</label>
                   <input 
                     type="email" 
                     placeholder="your@email.com" 
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required
                     className="w-full bg-white border border-gray-100 py-3 px-6 rounded-xl text-sm focus:outline-none focus:border-[#2C1E36]/30 transition-all font-sans"
                   />
                 </div>
                 {error && <p className="text-red-500 text-[11px] font-medium italic">{error}</p>}
                 <button 
                   type="submit"
                   disabled={loading}
                   className="bg-[#2C1E36] text-white px-8 py-3.5 rounded-xl text-[13px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg active:scale-95 w-full disabled:bg-gray-300"
                 >
                   {loading ? "Sending..." : "Send Reset Link"}
                 </button>
               </form>
               <button 
                 onClick={() => toggleView("sign-in")}
                 className="mt-6 underline text-sm text-[#2C1E36] font-medium"
               >
                 Back to Sign in
               </button>
             </>
           )}
        </div>
      )}
    </div>
  )
}

export default LoginTemplate
