import { HttpTypes } from "@medusajs/types"
import { Text, Button } from "@medusajs/ui"
import InvoiceButton from "../invoice-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
  showTrackLink?: boolean
}

const OrderDetails = ({ order, showStatus, showTrackLink }: OrderDetailsProps) => {
  const formatStatus = (str?: string) => {
    if (!str) return ""
    const formatted = str.split("_").join(" ")

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
      <div className="flex flex-col gap-y-10">
        <div className="flex flex-col md:flex-row items-center gap-6 p-8 bg-[#2C1E36] rounded-[2.5rem] border border-white/5 shadow-2xl shadow-purple-900/20 text-center md:text-left">
          <div className="w-16 h-16 rounded-full bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] shrink-0 border border-[#C5A059]/20 shadow-inner">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <p className="text-base text-purple-100/80 leading-relaxed font-serif italic">
            A confirmation of this spiritual transaction has been dispatched to{" "}
            <span className="text-white font-black not-italic block md:inline text-lg mt-1 md:mt-0" data-testid="order-email">
                {order.email}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <div className="flex flex-col gap-y-2 group">
             <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A059] font-black group-hover:translate-x-1 transition-transform inline-block">Date Recorded</span>
             <span className="text-lg font-serif italic text-[#2C1E36]" data-testid="order-date">
                {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
             </span>
          </div>
          <div className="flex flex-col gap-y-2 group">
             <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A059] font-black group-hover:translate-x-1 transition-transform inline-block">Reference ID</span>
             <span className="text-2xl font-serif font-black text-[#2C1E36] tracking-tighter" data-testid="order-id">
                #{order.display_id}
             </span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <InvoiceButton
            orderId={order.id}
            displayId={order.display_id ?? ""}
            variant="secondary"
            className="rounded-xl px-6 py-3 h-auto text-[10px] uppercase tracking-widest font-black bg-white border border-gray-100 text-[#2C1E36] hover:bg-gray-50 flex items-center gap-x-2 shadow-sm"
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
            Download Invoice
          </InvoiceButton>
          {showTrackLink && (
            <LocalizedClientLink
              href={`/order/lookup?display_id=${order.display_id}&email=${order.email}`}
              className="w-full sm:w-auto"
            >
              <Button
                variant="secondary"
                className="w-full sm:w-auto rounded-xl px-6 py-3 h-auto text-[10px] uppercase tracking-widest font-black bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20 hover:bg-[#C5A059] hover:text-white transition-all flex items-center gap-x-2"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Track Order
              </Button>
            </LocalizedClientLink>
          )}
        </div>

        {showStatus && (
          <div className="flex items-center gap-x-6 mt-8 pt-6 border-t border-gray-50">
            <div className="flex flex-col gap-y-1">
              <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Fulfillment</span>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#2C1E36]" data-testid="order-status">
                {formatStatus(order.fulfillment_status)}
              </span>
            </div>
            <div className="flex flex-col gap-y-1">
              <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Financial State</span>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#2C1E36]" data-testid="order-payment-status">
                {formatStatus(order.payment_status)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
