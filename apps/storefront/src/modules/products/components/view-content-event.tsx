"use client"

import { trackFbEvent } from "@lib/util/fbq"
import { useEffect } from "react"

type Props = {
  productId: string
  productName: string
  value?: number
  currency?: string
}

export default function ViewContentEvent({ productId, productName, value, currency }: Props) {
  useEffect(() => {
    trackFbEvent("ViewContent", {
      content_ids: [productId],
      content_name: productName,
      content_type: "product",
      value: value != null ? value / 100 : undefined,
      currency: currency?.toUpperCase(),
    })
  }, [])

  return null
}
