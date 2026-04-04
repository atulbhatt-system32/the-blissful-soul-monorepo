import { lookupOrder } from "@lib/data/orders"
import OrderLookupTemplate from "@modules/order/templates/order-lookup-template"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Track Order",
  description: "Track your order status using your Order ID and Email.",
}

export default async function OrderLookupPage() {
  return <OrderLookupTemplate />
}
