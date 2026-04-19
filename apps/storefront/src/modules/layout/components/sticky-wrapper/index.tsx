"use client"

import React from "react"

interface StickyWrapperProps {
  children: React.ReactNode
}

export default function StickyWrapper({ children }: StickyWrapperProps) {
  return (
    <div className="sticky top-0 inset-x-0 z-[100] w-full">
      {children}
    </div>
  )
}
