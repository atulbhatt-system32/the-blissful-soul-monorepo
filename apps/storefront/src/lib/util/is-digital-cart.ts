// A cart is digital-only when every line item is a course/session/booking
// (no physical shipping needed) — checked via product type, tags, metadata,
// or Medusa's own `requires_shipping` flag on the line item.
export function isDigitalOnlyCart(items: any[] | null | undefined): boolean {
  if (!items || items.length === 0) {
    return false
  }

  return items.every((item: any) => {
    const p = item.variant?.product as any
    const typeValue = (p?.type?.value || p?.type || "").toLowerCase()
    const tags = p?.tags?.map((t: any) => (t.value || "").toLowerCase()) || []

    return (
      typeValue === "session" ||
      typeValue === "booking" ||
      typeValue === "course" ||
      tags.includes("session") ||
      tags.includes("booking") ||
      tags.includes("course") ||
      p?.metadata?.is_service === true ||
      p?.metadata?.is_service === "true" ||
      p?.metadata?.is_course === true ||
      p?.metadata?.is_course === "true" ||
      p?.metadata?.drive_folder_id != null ||
      item.variant?.metadata?.is_service === true ||
      item.requires_shipping === false
    )
  })
}
