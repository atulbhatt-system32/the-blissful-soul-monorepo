"use client"

import { trackFbEvent } from "@lib/util/fbq"
import { useEffect } from "react"

type Props = {
  orderId: string
  value: number
  currency: string
  contentIds: string[]
  numItems: number
}

export default function PurchaseEvent({ orderId, value, currency, contentIds, numItems }: Props) {
  useEffect(() => {
    const key = `fbq_purchase_${orderId}`
    if (sessionStorage.getItem(key)) return

    trackFbEvent("Purchase", {
      order_id: orderId,
      value: value / 100,
      currency: currency.toUpperCase(),
      content_ids: contentIds,
      content_type: "product",
      num_items: numItems,
    })

    sessionStorage.setItem(key, "1")
  }, [])

  return null
}
