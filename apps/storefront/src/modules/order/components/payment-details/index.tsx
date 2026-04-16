import { Container, Heading, Text } from "@medusajs/ui"
import { CreditCard } from "@medusajs/icons"

import { isStripeLike, paymentInfoMap } from "@lib/constants"
import Divider from "@modules/common/components/divider"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const payment = order.payment_collections?.[0]?.payments?.[0]

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        {payment && (
          <div className="flex flex-col md:flex-row items-start gap-8 w-full">
            <div className="flex flex-col gap-y-2">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-black">Method of Exchange</span>
              <Text
                className="text-sm font-bold text-[#2C1E36] uppercase tracking-wider"
                data-testid="payment-method"
              >
                {paymentInfoMap[payment.provider_id]?.title ?? payment.provider_id}
              </Text>
            </div>
            <div className="flex flex-col gap-y-2">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-black">Transaction Detail</span>
              <div className="flex gap-4 items-center">
                <div className="flex items-center justify-center h-10 w-14 rounded-xl bg-gray-50 border border-gray-100 text-[#2C1E36]">
                  {paymentInfoMap[payment.provider_id]?.icon ?? <CreditCard />}
                </div>
                <div className="flex flex-col">
                  <Text className="text-sm font-black text-[#2C1E36]" data-testid="payment-amount">
                    {isStripeLike(payment.provider_id) && payment.data?.card_last4
                      ? `•••• •••• •••• ${payment.data.card_last4}`
                      : `${convertToLocale({
                          amount: Math.round(Number(payment.amount)),
                          currency_code: order.currency_code,
                        })}`}
                  </Text>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                    Processed at {new Date(payment.created_at ?? "").toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentDetails
