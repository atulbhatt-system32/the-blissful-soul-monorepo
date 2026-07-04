// The store operates in IST. `.toISOString()` is UTC, which is still "yesterday"
// between 12:00am-5:29am IST, so booking dates default/min-out to the wrong day
// unless we shift by the IST offset before taking the date portion.
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000

export function getISTDateString(offsetMs = 0): string {
  return new Date(Date.now() + IST_OFFSET_MS + offsetMs).toISOString().split("T")[0]
}
