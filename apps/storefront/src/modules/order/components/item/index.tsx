import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import { convertToLocale } from "@lib/util/money"

import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import Thumbnail from "@modules/products/components/thumbnail"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  currencyCode: string
}

/**
 * One line of an order summary.
 *
 * Laid out with flexbox rather than a table row: as a three-column table the
 * thumbnail, title and price could not fit a narrow phone, so the summary
 * scrolled sideways. Below `sm` the price stacks under the title instead; from
 * `sm` up it sits on the right as before.
 */
const Item = ({ item, currencyCode }: ItemProps) => {
  const adjustments = (item as any).adjustments as any[] | undefined

  return (
    <div
      className="flex gap-x-3 md:gap-x-4 py-3 md:py-4 border-b border-gray-100 last:border-b-0"
      data-testid="product-row"
    >
      <div className="w-12 md:w-16 flex-shrink-0">
        <Thumbnail
          thumbnail={
            item.thumbnail ??
            item.variant?.product?.thumbnail ??
            (item.metadata?.strapi_thumbnail as string)
          }
          images={item.variant?.product?.images}
          size="square"
        />
      </div>

      {/* min-w-0 lets long titles shrink instead of forcing the row wider than
          the screen — the cause of the horizontal scroll. */}
      <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-start md:justify-between gap-y-2 md:gap-x-4">
        <div className="min-w-0">
          <Text
            className="text-sm md:text-base font-semibold text-ui-fg-base break-words"
            data-testid="product-name"
          >
            {item.product_title}
          </Text>
          <LineItemOptions
            variant={item.variant}
            metadata={item.metadata as Record<string, unknown>}
            data-testid="product-variant"
          />

          {adjustments && adjustments.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {(() => {
                const totalExclusiveDiscount = adjustments.reduce(
                  (s: number, a: any) => s + (a.amount ?? 0),
                  0
                )
                // original_total and total are tax-inclusive; use their
                // difference for the customer-facing discount
                const totalInclusiveDiscount =
                  (item.original_total ?? 0) - (item.total ?? 0)

                return adjustments.map((adjustment: any) => {
                  // Scale each adjustment proportionally to get its
                  // tax-inclusive value
                  const inclusiveAmount =
                    totalExclusiveDiscount > 0
                      ? Math.round(
                          (adjustment.amount / totalExclusiveDiscount) *
                            totalInclusiveDiscount
                        )
                      : 0

                  return (
                    <div
                      key={adjustment.id}
                      className="flex items-center gap-x-1 px-1.5 py-0.5 bg-ui-bg-interactive-flat rounded-md border border-ui-border-interactive w-fit"
                    >
                      <span className="text-[7px] small:text-[8px] font-black text-ui-fg-interactive uppercase tracking-widest">
                        Applied: {adjustment.description || adjustment.code}
                        {inclusiveAmount > 0 &&
                          ` (-${convertToLocale({
                            amount: inclusiveAmount,
                            currency_code: currencyCode,
                          })})`}
                      </span>
                    </div>
                  )
                })
              })()}
            </div>
          )}
        </div>

        {/* Side by side on mobile so the price row stays one line tall,
            stacked and right-aligned from md up. */}
        <div className="flex flex-row md:flex-col items-baseline md:items-end justify-between md:justify-start gap-x-3 flex-shrink-0 text-xs md:text-sm">
          <span className="flex gap-x-1 whitespace-nowrap">
            <Text className="text-ui-fg-muted text-xs md:text-sm">
              <span data-testid="product-quantity">{item.quantity}</span>x{" "}
            </Text>
            <LineItemUnitPrice item={item} currencyCode={currencyCode} />
          </span>

          <LineItemPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </div>
      </div>
    </div>
  )
}

export default Item
