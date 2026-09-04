import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { retrieveCustomer } from "@lib/data/customer"

/**
 * Account entry point in the nav. Both states link to /account — the account
 * route renders either the dashboard or the login form depending on the
 * session — but the label and the dot tell a signed-in customer which they'll
 * get before they click.
 */
const AccountButton = async () => {
  const customer = await retrieveCustomer().catch(() => null)

  return (
    <LocalizedClientLink
      className="text-foreground hover:text-primary transition-colors p-2 relative flex items-center justify-center"
      href="/account"
      data-testid="nav-account-link"
      aria-label={customer ? "My account" : "Sign in"}
      title={customer ? "My account" : "Sign in"}
    >
      <span className="relative flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>

        {customer && (
          <span className="absolute -top-0.5 -right-0.5 bg-[#C5A059] h-2 w-2 rounded-full border border-background shadow-sm" />
        )}
      </span>
    </LocalizedClientLink>
  )
}

export default AccountButton
