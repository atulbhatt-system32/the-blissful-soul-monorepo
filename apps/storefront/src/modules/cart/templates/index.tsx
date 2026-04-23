import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className="py-6 small:py-12 bg-white min-h-[calc(100vh-64px)] animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="content-container" data-testid="cart-container">
        {cart?.items?.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-x-16 gap-y-12">
            <div className="flex flex-col gap-y-8">
              <div className="flex flex-col gap-y-1">
                 <h1 className="text-3xl small:text-4xl font-serif text-[#2C1E36] font-bold">Your Selection</h1>
                 <p className="text-gray-400 text-xs italic">Review your gathered treasures before checkout.</p>
              </div>

              <div className="bg-white rounded-3xl small:rounded-[2.5rem] border border-gray-100 p-4 small:p-8 shadow-xl shadow-purple-900/5 overflow-hidden">
                <ItemsTemplate cart={cart} />
              </div>

            </div>
            
            <div className="relative">
              <div className="sticky top-12">
                {cart && cart.region && (
                  <div className="bg-[#2C1E36] p-6 md:p-8 rounded-[2.5rem] shadow-2xl shadow-purple-900/20 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/10 transition-colors duration-700" />
                    <div className="relative z-10">
                      <Summary cart={cart as any} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-24">
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
