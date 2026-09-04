const DIAL_CODES: Record<string, string> = { in: "91", us: "1", gb: "44", au: "61" }

/**
 * Canonical storage form for a customer phone: "+" followed by digits only.
 * Kept in sync with canonicalPhone() in apps/backend/src/lib/phone.ts — phone
 * login matches on this, so both sides have to agree on the shape.
 */
export function canonicalPhone(phone: string, countryCode = "in"): string {
  const raw = (phone || "").trim()
  if (!raw) return ""

  let digits = raw.replace(/\D/g, "")
  if (!digits) return ""

  if (!raw.startsWith("+")) {
    // Drop a national trunk prefix, e.g. "098765 43210" -> "9876543210".
    if (digits.length === 11 && digits.startsWith("0")) {
      digits = digits.slice(1)
    }
    if (digits.length === 10) {
      digits = `${DIAL_CODES[countryCode?.toLowerCase()] || "91"}${digits}`
    }
  }

  return `+${digits}`
}

/**
 * Whether a sign-in identifier should be treated as a phone number rather than
 * an email. Accepts the punctuation people actually type: "+91 98765 43210",
 * "(98765) 43210", "98765-43210".
 */
export function looksLikePhone(input: string): boolean {
  const trimmed = (input || "").trim()
  if (!trimmed || trimmed.includes("@")) return false
  if (!/^\+?[\d\s().-]+$/.test(trimmed)) return false

  const digits = trimmed.replace(/\D/g, "")
  return digits.length >= 6 && digits.length <= 15
}
