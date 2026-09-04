/**
 * Fallback for the @dashboard slot when the URL matches a @login-only route
 * (/account/reset-password).
 *
 * On a hard navigation — which is exactly what following a password-reset link
 * from an email is — Next.js has to resolve every parallel slot, and a slot
 * with no matching segment and no default renders a 404 for the whole route.
 * The account layout only renders this slot for a signed-in customer, so
 * rendering nothing is correct.
 */
export default function DashboardDefault() {
  return null
}
