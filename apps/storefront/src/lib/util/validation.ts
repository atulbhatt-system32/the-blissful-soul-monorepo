import { looksLikePhone } from "./phone"

/**
 * Validation rules shared by the account forms and the server actions behind
 * them. Every rule returns an error string or null, so the same call can drive
 * an inline field message on the client and an authoritative check on the
 * server — client-side validation is a convenience, never the gate.
 */

export const PASSWORD_MIN_LENGTH = 8
// Bound the input so an absurd password can't be used to burn scrypt time.
export const PASSWORD_MAX_LENGTH = 128

// Deliberately permissive: a single @, no whitespace, a dot in the domain.
// Anything stricter rejects addresses that are actually deliverable.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/

export function validateEmail(email: string): string | null {
  const value = (email || "").trim()

  if (!value) return "Email is required."
  if (value.length > 254) return "Email is too long."
  if (!EMAIL_PATTERN.test(value)) return "Enter a valid email address."

  return null
}

/**
 * Validates a phone number, checking the *national* part rather than the raw
 * digit count — "+91" followed by an 11-digit number is 13 digits total and
 * would otherwise slip through a simple length range.
 *
 * Indian numbers (bare, "0"-prefixed, or "+91") must be exactly 10 digits
 * starting 6-9. An explicit non-Indian country code is accepted on a looser
 * international range so an overseas customer is not locked out.
 */
export function validatePhone(phone: string): string | null {
  const value = (phone || "").trim()

  if (!value) return "Phone number is required."

  if (!/^\+?[\d\s().-]+$/.test(value)) {
    return "Phone number can only contain digits, spaces, and + ( ) - characters."
  }

  const digits = value.replace(/\D/g, "")
  if (!digits) return "Enter a valid phone number."

  // A country code the user typed explicitly, and it isn't India.
  if (value.startsWith("+") && !digits.startsWith("91")) {
    if (digits.length < 8 || digits.length > 15) {
      return "Enter a valid phone number."
    }
    return null
  }

  // Strip an Indian country code or a national trunk "0" to get the subscriber
  // number. Guarded on length so a genuine 10-digit number beginning "91"
  // isn't truncated.
  let national = digits
  if (national.startsWith("91") && national.length > 10) {
    national = national.slice(2)
  } else if (national.startsWith("0") && national.length > 10) {
    national = national.slice(1)
  }

  if (national.length !== 10) {
    return "Enter a 10-digit mobile number."
  }
  if (!/^[6-9]/.test(national)) {
    return "Indian mobile numbers start with 6, 7, 8 or 9."
  }

  return null
}

export function validateName(name: string, label: string): string | null {
  const value = (name || "").trim()

  if (!value) return `${label} is required.`
  if (value.length < 2) return `${label} must be at least 2 characters.`
  if (value.length > 50) return `${label} is too long.`

  return null
}

export function validatePassword(password: string): string | null {
  const value = password || ""

  if (!value) return "Password is required."
  if (value.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`
  }
  if (value.length > PASSWORD_MAX_LENGTH) {
    return `Password must be ${PASSWORD_MAX_LENGTH} characters or fewer.`
  }
  if (!/[A-Za-z]/.test(value)) {
    return "Password must contain at least one letter."
  }
  if (!/\d/.test(value)) {
    return "Password must contain at least one number."
  }

  return null
}

export function validatePasswordConfirmation(
  password: string,
  confirmation: string
): string | null {
  if (!confirmation) return "Please confirm your password."
  if (password !== confirmation) return "Passwords do not match."

  return null
}

/**
 * A sign-in identifier may be either an email or a phone number, so it is only
 * invalid when it is neither.
 */
export function validateLoginIdentifier(identifier: string): string | null {
  const value = (identifier || "").trim()

  if (!value) return "Enter your email or phone number."
  if (looksLikePhone(value)) return null
  if (value.includes("@")) return validateEmail(value)

  return "Enter a valid email address or phone number."
}

/** Runs a set of field rules and returns only the fields that failed. */
export function collectErrors(
  checks: Record<string, string | null>
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(checks).filter(([, error]) => error !== null)
  ) as Record<string, string>
}
