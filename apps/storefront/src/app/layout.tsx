import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "styles/globals.css"

import { WishlistProvider } from "@lib/context/wishlist-context"
import { NotificationProvider } from "@lib/context/notification-context"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    template: "%s | Pragya Vijh",
    default: "Pragya Vijh",
  },
  icons: {
    icon: "/pragya-vijh-logo.png",
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">
        <NotificationProvider>
          <WishlistProvider>
            <main className="relative">{props.children}</main>
          </WishlistProvider>
        </NotificationProvider>
      </body>
    </html>
  )
}
