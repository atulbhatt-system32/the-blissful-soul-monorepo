"use client"

import { Check } from "@medusajs/icons"
import { useEffect, useState } from "react"

export default function CartNotificationStrip() {
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      const title = (e as CustomEvent<{ title: string }>).detail.title
      setMessage(`${title} added to cart`)
      setTimeout(() => setMessage(null), 3000)
    }
    window.addEventListener("cart-item-added", handler)
    return () => window.removeEventListener("cart-item-added", handler)
  }, [])

  if (!message) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center gap-x-2 bg-emerald-600 text-white py-3 px-4 text-sm font-medium animate-slide-in">
      <Check className="w-4 h-4 shrink-0" />
      <span>{message}</span>
    </div>
  )
}
