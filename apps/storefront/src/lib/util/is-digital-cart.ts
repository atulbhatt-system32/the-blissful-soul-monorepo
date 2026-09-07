// A cart is digital-only when every line item is a course/session/booking
// (no physical shipping needed) — checked via product type, tags, metadata,
// or Medusa's own `requires_shipping` flag on the line item.
//
// Medusa's flag is authoritative and overrides everything else. It is set at
// add-to-cart time from the product's shipping profile, and cart completion
// refuses to create an order when any item carries it without a shipping
// method attached. Treating such a cart as digital hides the shipping step,
// no method is ever set, and the customer is charged and then auto-refunded
// with "No shipping method selected but the cart contains items that require
// shipping". Deferring to the flag keeps the storefront and the backend from
// disagreeing, whatever the product metadata says.
export function isDigitalOnlyCart(items: any[] | null | undefined): boolean {
  if (!items || items.length === 0) {
    return false
  }

  if (items.some((item: any) => item?.requires_shipping === true)) {
    return false
  }

  return items.every((item: any) => {
    const p = item.variant?.product as any
    const typeValue = (typeof p?.type?.value === "string" ? p.type.value : typeof p?.type === "string" ? p.type : "").toLowerCase()
    const tags = p?.tags?.map((t: any) => (typeof t.value === "string" ? t.value : "").toLowerCase()) || []

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
