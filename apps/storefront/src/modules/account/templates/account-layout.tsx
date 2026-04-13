import React from "react"

import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div className="flex-1 small:py-12" data-testid="account-page">
      <div className={`flex-1 content-container h-full max-w-5xl mx-auto bg-white flex flex-col ${!customer ? 'items-center justify-center' : ''}`}>
        <div className={`grid grid-cols-1 py-6 small:py-12 w-full gap-x-8 md:gap-x-12 ${customer ? 'small:grid-cols-[240px_1fr]' : ''}`}>
          <div>{customer && <AccountNav customer={customer} />}</div>
          <div className="flex-1 w-full">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
