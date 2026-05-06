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
  mode?: "table" | "card"
}

const Item = ({ item, type = "full", currencyCode, mode = "table" }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isAutoGift = item.metadata?.is_auto_gift === true
  const giftLabel = isAutoGift
    ? (item.variant?.product?.metadata?.gift_label as string | undefined)
    : undefined

  const p = item.variant?.product as any;
  const typeValue = (p?.type?.value || p?.type || "").toLowerCase();
  const tags = p?.tags?.map((t: any) => (t.value || "").toLowerCase()) || [];
  const isService = (
    typeValue === "session" || 
    typeValue === "booking" ||
    tags.includes("session") ||
    tags.includes("booking") ||
    p?.metadata?.is_service === true || 
    p?.metadata?.is_service === "true" ||
    item.variant?.metadata?.is_service === true ||
    item.metadata?.is_booking === "true" ||
    item.metadata?.is_session === true
  );

  const changeQuantity = async (quantity: number) => {
    if (isAutoGift) {
      setError("Free gift quantity cannot be changed")
      return
    }
    if (isService && quantity !== 0) {
      return
    }

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

  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory

  if (mode === "card") {
    return (
      <div className="flex flex-col gap-y-4 py-6 border-b border-gray-100 last:border-0 grow animate-in fade-in slide-in-from-bottom-2">
        <div className="flex gap-x-4 items-start">
          {isService ? (
            <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-100 shadow-sm shrink-0">
              <Thumbnail
                thumbnail={item.thumbnail}
                images={item.variant?.product?.images}
                size="square"
              />
            </div>
          ) : (
            <LocalizedClientLink
              href={`/products/${item.product_handle}`}
              className="w-20 h-20 rounded-xl overflow-hidden border border-gray-100 shadow-sm shrink-0"
            >
              <Thumbnail
                thumbnail={item.thumbnail}
                images={item.variant?.product?.images}
                size="square"
              />
            </LocalizedClientLink>
          )}
          <div className="flex flex-col gap-y-1">
            <h3 className="text-sm font-serif font-bold text-[#2C1E36] leading-tight">
              {item.product_title}
            </h3>
            <div className="text-[10px] uppercase tracking-widest text-[#C5A059] font-black opacity-80">
              <LineItemOptions variant={item.variant} metadata={item.metadata} />
            </div>
            {isAutoGift && (
              <div className="flex flex-col gap-y-1.5 mt-1">
                <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-black">
                  FREE GIFT
                </span>
                {giftLabel && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#C5A059]/5 border border-[#C5A059]/30 text-[#C5A059] text-[10px] font-bold leading-none w-fit">
                    {giftLabel}
                  </span>
                )}
              </div>
            )}

            {(item as any).adjustments && (item as any).adjustments.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {(item as any).adjustments.map((adjustment: any) => (
                  <div 
                    key={adjustment.id}
                    className="flex items-center gap-x-1 px-1.5 py-0.5 bg-ui-bg-interactive-flat rounded-md border border-ui-border-interactive w-fit"
                  >
                     <span className="text-[8px] font-black text-ui-fg-interactive uppercase tracking-widest">
                       Applied: {adjustment.description || adjustment.code}
                     </span>
                  </div>
                ))}
              </div>
            )}
            <div className="font-black text-xs text-[#2C1E36] mt-1">
              <LineItemPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pl-24">
          <div className="flex items-center gap-x-2">
            {isService ? (
              <div className="flex items-center justify-center bg-gray-50/80 rounded-lg border border-gray-100 h-8 px-3">
                <span className="text-[10px] font-black text-[#2C1E36] uppercase tracking-widest">Qty: {item.quantity}</span>
              </div>
            ) : (
              <div className="bg-gray-50/80 rounded-lg border border-gray-100 p-0.5">
                <CartItemSelect
                  value={item.quantity}
                  onChange={(value) => changeQuantity(parseInt(value.target.value))}
                  className="w-12 h-8 text-xs font-bold border-none bg-transparent focus:ring-0"
                  disabled={isAutoGift}
                >
                  {Array.from({ length: Math.min(maxQuantity, 10) }, (_, i) => (
                    <option value={i + 1} key={i}>{i + 1}</option>
                  ))}
                </CartItemSelect>
              </div>
            )}
            {!isAutoGift && (
              <button
                onClick={() => changeQuantity(0)}
                className="text-[9px] uppercase tracking-widest text-gray-400 font-bold hover:text-red-500 transition-colors"
              >
                Remove
              </button>
            )}
            {(isAutoGift || isService) && <div className="w-4" />}
          </div>
          <ErrorMessage error={error} />
        </div>
      </div>
    )
  }

  return (
    <Table.Row 
      className={clx("w-full border-b last:border-0 group transition-colors", {
        "border-gray-50 bg-ui-bg-base hover:bg-gray-50/10": type === "full",
        "border-white/5 bg-transparent hover:bg-white/5": type === "preview"
      })}
      data-testid="product-row"
    >
      <Table.Cell className="!pl-0 py-4 small:py-6 w-16 small:w-20">
        {isService ? (
          <div className={clx("flex overflow-hidden rounded-xl transition-all", {
            "w-12 small:w-14 border border-white/10 shadow-none": type === "preview",
            "w-14 small:w-20 border border-gray-100 shadow-sm": type === "full",
          })}>
            <Thumbnail
              thumbnail={item.thumbnail}
              images={item.variant?.product?.images}
              size="square"
            />
          </div>
        ) : (
          <LocalizedClientLink
            href={`/products/${item.product_handle}`}
            className={clx("flex overflow-hidden rounded-xl transition-all", {
              "w-12 small:w-14 border border-white/10 shadow-none": type === "preview",
              "w-14 small:w-20 border border-gray-100 shadow-sm": type === "full",
            })}
          >
            <Thumbnail
              thumbnail={item.thumbnail}
              images={item.variant?.product?.images}
              size="square"
              className="group-hover:scale-105 transition-transform duration-700"
            />
          </LocalizedClientLink>
        )}
      </Table.Cell>

      <Table.Cell className="text-left py-4 small:py-6 px-2 small:px-4">
        <div className="flex flex-col gap-y-0.5 max-w-[120px] small:max-w-none">
          <Text
            className={clx("text-xs small:text-sm font-serif font-bold leading-tight", {
              "text-[#2C1E36]": type === "full",
              "text-white": type === "preview"
            })}
            data-testid="product-title"
          >
            {item.product_title}
          </Text>
          <div className="text-[7px] small:text-[9px] uppercase tracking-widest text-[#C5A059] font-black opacity-80">
            <LineItemOptions variant={item.variant} metadata={item.metadata} data-testid="product-variant" />
          </div>
          {isAutoGift && (
            <div className="flex flex-col gap-y-1.5 mt-1">
              <span className="text-[8px] small:text-[10px] uppercase tracking-widest text-[#C5A059] font-black">
                FREE GIFT
              </span>
              {giftLabel && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#C5A059]/5 border border-[#C5A059]/30 text-[#C5A059] text-[9px] small:text-[11px] font-bold leading-none w-fit">
                  {giftLabel}
                </span>
              )}
            </div>
          )}

          {(item as any).adjustments && (item as any).adjustments.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {(item as any).adjustments.map((adjustment: any) => (
                <div 
                  key={adjustment.id}
                  className="flex items-center gap-x-1 px-1.5 py-0.5 bg-ui-bg-interactive-flat rounded-md border border-ui-border-interactive"
                >
                   <span className="text-[7px] small:text-[8px] font-black text-ui-fg-interactive uppercase tracking-widest">
                     Applied: {adjustment.description || adjustment.code}
                   </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Table.Cell>

      {type === "full" && (
        <Table.Cell className="py-4 small:py-6 px-1 small:px-4">
          <div className="flex flex-col items-center gap-y-1">
            {isService ? (
              <div className="flex items-center justify-center h-6 small:h-7 px-3">
                <span className="text-[9px] small:text-[11px] font-black text-[#2C1E36] uppercase tracking-widest">Qty: {item.quantity}</span>
              </div>
            ) : (
              <div className="flex items-center gap-x-1 bg-white border border-gray-100 rounded-lg p-0 shadow-sm">
                <CartItemSelect
                  value={item.quantity}
                  onChange={(value) => changeQuantity(parseInt(value.target.value))}
                  className="w-10 small:w-12 h-6 small:h-7 text-[10px] small:text-xs font-bold border-none bg-transparent focus:ring-0"
                  data-testid="product-select-button"
                  disabled={isAutoGift}
                >
                  {Array.from(
                    { length: Math.min(maxQuantity, 10) },
                    (_, i) => (
                      <option value={i + 1} key={i}>
                        {i + 1}
                      </option>
                    )
                  )}
                </CartItemSelect>
              </div>
            )}
            {!isAutoGift && (
              <button
                onClick={() => changeQuantity(0)}
                className="text-[7px] small:text-[8px] uppercase tracking-widest text-gray-400 font-black hover:text-red-500 transition-colors flex items-center gap-x-1"
              >
                Remove
              </button>
            )}
            {isAutoGift && <div className="h-4" />}
            <ErrorMessage error={error} data-testid="product-error-message" />
          </div>
        </Table.Cell>
      )}

      {type === "full" && (
        <Table.Cell className="hidden small:table-cell py-4 small:py-6 text-center">
          <div className="text-[11px] font-bold text-gray-500 italic">
            <LineItemUnitPrice
              item={item}
              currencyCode={currencyCode}
            />
          </div>
        </Table.Cell>
      )}

      <Table.Cell className="!pr-0 py-4 small:py-6 text-right">
        <span
          className={clx("!pr-0", {
            "flex flex-col items-end h-full justify-center": type === "preview",
          })}
        >
          {type === "preview" && (item.quantity ?? 0) > 1 && (
            <span className="flex gap-x-1 ">
              <Text className="text-ui-fg-muted">{item.quantity}x </Text>
              <LineItemUnitPrice
                item={item}
                currencyCode={currencyCode}
              />
            </span>
          )}
          <div className={clx("text-[10px] small:text-xs font-black", {
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
