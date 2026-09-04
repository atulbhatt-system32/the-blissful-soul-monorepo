import LoginTemplate from "@modules/account/templates/login-template"

/**
 * Fallback for the @login slot when the URL matches a @dashboard-only route
 * (/account/orders, /account/profile, …).
 *
 * On a hard navigation Next.js has to resolve every parallel slot; a slot with
 * no matching segment and no default renders a 404 for the whole route. Showing
 * the login form here means a signed-out visitor opening a dashboard URL is
 * asked to sign in instead.
 */
export default function LoginDefault() {
  return <LoginTemplate />
}
