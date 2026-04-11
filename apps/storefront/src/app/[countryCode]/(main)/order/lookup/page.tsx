import { retrieveCustomer } from "@lib/data/customer"
import { lookupOrder } from "@lib/data/orders"
import OrderLookupTemplate from "@modules/order/templates/order-lookup-template"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Track Order",
  description: "Track your order status using your Order ID and Email.",
}

export default async function OrderLookupPage({
  searchParams,
}: {
  searchParams: Promise<{ display_id?: string; email?: string }>
}) {
  const { display_id, email } = await searchParams
  const customer = await retrieveCustomer().catch(() => null)

  return (
    <OrderLookupTemplate
      key={`${display_id}-${email}`}
      customer={customer}
      initialDisplayId={display_id}
      initialEmail={email}
    />
  )
}


