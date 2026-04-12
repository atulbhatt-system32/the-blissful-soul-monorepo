"use client"

import { usePathname } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const NavLinks = () => {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/store", label: "Shop Crystals" },
    { href: "/book-session", label: "Sessions" },
  ]

  const isActive = (href: string) => {
    if (href === "/" && pathname !== "/") {
        // Handle localized home paths (e.g. /in, /us)
        const parts = pathname.split("/").filter(Boolean)
        if (parts.length > 0 && parts.length <= 1) return true
        return false
    }
    return pathname.includes(href)
  }

  return (
    <div className="hidden lg:flex items-center gap-x-8 mr-4">
      {links.map((link) => {
        const active = isActive(link.href)
        return (
          <LocalizedClientLink
            key={link.href}
            href={link.href}
            className={`font-sans text-[13px] font-medium transition-all relative py-1 ${
              active 
                ? "text-primary border-b-2 border-primary" 
                : "text-foreground/70 hover:text-primary"
            }`}
          >
            {link.label}
          </LocalizedClientLink>
        )
      })}
    </div>
  )
}

export default NavLinks
