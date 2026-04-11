import { Button } from "@medusajs/ui"
import { useMemo } from "react"
import InvoiceButton from "@modules/order/components/invoice-button"

import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const OrderCard = ({ order }: OrderCardProps) => {
  const numberOfLines = useMemo(() => {
    return (
      order.items?.reduce((acc, item) => {
        return acc + item.quantity
      }, 0) ?? 0
    )
  }, [order])

  const numberOfProducts = useMemo(() => {
    return order.items?.length ?? 0
  }, [order])

  return (
    <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group animate-in fade-in slide-in-from-bottom-2 duration-500" data-testid="order-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-x-3 mb-1">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Order Ref</span>
            <span className="text-lg font-serif text-[#2C1E36] font-black" data-testid="order-display-id">
              #{order.display_id}
            </span>
            {(order.metadata as any)?.is_session ? (
              <span className="bg-[#2C1E36] text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] shadow-lg shadow-purple-900/20">
                Healing Session
              </span>
            ) : (
              <span className="bg-[#C5A059]/10 text-[#C5A059] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border border-[#C5A059]/20">
                Product Order
              </span>
            )}
          </div>
          <div className="flex items-center gap-x-2 text-[11px] font-bold text-gray-400">
            <span data-testid="order-created-at">
              Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-200" />
            <span data-testid="order-amount">
              Value: {convertToLocale({
                amount: order.total,
                currency_code: order.currency_code,
              })}
            </span>
          </div>
        </div>

        {(order.metadata as any)?.booking_date && (
          <div className="bg-amber-50 border border-amber-100 px-5 py-3 rounded-2xl flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-amber-200/50 flex items-center justify-center text-amber-700">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
             </div>
             <div>
                <span className="block text-[9px] uppercase tracking-widest text-amber-600 font-black">Scheduled Session</span>
                <span className="text-xs font-bold text-amber-900">
                  {(order.metadata as any).booking_date} @ {(order.metadata as any).booking_time}
                </span>
             </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 small:grid-cols-4 gap-4 mb-8">
        {order.items?.slice(0, 3).map((i) => {
          return (
            <div
              key={i.id}
              className="flex flex-col gap-y-3"
              data-testid="order-item"
            >
              <div className="relative aspect-[4/5] rounded-[1.5rem] overflow-hidden border border-gray-100 shadow-sm transition-transform group-hover:scale-[1.02]">
                <Thumbnail
                  thumbnail={i.thumbnail}
                  images={(i.variant as any)?.product?.images}
                  size="full"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[9px] font-black text-[#2C1E36]">
                  QTY {i.quantity}
                </div>
              </div>
              <div className="flex items-center px-1">
                <span
                  className="text-[11px] font-bold text-[#2C1E36] line-clamp-1 truncate"
                  data-testid="item-title"
                >
                  {i.title}
                </span>
              </div>
            </div>
          )
        })}
        {numberOfProducts > 3 && (
          <div className="aspect-[4/5] rounded-[1.5rem] bg-gray-50 flex flex-col items-center justify-center border border-dashed border-gray-200">
            <span className="text-xl font-serif text-[#2C1E36] font-black">
              +{numberOfLines - 3}
            </span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Additional</span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-6 border-t border-gray-50">
        <InvoiceButton
          orderId={order.id}
          displayId={order.display_id ?? ""}
          variant="secondary"
          className="w-full sm:w-auto rounded-xl px-6 py-3 h-auto text-[10px] uppercase tracking-widest font-black bg-gray-50 text-gray-500 hover:bg-[#2C1E36] hover:text-white transition-all flex items-center justify-center gap-x-2 border-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
          Invoice
        </InvoiceButton>
        <LocalizedClientLink href={`/account/orders/details/${order.id}`} className="w-full sm:w-auto">
          <Button data-testid="order-details-link" variant="secondary" className="w-full sm:w-auto rounded-xl px-8 py-3 h-auto text-[10px] uppercase tracking-[0.2em] font-black bg-[#2C1E36] text-white hover:bg-[#2C1E36] hover:opacity-90 shadow-lg shadow-purple-900/10 border-none">
            Detailed History
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderCard
