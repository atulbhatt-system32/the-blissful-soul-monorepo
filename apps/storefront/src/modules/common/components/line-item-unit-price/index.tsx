import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type LineItemUnitPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  currencyCode: string
}

const LineItemUnitPrice = ({
  item,
  currencyCode,
}: LineItemUnitPriceProps) => {
  const { total, original_total } = item
  const hasReducedPrice = (total ?? 0) < (original_total ?? 0)

  // Always show original unit price; LineItemPrice handles the discounted total
  const displayPrice = hasReducedPrice
    ? (original_total ?? 0) / item.quantity
    : (total ?? 0) / item.quantity

  return (
    <div className="flex flex-col text-ui-fg-muted justify-center h-full">
      <span className="text-base-regular" data-testid="product-unit-price">
        {convertToLocale({ amount: displayPrice, currency_code: currencyCode })}
      </span>
    </div>
  )
}

export default LineItemUnitPrice
