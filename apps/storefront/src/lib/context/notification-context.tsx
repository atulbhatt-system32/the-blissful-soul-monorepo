"use client"

import { Check } from "@medusajs/icons"
import { useParams } from "next/navigation"
import { createContext, useCallback, useContext, useState } from "react"

type NotificationContextType = {
  showNotification: (message: string) => void
}

const NotificationContext = createContext<NotificationContextType>({
  showNotification: () => {},
})

export function useNotification() {
  return useContext(NotificationContext)
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)
  const params = useParams()
  const countryCode = params?.countryCode as string | undefined

  const showNotification = useCallback((msg: string) => {
    setMessage(msg)
    setTimeout(() => setMessage(null), 3000)
  }, [])

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {message && (
        <div className="md:hidden fixed top-0 left-0 right-0 z-[200] flex items-center justify-center gap-x-3 bg-emerald-600 text-white py-3 px-4 text-sm font-medium">
          <Check className="w-4 h-4 shrink-0" />
          <span>{message}</span>
          {countryCode && (
            <a
              href={`/${countryCode}/cart`}
              className="md:hidden ml-2 rounded-md border border-white/60 px-3 py-1 text-xs font-semibold hover:bg-white/20 transition-colors"
            >
              View cart
            </a>
          )}
        </div>
      )}
      {children}
    </NotificationContext.Provider>
  )
}
