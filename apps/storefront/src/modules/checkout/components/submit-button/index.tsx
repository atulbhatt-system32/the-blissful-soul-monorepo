"use client"

import { Button, clx } from "@medusajs/ui"
import React from "react"
import { useFormStatus } from "react-dom"

export function SubmitButton({
  children,
  variant = "primary",
  className,
  fullWidth = false,
  "data-testid": dataTestId,
}: {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "transparent" | "danger" | null
  className?: string
  fullWidth?: boolean
  "data-testid"?: string
}) {
  const { pending } = useFormStatus()

  return (
    <Button
      size="large"
      className={clx(
        "rounded-xl py-4 h-auto text-[11px] uppercase tracking-[0.2em] font-black transition-all shadow-xl active:scale-95 shadow-purple-900/10",
        fullWidth ? "w-full" : "w-auto px-10",
        variant === "primary" ? "bg-[#2C1E36] text-white hover:opacity-90" : "bg-white text-[#2C1E36] border border-gray-100 hover:bg-gray-50",
        className
      )}
      type="submit"
      isLoading={pending}
      variant={variant === "transparent" ? "transparent" : "primary"}
      data-testid={dataTestId}
    >
      {children}
    </Button>
  )
}
