const DIAL_CODES: Record<string, string> = { in: "91", us: "1", gb: "44", au: "61" }

export function toInternationalPhone(phone: string, countryCode: string): string | undefined {
  if (!phone) return undefined
  const digits = phone.replace(/\D/g, "")
  if (!digits) return undefined
  if (phone.startsWith("+")) return phone
  const dial = DIAL_CODES[countryCode?.toLowerCase()] || "91"
  return `+${dial}${digits}`
}
