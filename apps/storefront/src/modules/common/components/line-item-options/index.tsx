import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

type LineItemOptionsProps = {
  variant: HttpTypes.StoreProductVariant | undefined
  "data-testid"?: string
  "data-value"?: HttpTypes.StoreProductVariant
  metadata?: Record<string, unknown> | null
}

const LineItemOptions = ({
  variant,
  "data-testid": dataTestid,
  "data-value": dataValue,
  metadata
}: LineItemOptionsProps) => {
  return (
    <div className="flex flex-col gap-y-1">
      {metadata && Object.entries(metadata).map(([key, value]) => {
        if (typeof value === "string") {
          return (
            <Text key={key} className="inline-block txt-medium text-ui-fg-subtle w-full overflow-hidden text-ellipsis">
              {key}: {value}
            </Text>
          )
        }
        return null
      })}
    </div>
  )
}

export default LineItemOptions
