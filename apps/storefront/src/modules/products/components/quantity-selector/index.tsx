"use client"

import { Button, clx } from "@medusajs/ui"
import React from "react"
import { Plus, Minus } from "@medusajs/icons"

type QuantitySelectorProps = {
  quantity: number
  setQuantity: (quantity: number) => void
  max?: number
  disabled?: boolean
  className?: string
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  setQuantity,
  max,
  disabled,
  className,
}) => {
  const handleIncrement = () => {
    if (max && quantity >= max) return
    setQuantity(quantity + 1)
  }

  const handleDecrement = () => {
    if (quantity <= 1) return
    setQuantity(quantity - 1)
  }

  return (
    <div className={clx("flex items-center border border-ui-border-base rounded-md w-fit h-10 overflow-hidden", className)}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || quantity <= 1}
        className="w-10 h-full flex items-center justify-center bg-ui-bg-base hover:bg-ui-bg-subtle disabled:opacity-50 transition-colors border-r border-ui-border-base"
      >
        <Minus />
      </button>
      <div className="w-12 h-full flex items-center justify-center bg-ui-bg-base text-ui-fg-base font-medium">
        {quantity}
      </div>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || (max !== undefined && quantity >= max)}
        className="w-10 h-full flex items-center justify-center bg-ui-bg-base hover:bg-ui-bg-subtle disabled:opacity-50 transition-colors border-l border-ui-border-base"
      >
        <Plus />
      </button>
    </div>
  )
}

export default QuantitySelector
