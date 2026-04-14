import { retrieveCustomer } from "@lib/data/customer"
import { lookupOrder } from "@lib/data/orders"
import OrderLookupTemplate from "@modules/order/templates/order-lookup-template"
import { Metadata } from "next"

import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Track Order",
  description: "Track your order status using your Order ID and Email.",
}

export default async function OrderLookupPage(props: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ display_id?: string; email?: string }>
}) {
  const params = await props.params
  const searchParams = await props.searchParams
  
  const { display_id, email } = searchParams
  const { countryCode } = params
  
  const customer = await retrieveCustomer().catch(() => null)

  // Redirect authenticated users directly to their orders dashboard
  // ONLY if they didn't explicitly request to track a specific order via URL params
  if (customer && !display_id && !email) {
    redirect(`/${countryCode}/account/orders`)
  }

  return (
    <OrderLookupTemplate
      key={`${display_id}-${email}`}
      customer={customer}
      initialDisplayId={display_id}
      initialEmail={email}
    />
  )
}


