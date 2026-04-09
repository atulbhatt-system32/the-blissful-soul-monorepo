import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"

import Divider from "@modules/common/components/divider"

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          className="flex flex-col gap-y-2"
          data-testid="shipping-address-summary"
        >
          <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-black">Destination</span>
          <div className="flex flex-col text-sm text-[#2C1E36] font-medium leading-relaxed italic">
            <span className="font-black not-italic text-base mb-1 font-serif">
              {order.shipping_address?.first_name}{" "}
              {order.shipping_address?.last_name}
            </span>
            <span>
              {order.shipping_address?.address_1}
            </span>
            {order.shipping_address?.address_2 && (
              <span>{order.shipping_address?.address_2}</span>
            )}
            <span>
              {order.shipping_address?.postal_code},{" "}
              {order.shipping_address?.city}
            </span>
            <span>
              {order.shipping_address?.country_code?.toUpperCase()}
            </span>
          </div>
        </div>

        <div
          className="flex flex-col gap-y-2"
          data-testid="shipping-contact-summary"
        >
          <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-black">Connection</span>
          <div className="flex flex-col text-sm text-[#2C1E36] font-medium">
             <span>{order.shipping_address?.phone}</span>
             <span className="text-gray-400 font-bold mt-1 text-[11px]">{order.email}</span>
          </div>
        </div>

        <div
          className="flex flex-col gap-y-2"
          data-testid="shipping-method-summary"
        >
          <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-black">Service</span>
          <div className="flex flex-col text-sm text-[#2C1E36] font-black uppercase tracking-wider">
            {order.shipping_methods?.[0] ? (
              <>
                <span>{(order as any).shipping_methods[0].name}</span>
                <span className="text-[#C5A059] text-[11px] mt-1">
                  {convertToLocale({
                    amount: order.shipping_methods[0].total ?? 0,
                    currency_code: order.currency_code,
                  })}
                </span>
              </>
            ) : (
              <span>Standard Logistics</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShippingDetails
