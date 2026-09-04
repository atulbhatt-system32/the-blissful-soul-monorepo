export const PASSWORD_MIN_LENGTH = 8
// Bound the input so an absurd password can't be used to burn scrypt time.
export const PASSWORD_MAX_LENGTH = 128

/**
 * Password policy, enforced at the API boundary.
 *
 * The storefront runs the same rules (apps/storefront/src/lib/util/validation.ts)
 * for inline feedback, but these routes are reachable directly, so the check
 * has to exist here too. Returns an error message, or null when acceptable.
 */
export function validatePassword(password: unknown): string | null {
  if (typeof password !== "string" || !password) {
    return "Password is required."
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return `Password must be ${PASSWORD_MAX_LENGTH} characters or fewer.`
  }
  if (!/[A-Za-z]/.test(password)) {
    return "Password must contain at least one letter."
  }
  if (!/\d/.test(password)) {
    return "Password must contain at least one number."
  }

  return null
}
