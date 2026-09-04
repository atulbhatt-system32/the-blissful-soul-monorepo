const DIAL_CODES: Record<string, string> = { in: "91", us: "1", gb: "44", au: "61" }

export function toInternationalPhone(phone: string, countryCode: string): string | undefined {
  if (!phone) return undefined
  const digits = phone.replace(/\D/g, "")
  if (!digits) return undefined
  if (phone.startsWith("+")) return phone
  const dial = DIAL_CODES[countryCode?.toLowerCase()] || "91"
  return `+${dial}${digits}`
}

/**
 * Canonical storage form for a customer phone: "+" followed by digits only.
 * Mirrors canonicalPhone() in the storefront (apps/storefront/src/lib/util/phone.ts)
 * so numbers written by the storefront and matched here agree.
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
 * The literals a stored `customer.phone` might plausibly use for the same number.
 *
 * Phone numbers were entered free-form for a long time ("+91 98765 43210",
 * "098765-43210", "9876543210"), so an equality filter on the raw input misses
 * most rows. Feed the result to an `$in` filter, then confirm each hit with
 * phonesMatch() — the filter narrows, it does not decide.
 *
 * Assumes 10-digit national numbers, which holds for the dial codes above.
 */
export function phoneMatchVariants(phone: string, countryCode = "in"): string[] {
  const raw = (phone || "").trim()
  const digits = raw.replace(/\D/g, "")
  if (digits.length < 6) return []

  const dial = DIAL_CODES[countryCode?.toLowerCase()] || "91"
  const national = digits.length > 10 ? digits.slice(-10) : digits

  return [
    ...new Set([
      raw,
      digits,
      `+${digits}`,
      national,
      `+${national}`,
      `0${national}`,
      `${dial}${national}`,
      `+${dial}${national}`,
      `+${dial} ${national}`,
      canonicalPhone(raw, countryCode),
    ]),
  ].filter(Boolean)
}

/**
 * Whether two free-form phone numbers denote the same subscriber, comparing the
 * national part so "+91 98765 43210" and "9876543210" are equal.
 */
export function phonesMatch(a: string, b: string): boolean {
  const digitsA = (a || "").replace(/\D/g, "")
  const digitsB = (b || "").replace(/\D/g, "")
  if (digitsA.length < 6 || digitsB.length < 6) return false
  if (digitsA === digitsB) return true

  const tailA = digitsA.slice(-10)
  const tailB = digitsB.slice(-10)
  return tailA.length === 10 && tailA === tailB
}
