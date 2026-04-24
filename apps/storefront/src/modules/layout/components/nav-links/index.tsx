"use client"

import { usePathname } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const NavLinks = () => {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/store", label: "Shop Crystals" },
    { href: "/#sacred-services", label: "Our Sacred Services" },
  ]

  const isActive = (href: string) => {
    if (href === "/") {
      // Home is active when pathname is "/" or just a country code like "/in"
      if (pathname === "/") return true
      const parts = pathname.split("/").filter(Boolean)
      // Only country code segment means we're on the home page
      return parts.length === 1 && parts[0].length <= 3
    }
    return pathname.includes(href) && href !== "/#sacred-services"
  }

  return (
    <div className="hidden lg:flex items-center gap-x-8 mr-4">
      {links.map((link) => {
        const active = isActive(link.href)
        return (
          <LocalizedClientLink
            key={link.href}
            href={link.href}
            onClick={(e) => {
              if (link.href.includes("#")) {
                const id = link.href.split("#")[1]
                const element = document.getElementById(id)
                if (element) {
                  e.preventDefault()
                  element.scrollIntoView({ behavior: "smooth" })
                }
              }
            }}
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
