"use client"

import { useEffect, useState } from "react"
import BookingSlotPicker from "@modules/booking/components/slot-picker"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type SessionBooking = {
  id: string
  display_id: number
  email: string
  booking_date: string
  booking_time: string
  razorpay_id: string
  cal_booking_id: string
  event_slug: string
  status: string
  created_at: string
  items: { id: string; title: string; quantity: number; unit_price: number; product_id: string }[]
}

export default function MySessionsPage({ email: initialEmail }: { email: string }) {
  const [email, setEmail] = useState(initialEmail)
  const [sessions, setSessions] = useState<SessionBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  
  // Lookup state
  const [lookupEmail, setLookupEmail] = useState("")
  const [lookupOrderId, setLookupOrderId] = useState("")
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupError, setLookupError] = useState<string | null>(null)

  // Rescheduling state
  const [reschedulingSession, setReschedulingSession] = useState<SessionBooking | null>(null)
  const [isRescheduling, setIsRescheduling] = useState(false)
  const [newSlot, setNewSlot] = useState<{ date: string, time: string, isoStart: string } | null>(null)

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  // Cancel confirmation state
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null)

  // Auto-dismiss toast after 5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const fetchSessions = (targetEmail: string) => {
    if (!targetEmail) {
      setLoading(false)
      return
    }

    setLoading(true)
    fetch(`/api/booking-history?email=${encodeURIComponent(targetEmail)}`)
      .then((res) => res.json())
      .then((data) => {
        setSessions(data.sessions || [])
      })
      .catch((err) => {
        console.error("Failed to fetch sessions:", err)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (initialEmail) {
      fetchSessions(initialEmail)
    } else {
      setLoading(false)
    }
  }, [initialEmail])

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLookupLoading(true)
    setLookupError(null)

    try {
      const response = await fetch(`/api/booking-lookup?email=${encodeURIComponent(lookupEmail)}&displayId=${lookupOrderId}`)
      const data = await response.json()

      if (response.ok && data.session) {
        setSessions([data.session])
        setEmail(lookupEmail)
      } else {
        setLookupError(data.message || "Booking not found. Please check your details.")
      }
    } catch (err) {
      setLookupError("An error occurred during lookup.")
    } finally {
      setLookupLoading(false)
    }
  }

  const checkPolicy = (session: SessionBooking) => {
    if (session.status === "canceled") return false
    
    try {
      const [time, modifier] = session.booking_time.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;

      const sessionDate = new Date(`${session.booking_date}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00+05:30`);
      const now = new Date();
      const diffInHours = (sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      return diffInHours >= 24;
    } catch (e) {
      return false
    }
  }

  const handleCancel = async (sessionId: string) => {
    setCancellingId(sessionId)
    setConfirmCancelId(null)
    try {
      const response = await fetch(`/api/booking-cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: sessionId, email }),
      })

      const data = await response.json()
      if (response.ok) {
        setToast({ message: "Session cancelled successfully. Our team will process your refund within 5-7 business days.", type: "success" })
        if (email) fetchSessions(email)
      } else {
        setToast({ message: data.message || "Failed to cancel session.", type: "error" })
      }
    } catch (err) {
      setToast({ message: "An error occurred while cancelling the session.", type: "error" })
    } finally {
      setCancellingId(null)
    }
  }

  const handleReschedule = async () => {
    if (!reschedulingSession || !newSlot) return

    setIsRescheduling(true)
    try {
      const response = await fetch(`/api/booking-reschedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          orderId: reschedulingSession.id, 
          email,
          newDate: newSlot.date,
          newTime: newSlot.time,
          slotIsoStart: newSlot.isoStart
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setReschedulingSession(null)
        setNewSlot(null)
        setToast({ message: `Session rescheduled to ${newSlot.date} at ${newSlot.time}. You'll receive a confirmation email shortly.`, type: "success" })
        if (email) fetchSessions(email)
      } else {
        setToast({ message: data.message || "Failed to reschedule session.", type: "error" })
      }
    } catch (err) {
      setToast({ message: "An error occurred while rescheduling.", type: "error" })
    } finally {
      setIsRescheduling(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full flex justify-center py-24">
        <div className="animate-spin h-10 w-10 border-[3px] border-[#2C1E36]/30 border-t-[#2C1E36] rounded-full" />
      </div>
    )
  }

  // Show Lookup Form if no email and no sessions
  if (!email && sessions.length === 0) {
    return (
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-white border border-[#2C1E36]/10 rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-[#2C1E36]/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#2C1E36]/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          
          <div className="text-center mb-10 relative z-10">
            <div className="w-20 h-20 bg-[#2C1E36]/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#2C1E36]">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-4xl font-serif text-[#2C1E36] mb-3">Find My Booking</h2>
            <p className="text-gray-500 text-lg">Enter your details to manage your upcoming session.</p>
          </div>

          <form onSubmit={handleLookup} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#2C1E36]/70 ml-1">Email Address</label>
              <input 
                type="email"
                required
                value={lookupEmail}
                onChange={(e) => setLookupEmail(e.target.value)}
                placeholder="e.g. atul@example.com"
                className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-[#2C1E36]/30 focus:ring-4 focus:ring-[#2C1E36]/5 outline-none transition-all placeholder:text-gray-400 text-lg"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#2C1E36]/70 ml-1">Booking ID</label>
              <input 
                type="text"
                required
                value={lookupOrderId}
                onChange={(e) => setLookupOrderId(e.target.value)}
                placeholder="e.g. 1045"
                className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-[#2C1E36]/30 focus:ring-4 focus:ring-[#2C1E36]/5 outline-none transition-all placeholder:text-gray-400 text-lg"
              />
            </div>
            
            <button
              type="submit"
              disabled={lookupLoading}
              className="w-full py-5 bg-[#2C1E36] text-white rounded-2xl font-bold hover:opacity-95 transition-all shadow-xl shadow-[#2C1E36]/10 disabled:bg-gray-200 mt-4 uppercase tracking-[0.2em] text-sm"
            >
              {lookupLoading ? "Searching..." : "View Session"}
            </button>
            
            {lookupError && (
              <div className="bg-red-50 text-red-600 text-sm p-5 rounded-2xl text-center border border-red-100 animate-in shake-in duration-500 font-medium">
                {lookupError}
              </div>
            )}
          </form>
        </div>
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="w-full flex flex-col items-center gap-y-6 py-24 text-center">
        <div className="w-24 h-24 bg-[#2C1E36]/5 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-[#2C1E36]/40">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <h2 className="text-3xl font-serif text-[#2C1E36]">No Sessions Found</h2>
        <p className="text-gray-500 text-lg max-w-sm">
          We couldn&apos;t find any active bookings for <strong>{email}</strong>.
        </p>
        <button
          onClick={() => { setEmail(""); setSessions([]); }}
          className="mt-4 px-8 py-3 text-[#2C1E36] font-bold border-2 border-[#2C1E36]/10 rounded-xl hover:bg-[#2C1E36]/5 transition-all text-sm uppercase tracking-widest"
        >
          Try a different email
        </button>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-y-8" data-testid="sessions-page">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-serif text-[#2C1E36]">My Sessions</h1>
          <p className="text-gray-500 mt-1">Hello, {sessions[0]?.email}</p>
        </div>
        {!initialEmail && (
          <button
            onClick={() => { setEmail(""); setSessions([]); }}
            className="text-xs font-bold text-[#2C1E36]/50 hover:text-[#2C1E36] uppercase tracking-widest flex items-center gap-2"
          >
            Clear Lookup
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        )}
      </div>

      <div className="grid gap-6">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`bg-white border border-[#2C1E36]/10 rounded-3xl p-6 md:p-8 hover:shadow-xl hover:shadow-[#2C1E36]/5 transition-all group ${session.status === "canceled" ? "opacity-60 saturate-0" : ""}`}
          >
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-x-4">
                <span className="text-2xl font-serif text-[#2C1E36]">
                  #{session.display_id}
                </span>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] ${
                  session.status === "canceled" 
                    ? "bg-gray-100 text-gray-400" 
                    : "bg-[#2C1E36]/5 text-[#2C1E36]"
                }`}>
                  {session.status === "canceled" ? "Canceled" : "Active Session"}
                </span>
              </div>
              <div className="text-sm font-semibold text-gray-400 bg-gray-50 px-4 py-1.5 rounded-full">
                Booked on {new Date(session.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>

            {/* Content Body */}
            <div className="grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7">
                {session.items.length > 0 && (
                  <h3 className="text-xl font-bold text-[#2C1E36] mb-4 group-hover:text-[#2C1E36]/80 transition-colors">
                    {session.items[0].title}
                  </h3>
                )}
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#2C1E36]/5 rounded-xl flex items-center justify-center text-[#2C1E36]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">Date</p>
                      <p className="text-sm font-bold text-[#2C1E36]">{session.booking_date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#2C1E36]/5 rounded-xl flex items-center justify-center text-[#2C1E36]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">Time</p>
                      <p className="text-sm font-bold text-[#2C1E36]">{session.booking_time}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-5 flex flex-col items-end gap-3 translate-y-2">
                {session.status !== "canceled" && (
                  <>
                    {checkPolicy(session) ? (
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => setReschedulingSession(session)}
                          className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#2C1E36] border border-[#2C1E36]/10 rounded-xl hover:bg-[#2C1E36]/5 transition-all text-center"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => setConfirmCancelId(session.id)}
                          disabled={cancellingId === session.id}
                          className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-red-500 border border-red-50 rounded-xl hover:bg-red-50 transition-all text-center disabled:opacity-50"
                        >
                          {cancellingId === session.id ? "Working..." : "Cancel"}
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-end opacity-40">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                          Policy Restricted
                        </span>
                        <span className="text-[9px] text-gray-400 italic">
                          (Less than 24h remaining)
                        </span>
                      </div>
                    )}
                  </>
                )}
                {session.status === "canceled" && (
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Post-Cancellation View
                  </span>
                )}
                
                {/* Footer Payment Info */}
                <div className="text-[10px] font-bold text-gray-400 flex items-center gap-2 mt-2">
                  <span className="uppercase tracking-widest">ID: {session.razorpay_id}</span>
                  <div className="w-1 h-1 bg-gray-200 rounded-full" />
                  <span className={session.status === "canceled" ? "text-red-400" : "text-green-500"}>
                    {session.status === "canceled" ? "REFUND PENDING" : "PAID ✓"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Rescheduling Modal */}
      {reschedulingSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-[#2C1E36]/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative">
            <div className="p-8 md:p-10 flex items-start justify-between relative z-10">
              <div>
                <h3 className="text-3xl font-serif text-[#2C1E36] mb-2">Reschedule Session</h3>
                <p className="text-gray-500 max-w-sm">
                  Choose a new available time slot for your healing session.
                </p>
              </div>
              <button 
                onClick={() => { setReschedulingSession(null); setNewSlot(null); }}
                className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-[#2C1E36] hover:bg-gray-100 transition-all shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <div className="px-8 pb-8 md:px-10 md:pb-10 h-[60vh] md:h-auto overflow-y-auto relative z-10">
              <BookingSlotPicker 
                eventSlug={reschedulingSession.event_slug}
                onSelect={(date, time, isoStart) => setNewSlot({ date, time, isoStart })}
              />
              
              <div className="mt-10 flex flex-col md:flex-row gap-4">
                <button
                  disabled={!newSlot || isRescheduling}
                  onClick={handleReschedule}
                  className="flex-1 py-5 bg-[#2C1E36] text-white rounded-[1.5rem] font-bold hover:opacity-95 transition-all disabled:bg-gray-100 disabled:text-gray-400 shadow-xl shadow-[#2C1E36]/10 uppercase tracking-widest text-sm"
                >
                  {isRescheduling ? "Rescheduling..." : "Confirm New Slot"}
                </button>
                <button
                  onClick={() => { setReschedulingSession(null); setNewSlot(null); }}
                  className="px-10 py-5 bg-gray-50 text-gray-600 rounded-[1.5rem] font-bold hover:bg-gray-100 transition-all uppercase tracking-widest text-sm"
                >
                  Go Back
                </button>
              </div>
            </div>

            {/* Background Decorative Blur */}
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#2C1E36]/5 rounded-full -ml-32 -mb-32 blur-3xl -z-0" />
          </div>
        </div>
      )}
      {/* Cancel Confirmation Modal */}
      {confirmCancelId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-[#2C1E36]/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 p-8 md:p-10 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif text-[#2C1E36] mb-3">Cancel This Session?</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">This action cannot be undone. If eligible, our team will process your refund within 5-7 business days.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setConfirmCancelId(null)}
                className="flex-1 py-4 bg-gray-50 text-gray-600 rounded-2xl font-bold hover:bg-gray-100 transition-all uppercase tracking-widest text-sm"
              >
                Keep Session
              </button>
              <button
                onClick={() => handleCancel(confirmCancelId)}
                className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all uppercase tracking-widest text-sm shadow-lg shadow-red-100"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-full max-w-lg px-4 animate-in slide-in-from-bottom-4 fade-in duration-500">
          <div className={`rounded-2xl p-5 shadow-2xl flex items-start gap-4 border ${
            toast.type === 'success' 
              ? 'bg-green-50 border-green-100 text-green-800' 
              : toast.type === 'error' 
                ? 'bg-red-50 border-red-100 text-red-800' 
                : 'bg-blue-50 border-blue-100 text-blue-800'
          }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              toast.type === 'success' ? 'bg-green-100' : toast.type === 'error' ? 'bg-red-100' : 'bg-blue-100'
            }`}>
              {toast.type === 'success' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              ) : toast.type === 'error' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm leading-relaxed">{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="opacity-50 hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
