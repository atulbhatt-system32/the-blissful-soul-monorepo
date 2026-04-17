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
    <div className="w-full flex justify-center px-4 md:px-8 py-12 md:py-24">
      {currentView === "sign-in" ? (
        <Login setCurrentView={toggleView} />
      ) : currentView === "register" ? (
        <Register setCurrentView={toggleView} />
      ) : (
        <div className="max-w-md w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-6 transition-all duration-700 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-purple-900/10 border border-purple-50/50">
           <div className="w-16 h-16 bg-[#2C1E36]/5 rounded-full flex items-center justify-center mb-8">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2C1E36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"></path>
              </svg>
           </div>
           
           <h1 className="text-3xl md:text-4xl font-serif text-[#2C1E36] mb-4 text-center font-bold tracking-tight">Recovery</h1>
           
           {success ? (
             <div className="w-full text-center">
                <div className="bg-green-50/50 border border-green-100 p-8 rounded-3xl mb-8">
                   <p className="text-green-800 text-sm font-medium italic leading-relaxed">
                     "The message has been sent."<br/>
                     <span className="not-italic block mt-1 text-xs opacity-70">Check your email (and spam folder) for the link.</span>
                   </p>
                </div>
                <button 
                  onClick={() => toggleView(LOGIN_VIEW.SIGN_IN)}
                  className="bg-[#2C1E36] text-white px-10 h-14 rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-[#3D2B4A] transition-all shadow-xl shadow-purple-900/20 active:scale-95 w-full flex items-center justify-center"
                >
                  Back to Sign in
                </button>
             </div>
           ) : (
             <>
               <p className="text-center text-[#665D6B] text-base mb-10 max-w-[280px]">
                 Enter your email and we'll send you a sign-in link.
               </p>
               <form className="w-full flex flex-col gap-y-6" onSubmit={handleResetRequest}>
                 <div className="flex flex-col w-full gap-y-2">
                   <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C5A059] ml-1 font-sans">Email Address</label>
                   <input 
                     type="email" 
                     placeholder="your@email.com" 
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required
                     className="w-full bg-gray-50/50 border border-gray-100 py-4 px-6 rounded-2xl text-sm focus:outline-none focus:border-[#2C1E36]/30 transition-all font-sans"
                   />
                 </div>
                 {error && <p className="text-red-500 text-[11px] font-medium italic px-2">† {error}</p>}
                 <button 
                   type="submit"
                   disabled={loading}
                   className="bg-[#2C1E36] text-white px-10 h-14 rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-[#3D2B4A] transition-all shadow-xl shadow-purple-900/20 active:scale-95 w-full disabled:bg-gray-200 disabled:shadow-none flex items-center justify-center mt-2"
                 >
                   {loading ? "Aligning..." : "Send Reset Link"}
                 </button>
               </form>
               <button 
                 onClick={() => toggleView(LOGIN_VIEW.SIGN_IN)}
                 className="mt-8 text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-[#2C1E36] transition-colors"
               >
                 &larr; Nevermind, back to login
               </button>
             </>
           )}
        </div>
      )}
    </div>
  )
}

export default LoginTemplate
