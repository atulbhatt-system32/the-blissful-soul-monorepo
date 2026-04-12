import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"

type LineItemUnitPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  style?: "default" | "tight"
  currencyCode: string
  showOriginal?: boolean
}

const LineItemUnitPrice = ({
  item,
  style = "default",
  currencyCode,
  showOriginal = true,
}: LineItemUnitPriceProps) => {
  const { total, original_total } = item
  const totalAmount = total ?? 0
  const originalTotalAmount = original_total ?? 0
  const hasReducedPrice = totalAmount < originalTotalAmount

  const percentage_diff = Math.round(
    ((originalTotalAmount - totalAmount) / (originalTotalAmount || 1)) * 100
  )

  const originalPrice = (original_total ?? 0) / item.quantity
  const currentPrice = (total ?? 0) / item.quantity

  return (
    <div className="flex flex-col text-ui-fg-muted justify-center h-full">
      {hasReducedPrice && item.quantity > 1 ? (
        <span className="text-base-regular" data-testid="product-unit-price">
          {convertToLocale({
            amount: originalPrice,
            currency_code: currencyCode,
          })}
        </span>
      ) : (
        <>
          {hasReducedPrice && showOriginal && (
            <>
              <p>
                {style === "default" && (
                  <span className="text-ui-fg-muted">Original: </span>
                )}
                <span
                  className="line-through"
                  data-testid="product-unit-original-price"
                >
                  {convertToLocale({
                    amount: originalPrice,
                    currency_code: currencyCode,
                  })}
                </span>
              </p>
              {style === "default" && (
                <span className="text-ui-fg-interactive">-{percentage_diff}%</span>
              )}
            </>
          )}
          <span
            className={clx("text-base-regular", {
              "text-ui-fg-interactive": hasReducedPrice,
            })}
            data-testid="product-unit-price"
          >
            {convertToLocale({
              amount: currentPrice,
              currency_code: currencyCode,
            })}
          </span>
        </>
      )}
    </div>
  )
}

export default LineItemUnitPrice
