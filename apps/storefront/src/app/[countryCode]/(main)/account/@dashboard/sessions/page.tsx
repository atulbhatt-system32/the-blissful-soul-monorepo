import { Metadata } from "next"
import { retrieveCustomer } from "@lib/data/customer"
import MySessionsPage from "@modules/account/components/my-sessions"

export const metadata: Metadata = {
  title: "My Sessions",
  description: "View your booking session history.",
}

export default async function Sessions() {
  // We try to retrieve the customer, but don't fail if they are a guest
  const customer = await retrieveCustomer().catch(() => null)

  return (
    <div className="w-full" data-testid="sessions-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi text-gray-900 font-bold">My Sessions</h1>
        <p className="text-base-regular text-gray-500">
          View your booked sessions, dates, and payment details.
        </p>
      </div>
      {/* If customer exists, we pass their email. If not, MySessionsPage will show the lookup form. */}
      <MySessionsPage email={customer?.email || ""} />
    </div>
  )
}
