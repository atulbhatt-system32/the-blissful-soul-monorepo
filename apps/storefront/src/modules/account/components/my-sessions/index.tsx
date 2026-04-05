"use client"

import { useEffect, useState } from "react"

type SessionBooking = {
  id: string
  display_id: number
  email: string
  booking_date: string
  booking_time: string
  razorpay_id: string
  status: string
  created_at: string
  items: { id: string; title: string; quantity: number; unit_price: number }[]
}

export default function MySessionsPage({ email }: { email: string }) {
  const [sessions, setSessions] = useState<SessionBooking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!email) {
      setLoading(false)
      return
    }

    fetch(`/api/booking-history?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        setSessions(data.sessions || [])
      })
      .catch((err) => {
        console.error("Failed to fetch sessions:", err)
      })
      .finally(() => setLoading(false))
  }, [email])

  if (loading) {
    return (
      <div className="w-full flex justify-center py-16">
        <div className="animate-spin h-8 w-8 border-4 border-pink-500 border-t-transparent rounded-full" />
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
        <h2 className="text-xl font-semibold text-gray-800">No Sessions Yet</h2>
        <p className="text-gray-500 text-center max-w-sm">
          You haven&apos;t booked any sessions yet. Book your first session and it will appear here!
        </p>
        <a
          href="/"
          className="mt-4 px-6 py-2.5 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 transition-colors"
        >
          Book a Session
        </a>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-y-4" data-testid="sessions-page">
      {sessions.map((session) => (
        <div
          key={session.id}
          className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-x-3">
              <span className="text-lg font-bold text-gray-900">
                #{session.display_id}
              </span>
              <span className="bg-pink-100 text-pink-600 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                Session
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
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 mb-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date</p>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500">
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {session.booking_time}
                </p>
              </div>
            </div>
          </div>

          {/* Session Title */}
          {session.items.length > 0 && (
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-medium">{session.items[0].title}</span>
            </p>
          )}

          {/* Payment Info */}
          <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
            <span>Payment: {session.razorpay_id}</span>
            <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-medium">
              Paid ✓
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
