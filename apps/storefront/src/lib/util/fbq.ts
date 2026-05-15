export function trackFbEvent(event: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return
  // fbq is defined as a queue stub by the pixel snippet before fbevents.js loads,
  // so it's safe to call even if the full script hasn't finished loading yet.
  if ((window as any).fbq) {
    ;(window as any).fbq("track", event, data)
  }
}
