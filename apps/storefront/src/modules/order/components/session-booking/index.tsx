"use client"

import React, { useEffect } from "react"
import Cal, { getCalApi } from "@calcom/embed-react"

type SessionBookingProps = {
  calLink: string
  customerName: string
  customerEmail: string
}

export default function SessionBooking({ 
  calLink, 
  customerName, 
  customerEmail 
}: SessionBookingProps) {
  useEffect(() => {
    ;(async function () {
      const cal = await getCalApi({ namespace: "booking" })
      cal("ui", {
        theme: "light",
        styles: { branding: { brandColor: "#fbcfe8" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      })
    })()
  }, [])

  return (
    <div className="cal-embed-container min-h-[600px] border border-pink-100 rounded-xl overflow-hidden shadow-inner bg-white">
      <Cal
        namespace="booking"
        calLink={calLink}
        style={{ width: "100%", height: "100%", minHeight: "600px" }}
        config={{ 
          name: customerName,
          email: customerEmail,
          layout: "month_view" 
        }}
      />
    </div>
  )
}
