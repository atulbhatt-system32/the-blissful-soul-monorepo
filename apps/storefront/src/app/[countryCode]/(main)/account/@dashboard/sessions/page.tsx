import { Metadata } from "next"
import { retrieveCustomer } from "@lib/data/customer"
import { notFound } from "next/navigation"
import MySessionsPage from "@modules/account/components/my-sessions"

export const metadata: Metadata = {
  title: "My Sessions",
  description: "View your booking session history.",
}

export default async function Sessions() {
  const customer = await retrieveCustomer()

  if (!customer) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="sessions-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">My Sessions</h1>
        <p className="text-base-regular">
          View your booked sessions, dates, and payment details.
        </p>
      </div>
      <MySessionsPage email={customer.email} />
    </div>
  )
}
