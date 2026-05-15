"use client"

import { trackFbEvent } from "@lib/util/fbq"
import { useEffect } from "react"

type Props = {
  value: number
  currency: string
  numItems: number
}

export default function InitiateCheckoutEvent({ value, currency, numItems }: Props) {
  useEffect(() => {
    trackFbEvent("InitiateCheckout", {
      value: value / 100,
      currency: currency.toUpperCase(),
      num_items: numItems,
    })
  }, [])

  return null
}
