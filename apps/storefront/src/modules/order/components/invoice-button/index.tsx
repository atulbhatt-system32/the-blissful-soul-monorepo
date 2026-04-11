"use client"

import { Button } from "@medusajs/ui"
import { useState } from "react"

const InvoiceButton = ({ 
  orderId, 
  displayId, 
  className, 
  variant = "secondary",
  children
}: { 
  orderId: string
  displayId: string | number
  className?: string
  variant?: "primary" | "secondary" | "transparent" | "danger"
  children: React.ReactNode
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
      const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
      
      const response = await fetch(`${backendUrl}/store/orders/${orderId}/invoice`, {
        headers: {
          "x-publishable-api-key": publishableKey,
        }
      })
      
      if (!response.ok) {
        throw new Error(`Failed to download invoice: ${response.statusText}`)
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `invoice-${displayId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading invoice:", error)
      alert("Failed to download invoice. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      variant={variant} 
      className={className} 
      onClick={handleDownload}
      isLoading={isLoading}
    >
      {children}
    </Button>
  )
}

export default InvoiceButton
