"use client"

import { useEffect, useState } from "react"
import BookingSlotPicker from "@modules/booking/components/slot-picker"

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
        setEmail(lookupEmail) // Effectively "logs them in" to this session's view
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
    if (!window.confirm("Are you sure you want to cancel this session? This action cannot be undone.")) {
      return
    }

    setCancellingId(sessionId)
    try {
      const response = await fetch(`/api/booking-cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: sessionId, email }),
      })

      const data = await response.json()
      if (response.ok) {
        alert("Session cancelled successfully. Our team will process your refund shortly.")
        if (email) fetchSessions(email)
      } else {
        alert(data.message || "Failed to cancel session.")
      }
    } catch (err) {
      alert("An error occurred while cancelling the session.")
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
        alert("Session rescheduled successfully!")
        setReschedulingSession(null)
        setNewSlot(null)
        if (email) fetchSessions(email)
      } else {
        alert(data.message || "Failed to reschedule session.")
      }
    } catch (err) {
      alert("An error occurred while rescheduling.")
    } finally {
      setIsRescheduling(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full flex justify-center py-16">
        <div className="animate-spin h-8 w-8 border-4 border-pink-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  // Show Lookup Form if no email and no sessions
  if (!email && sessions.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-pink-400">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Find My Booking</h2>
          <p className="text-gray-500">Enter your details to view and manage your session.</p>
        </div>

        <form onSubmit={handleLookup} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Email Address</label>
            <input 
              type="email"
              required
              value={lookupEmail}
              onChange={(e) => setLookupEmail(e.target.value)}
              placeholder="e.g. atul@example.com"
              className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-pink-300 focus:ring-4 focus:ring-pink-50 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Booking ID</label>
            <input 
              type="text"
              required
              value={lookupOrderId}
              onChange={(e) => setLookupOrderId(e.target.value)}
              placeholder="e.g. 1045"
              className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-pink-300 focus:ring-4 focus:ring-pink-50 outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={lookupLoading}
            className="w-full py-4 bg-pink-500 text-white rounded-2xl font-bold hover:bg-pink-600 transition-all shadow-lg shadow-pink-100 disabled:bg-gray-200 mt-2"
          >
            {lookupLoading ? "Searching..." : "View Sessions"}
          </button>
          
          {lookupError && (
            <div className="bg-red-50 text-red-500 text-sm p-4 rounded-xl text-center border border-red-100 animate-in shake-in">
              {lookupError}
            </div>
          )}
        </form>
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="w-full flex flex-col items-center gap-y-4 py-16" data-testid="no-sessions-container">
        <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-pink-400">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">No Sessions Found</h2>
        <p className="text-gray-500 text-center max-w-sm">
          We couldn&apos;t find any sessions for <strong>{email}</strong>.
        </p>
        <button
          onClick={() => { setEmail(""); setSessions([]); }}
          className="mt-4 px-6 py-2.5 text-pink-500 font-semibold transition-colors"
        >
          Try a different email
        </button>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-y-4" data-testid="sessions-page">
      {sessions.map((session) => (
        <div
          key={session.id}
          className={`bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow ${session.status === "canceled" ? "opacity-60" : ""}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-x-3">
              <span className="text-lg font-bold text-gray-900">
                #{session.display_id}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                session.status === "canceled" 
                  ? "bg-gray-100 text-gray-500" 
                  : "bg-pink-100 text-pink-600"
              }`}>
                {session.status === "canceled" ? "Canceled" : "Session"}
              </span>
            </div>
            <span className="text-xs text-gray-400">
              {new Date(session.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Booking Details */}
          <div className={`rounded-lg p-4 mb-3 ${
            session.status === "canceled" 
              ? "bg-gray-50" 
              : "bg-gradient-to-r from-pink-50 to-purple-50"
          }`}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date</p>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={session.status === "canceled" ? "text-gray-400" : "text-pink-500"}>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {session.booking_date}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Time</p>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={session.status === "canceled" ? "text-gray-400" : "text-pink-500"}>
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {session.booking_time}
                </p>
              </div>
            </div>
          </div>

          {/* Session Title & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            {session.items.length > 0 && (
              <p className="text-sm text-gray-700">
                <span className="font-medium">{session.items[0].title}</span>
              </p>
            )}

            {session.status !== "canceled" && (
              <div className="flex items-center gap-x-2">
                {checkPolicy(session) ? (
                  <>
                    <button
                      onClick={() => setReschedulingSession(session)}
                      className="text-xs font-semibold text-pink-500 hover:text-pink-600 px-3 py-1.5 border border-pink-200 rounded-lg hover:bg-pink-50 transition-colors"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleCancel(session.id)}
                      disabled={cancellingId === session.id}
                      className="text-xs font-semibold text-red-500 hover:text-red-600 px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      {cancellingId === session.id ? "Processing..." : "Cancel"}
                    </button>
                  </>
                ) : (
                  <span className="text-[10px] text-gray-400 italic">
                    Modifications closed (24h policy)
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Payment Info */}
          <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
            <span>Payment: {session.razorpay_id}</span>
            <span className={`px-2 py-0.5 rounded-full font-medium ${
              session.status === "canceled" ? "bg-gray-100 text-gray-400" : "bg-green-50 text-green-600"
            }`}>
              {session.status === "canceled" ? "To be Refunded" : "Paid ✓"}
            </span>
          </div>
        </div>
      ))}

      {/* Rescheduling Modal */}
      {reschedulingSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Reschedule Session</h3>
              <button 
                onClick={() => { setReschedulingSession(null); setNewSlot(null); }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-6 font-medium">
                Pick a new date and time for {reschedulingSession.items[0]?.title}.
              </p>
              
              <BookingSlotPicker 
                eventSlug={reschedulingSession.event_slug}
                onSelect={(date, time, isoStart) => setNewSlot({ date, time, isoStart })}
              />
              
              <div className="mt-8 flex flex-col gap-3">
                <button
                  disabled={!newSlot || isRescheduling}
                  onClick={handleReschedule}
                  className="w-full py-3 bg-pink-500 text-white rounded-xl font-bold hover:bg-pink-600 transition-all disabled:bg-gray-200 disabled:cursor-not-allowed shadow-md shadow-pink-100"
                >
                  {isRescheduling ? "Rescheduling..." : "Confirm New Time"}
                </button>
                <button
                  onClick={() => { setReschedulingSession(null); setNewSlot(null); }}
                  className="w-full py-3 bg-gray-50 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
