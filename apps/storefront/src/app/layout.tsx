import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Inter } from "next/font/google"
import "styles/globals.css"

import { WishlistProvider } from "@lib/context/wishlist-context"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    template: "%s | The Blissful Soul",
    default: "The Blissful Soul",
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className={inter.variable}>
      <body className="font-sans">
        <WishlistProvider>
          <main className="relative">{props.children}</main>
        </WishlistProvider>
      </body>
    </html>
  )
}
