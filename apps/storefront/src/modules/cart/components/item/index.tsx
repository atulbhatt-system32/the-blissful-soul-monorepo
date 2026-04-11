"use client"

import { Table, Text, clx } from "@medusajs/ui"
import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  // TODO: Update this to grab the actual max inventory
  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory

  return (
    <Table.Row 
      className={clx("w-full border-b last:border-0 group transition-colors", {
        "border-gray-50 bg-ui-bg-base hover:bg-gray-50/10": type === "full",
        "border-white/5 bg-transparent hover:bg-white/5": type === "preview"
      })}
      data-testid="product-row"
    >
      <Table.Cell className="!pl-0 py-6 w-20">
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className={clx("flex overflow-hidden rounded-xl transition-all", {
            "w-14 border border-white/10 shadow-none": type === "preview",
            "small:w-20 w-14 border border-gray-100 shadow-sm": type === "full",
          })}
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
            className="group-hover:scale-105 transition-transform duration-700"
          />
        </LocalizedClientLink>
      </Table.Cell>

      <Table.Cell className="text-left py-6">
        <div className="flex flex-col gap-y-0.5">
          <Text
            className={clx("text-sm font-serif font-bold", {
              "text-[#2C1E36]": type === "full",
              "text-white": type === "preview"
            })}
            data-testid="product-title"
          >
            {item.product_title}
          </Text>
          <div className="text-[9px] uppercase tracking-widest text-[#C5A059] font-black opacity-80">
            <LineItemOptions variant={item.variant} metadata={item.metadata} data-testid="product-variant" />
          </div>
        </div>
      </Table.Cell>

      {type === "full" && (
        <Table.Cell className="py-6">
          <div className="flex flex-col items-center gap-y-2">
            <div className="flex items-center gap-x-1 bg-white border border-gray-100 rounded-lg p-0.5 shadow-sm">
              <CartItemSelect
                value={item.quantity}
                onChange={(value) => changeQuantity(parseInt(value.target.value))}
                className="w-12 h-7 text-xs font-bold border-none bg-transparent focus:ring-0"
                data-testid="product-select-button"
              >
                {Array.from(
                  {
                    length: Math.min(maxQuantity, 10),
                  },
                  (_, i) => (
                    <option value={i + 1} key={i}>
                      {i + 1}
                    </option>
                  )
                )}
              </CartItemSelect>
            </div>
            <button 
              onClick={() => changeQuantity(0)}
              className="text-[8px] uppercase tracking-widest text-gray-400 font-black hover:text-red-500 transition-colors flex items-center gap-x-1"
            >
              Remove
            </button>
            <ErrorMessage error={error} data-testid="product-error-message" />
          </div>
        </Table.Cell>
      )}

      {type === "full" && (
        <Table.Cell className="hidden small:table-cell py-6 text-center">
          <div className="text-[11px] font-bold text-gray-500 italic">
            <LineItemUnitPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </div>
        </Table.Cell>
      )}

      <Table.Cell className="!pr-0 py-6 text-right">
        <span
          className={clx("!pr-0", {
            "flex flex-col items-end h-full justify-center": type === "preview",
          })}
        >
          {type === "preview" && (
            <span className="flex gap-x-1 ">
              <Text className="text-ui-fg-muted">{item.quantity}x </Text>
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </span>
          )}
          <div className={clx("text-xs font-black", {
            "text-[#2C1E36]": type === "full",
            "text-purple-100": type === "preview"
          })}>
            <LineItemPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </div>
        </span>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item
