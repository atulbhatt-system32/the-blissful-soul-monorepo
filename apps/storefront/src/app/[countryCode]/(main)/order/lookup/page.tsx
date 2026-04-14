import { retrieveCustomer } from "@lib/data/customer"
import { listOrders } from "@lib/data/orders"
import OrderLookupTemplate from "@modules/order/templates/order-lookup-template"
import { Metadata } from "next"

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
  
  const customer = await retrieveCustomer().catch(() => null)
  const recentOrders = customer ? await listOrders(5, 0).catch(() => []) : []

  return (
    <OrderLookupTemplate
      key={`${display_id}-${email}`}
      customer={customer}
      recentOrders={recentOrders}
      initialDisplayId={display_id}
      initialEmail={email}
    />
  )
}


