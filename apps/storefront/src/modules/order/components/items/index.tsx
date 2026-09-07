import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"

import Divider from "@modules/common/components/divider"
import Item from "@modules/order/components/item"

type ItemsProps = {
  order: HttpTypes.StoreOrder
}

/**
 * Placeholder row matching the flex layout above.
 *
 * The shared SkeletonLineItem is a <Table.Row> and is still used by the cart
 * templates, which remain tables — reusing it here would put table markup
 * inside a div, so this keeps a local equivalent instead.
 */
const SkeletonItem = () => (
  <div className="flex gap-x-3 md:gap-x-4 py-3 md:py-4 border-b border-gray-100 last:border-b-0">
    <div className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0 bg-gray-200 animate-pulse rounded" />
    <div className="flex-1 min-w-0 flex flex-col md:flex-row md:justify-between gap-y-2 md:gap-x-4">
      <div className="flex flex-col gap-y-2">
        <div className="w-32 h-4 bg-gray-200 animate-pulse rounded" />
        <div className="w-24 h-3 bg-gray-200 animate-pulse rounded" />
      </div>
      <div className="w-16 h-4 bg-gray-200 animate-pulse rounded flex-shrink-0" />
    </div>
  </div>
)

const Items = ({ order }: ItemsProps) => {
  const items = order.items

  return (
    <div className="flex flex-col">
      <Divider className="!mb-0" />
      {/* No overflow-x-auto or min-width here: the rows wrap on narrow screens
          now, so the summary no longer scrolls sideways on mobile. */}
      <div className="w-full" data-testid="products-table">
        {items?.length
          ? items
              .sort((a, b) => {
                return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
              })
              .map((item) => {
                return (
                  <Item
                    key={item.id}
                    item={item}
                    currencyCode={order.currency_code}
                  />
                )
              })
          : repeat(5).map((i) => {
              return <SkeletonItem key={i} />
            })}
      </div>
    </div>
  )
}

export default Items
