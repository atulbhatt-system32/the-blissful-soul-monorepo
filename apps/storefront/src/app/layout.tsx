import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Roboto } from "next/font/google"
import "styles/globals.css"

import { WishlistProvider } from "@lib/context/wishlist-context"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className={roboto.variable}>
      <body className="font-sans">
        <WishlistProvider>
          <main className="relative">{props.children}</main>
        </WishlistProvider>
      </body>
    </html>
  )
}
