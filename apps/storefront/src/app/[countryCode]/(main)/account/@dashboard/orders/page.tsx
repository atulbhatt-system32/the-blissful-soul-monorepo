import { Metadata } from "next"

import OrderOverview from "@modules/account/components/order-overview"
import { listOrders } from "@lib/data/orders"

export const metadata: Metadata = {
  title: "Orders",
  description: "Overview of your previous orders.",
}

export default async function Orders() {
  // listOrders() rethrows through medusaError(), which is typed `never` — an
  // expired session or a backend hiccup would otherwise take the whole page
  // down, and there is no error boundary in the account tree. The overview
  // page already guards the same call this way.
  const orders = (await listOrders().catch(() => null)) ?? []

  return (
    <div className="w-full" data-testid="orders-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">Orders</h1>
        <p className="text-base-regular">
          View your previous orders and their status. You can also create
          returns or exchanges for your orders if needed.
        </p>
      </div>
      <div>
        <OrderOverview orders={orders} />
      </div>
    </div>
  )
}
