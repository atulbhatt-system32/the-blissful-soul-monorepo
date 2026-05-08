"use client"

import { clx } from "@medusajs/ui"
import React from "react"
import { Plus, Minus } from "@medusajs/icons"

type QuantitySelectorProps = {
  quantity: number
  setQuantity: (quantity: number) => void
  max?: number
  disabled?: boolean
  className?: string
  size?: "sm" | "md"
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  setQuantity,
  max,
  disabled,
  className,
  size = "md",
}) => {
  const handleIncrement = () => {
    if (max && quantity >= max) return
    setQuantity(quantity + 1)
  }

  const handleDecrement = () => {
    if (quantity <= 1) return
    setQuantity(quantity - 1)
  }

  const isSm = size === "sm"

  return (
    <div 
      className={clx(
        "flex items-center bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:border-[#C5A059]/30 hover:shadow-md w-fit",
        isSm ? "h-8" : "h-11",
        className
      )}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || quantity <= 1}
        className={clx(
          "flex items-center justify-center bg-transparent text-[#2C1E36] hover:bg-gray-50 disabled:opacity-30 transition-all duration-200 active:scale-90",
          isSm ? "w-8" : "w-10"
        )}
        aria-label="Decrease quantity"
      >
        <Minus className={clx(isSm ? "w-3 h-3" : "w-4 h-4")} />
      </button>
      
      <div className={clx(
        "flex items-center justify-center bg-transparent text-[#2C1E36] font-black border-x border-gray-50",
        isSm ? "w-8 text-[10px]" : "w-12 text-sm"
      )}>
        {quantity}
      </div>
      
      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || (max !== undefined && quantity >= max)}
        className={clx(
          "flex items-center justify-center bg-transparent text-[#2C1E36] hover:bg-gray-50 disabled:opacity-30 transition-all duration-200 active:scale-90",
          isSm ? "w-8" : "w-10"
        )}
        aria-label="Increase quantity"
      >
        <Plus className={clx(isSm ? "w-3 h-3" : "w-4 h-4")} />
      </button>
    </div>
  )
}

export default QuantitySelector
