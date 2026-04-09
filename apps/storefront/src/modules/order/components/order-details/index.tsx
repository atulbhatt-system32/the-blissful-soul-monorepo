import { HttpTypes } from "@medusajs/types"
import { Text, Button } from "@medusajs/ui"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const formatStatus = (str?: string) => {
    if (!str) return ""
    const formatted = str.split("_").join(" ")

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col gap-y-4">
        <div className="flex items-start gap-x-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="w-10 h-10 rounded-full bg-[#2C1E36]/5 flex items-center justify-center text-[#2C1E36] shrink-0">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed italic">
            A confirmation of this spiritual transaction has been dispatched to{" "}
            <span className="text-[#2C1E36] font-black not-italic" data-testid="order-email">
              {order.email}
            </span>
            .
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="flex flex-col gap-y-1">
             <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-black">Date Recorded</span>
             <span className="text-sm font-bold text-[#2C1E36]" data-testid="order-date">
                {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
             </span>
          </div>
          <div className="flex flex-col gap-y-1">
             <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-black">Reference ID</span>
             <span className="text-sm font-black text-[#2C1E36]" data-testid="order-id">
                #{order.display_id}
             </span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <a
            href={`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"}/store/orders/${order.id}/invoice`}
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="secondary" className="rounded-xl px-6 py-3 h-auto text-[10px] uppercase tracking-widest font-black bg-white border border-gray-100 text-[#2C1E36] hover:bg-gray-50 flex items-center gap-x-2 shadow-sm">
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
              Acquire Invoice
            </Button>
          </a>
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
