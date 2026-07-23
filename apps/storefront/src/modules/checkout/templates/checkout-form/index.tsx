import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { isDigitalOnlyCart } from "@lib/util/is-digital-cart"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Shipping from "@modules/checkout/components/shipping"

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) {
    return null
  }

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  if (!shippingMethods || !paymentMethods) {
    return null
  }

  const isDigitalOnly = isDigitalOnlyCart(cart.items)

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <Addresses cart={cart} customer={customer} isDigitalOnly={isDigitalOnly} />

      {!isDigitalOnly && (
        <Shipping cart={cart} availableShippingMethods={shippingMethods} />
      )}

      <Payment cart={cart} availablePaymentMethods={paymentMethods} isDigitalOnly={isDigitalOnly} />
    </div>
  )
}
