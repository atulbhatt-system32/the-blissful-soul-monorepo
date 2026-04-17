import { Container } from "@medusajs/ui"
import ChevronDown from "@modules/common/icons/chevron-down"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  return (
    <div data-testid="overview-page-wrapper" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="hidden small:block">
        <div className="flex justify-between items-end mb-10 pb-6 border-b border-gray-100">
          <div>
            <h1 className="text-3xl font-serif text-[#2C1E36] mb-2" data-testid="welcome-message">
              Hello, {customer?.first_name}
            </h1>
            <p className="text-gray-500 text-sm">Welcome back to your account.</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold block mb-1">
              Currently signed in as
            </span>
            <span
              className="text-sm font-medium text-[#2C1E36]"
              data-testid="customer-email"
              data-value={customer?.email}
            >
              {customer?.email}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Profile Card */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#C5A059]">Profile Completion</h3>
              <LocalizedClientLink href="/account/profile" className="text-[10px] font-bold text-[#2C1E36]/40 hover:text-[#2C1E36] uppercase tracking-widest transition-colors">
                Edit Profile
              </LocalizedClientLink>
            </div>
            <div className="flex items-end gap-x-3">
              <span
                className="text-5xl font-serif text-[#2C1E36] leading-none"
                data-testid="customer-profile-completion"
                data-value={getProfileCompletion(customer)}
              >
                {getProfileCompletion(customer)}%
              </span>
              <span className="text-gray-400 text-sm italic mb-1">Information completed</span>
            </div>
            <div className="mt-6 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-[#2C1E36] transition-all duration-1000" 
                 style={{ width: `${getProfileCompletion(customer)}%` }} 
               />
            </div>
          </div>

          {/* Addresses Card */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#C5A059]">Saved Addresses</h3>
              <LocalizedClientLink href="/account/addresses" className="text-[10px] font-bold text-[#2C1E36]/40 hover:text-[#2C1E36] uppercase tracking-widest transition-colors">
                Manage
              </LocalizedClientLink>
            </div>
            <div className="flex items-end gap-x-3">
              <span
                className="text-5xl font-serif text-[#2C1E36] leading-none"
                data-testid="addresses-count"
                data-value={customer?.addresses?.length || 0}
              >
                {customer?.addresses?.length || 0}
              </span>
              <span className="text-gray-400 text-sm italic mb-1">Primary shipping locations</span>
            </div>
            <div className="mt-8 flex gap-2">
               {[...Array(3)].map((_, i) => (
                 <div key={i} className={`h-1.5 flex-1 rounded-full ${i < (customer?.addresses?.length || 0) ? 'bg-[#C5A059]/40' : 'bg-gray-100'}`} />
               ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif text-[#2C1E36]">Recent Orders</h3>
            <LocalizedClientLink href="/account/orders" className="text-[10px] font-bold text-[#2C1E36]/60 hover:text-[#2C1E36] uppercase tracking-[0.1em] transition-colors">
              View All Orders
            </LocalizedClientLink>
          </div>
          
          <ul className="flex flex-col gap-y-4" data-testid="orders-wrapper">
            {orders && orders.length > 0 ? (
              orders.slice(0, 5).map((order) => {
                return (
                  <li
                    key={order.id}
                    data-testid="order-wrapper"
                    data-value={order.id}
                  >
                    <LocalizedClientLink href={`/account/orders/details/${order.id}`}>
                      <div className="bg-white hover:bg-gray-50/50 border border-gray-100 p-6 rounded-[1.5rem] flex justify-between items-center transition-all group">
                        <div className="grid grid-cols-3 gap-x-12 flex-1">
                          <div className="flex flex-col gap-y-1">
                            <span className="text-[9px] uppercase tracking-widest text-[#C5A059] font-bold">Placed On</span>
                            <span className="text-xs font-bold text-[#2C1E36]" data-testid="order-created-date">
                              {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          <div className="flex flex-col gap-y-1 text-center">
                            <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Order Ref</span>
                            <span className="text-xs font-bold text-[#2C1E36]" data-testid="order-id">
                              #{order.display_id}
                            </span>
                          </div>
                          <div className="flex flex-col gap-y-1 text-right">
                            <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Total Value</span>
                            <span className="text-xs font-black text-[#2C1E36]" data-testid="order-amount">
                              {convertToLocale({
                                amount: order.total,
                                currency_code: order.currency_code,
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="ml-8 w-10 h-10 rounded-full flex items-center justify-center text-gray-300 group-hover:text-[#2C1E36] group-hover:bg-[#2C1E36]/5 transition-all">
                          <ChevronDown className="-rotate-90" width={16} height={16} />
                        </div>
                      </div>
                    </LocalizedClientLink>
                  </li>
                )
              })
            ) : (
              <div className="py-20 text-center bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
                <p className="text-gray-400 text-sm disabled italic" data-testid="no-orders-message">You haven't placed any orders yet.</p>
                <LocalizedClientLink href="/store" className="inline-block mt-4 text-xs font-bold text-[#2C1E36] underline underline-offset-4">Start your collection →</LocalizedClientLink>
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0

  if (!customer) {
    return 0
  }

  if (customer.email) {
    count++
  }

  if (customer.first_name && customer.last_name) {
    count++
  }

  if (customer.phone) {
    count++
  }

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  if (billingAddress) {
    count++
  }

  return (count / 4) * 100
}

export default Overview
