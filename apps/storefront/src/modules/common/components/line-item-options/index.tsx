import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

type LineItemOptionsProps = {
  variant: HttpTypes.StoreProductVariant | undefined
  "data-testid"?: string
  "data-value"?: HttpTypes.StoreProductVariant
  metadata?: Record<string, unknown> | null
}

const HIDDEN_METADATA_KEYS = new Set([
  "is_booking",
  "is_session",
  "booking_date",
  "booking_time",
  "booking_slot_iso",
  "slot_iso_start",
  "patient_first_name",
  "patient_last_name",
  "patient_email",
  "patient_phone",
  "event_slug",
  "is_auto_gift",
])

const LineItemOptions = ({
  variant,
  "data-testid": dataTestid,
  "data-value": dataValue,
  metadata
}: LineItemOptionsProps) => {
  const visibleMeta = metadata
    ? Object.entries(metadata).filter(
        ([key, value]) => !HIDDEN_METADATA_KEYS.has(key) && typeof value === "string"
      )
    : []

  return (
    <div className="flex flex-col gap-y-1">
      {visibleMeta.map(([key, value]) => (
        <Text key={key} className="inline-block txt-medium text-ui-fg-subtle w-full overflow-hidden text-ellipsis">
          {key}: {value as string}
        </Text>
      ))}
    </div>
  )
}

export default LineItemOptions
