/**
 * Casings an email may have been stored under.
 *
 * Neither the customer profile nor the emailpass auth identity normalises case:
 * `entity_id` is persisted exactly as it was submitted at registration. Looking
 * a customer up by `email.toLowerCase()` alone therefore misses anyone who
 * signed up as "Foo@Bar.com". Use these variants in an `$in` filter, and use
 * the *stored* value once you have the row.
 */
export function emailVariants(email: string): string[] {
  const raw = (email || "").trim()
  if (!raw) return []

  const lower = raw.toLowerCase()
  return raw === lower ? [raw] : [raw, lower]
}
