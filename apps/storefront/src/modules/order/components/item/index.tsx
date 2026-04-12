import { HttpTypes } from "@medusajs/types"
import { Table, Text } from "@medusajs/ui"
import { convertToLocale } from "@lib/util/money"

import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import Thumbnail from "@modules/products/components/thumbnail"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  currencyCode: string
}

const Item = ({ item, currencyCode }: ItemProps) => {
  return (
    <Table.Row className="w-full" data-testid="product-row">
      <Table.Cell className="!pl-0 p-4 w-24">
        <div className="flex w-16">
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
          />
        </div>
      </Table.Cell>

      <Table.Cell className="text-left">
        <Text
          className="txt-medium-plus text-ui-fg-base"
          data-testid="product-name"
        >
          {item.product_title}
        </Text>
        <LineItemOptions variant={item.variant} metadata={item.metadata as Record<string, unknown>} data-testid="product-variant" />
        
        {(item as any).adjustments && (item as any).adjustments.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {(item as any).adjustments.map((adjustment: any) => (
              <div 
                key={adjustment.id}
                className="flex items-center gap-x-1 px-1.5 py-0.5 bg-ui-bg-interactive-flat rounded-md border border-ui-border-interactive w-fit"
              >
                 <span className="text-[7px] small:text-[8px] font-black text-ui-fg-interactive uppercase tracking-widest">
                   Applied: {adjustment.description || adjustment.code} 
                   {adjustment.amount > 0 && ` (-${convertToLocale({ amount: adjustment.amount, currency_code: currencyCode })})`}
                 </span>
              </div>
            ))}
          </div>
        )}
      </Table.Cell>

      <Table.Cell className="!pr-0">
        <span className="!pr-0 flex flex-col items-end h-full justify-center">
          <span className="flex gap-x-1 ">
            <Text className="text-ui-fg-muted">
              <span data-testid="product-quantity">{item.quantity}</span>x{" "}
            </Text>
            <LineItemUnitPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </span>

          <LineItemPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </span>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item
