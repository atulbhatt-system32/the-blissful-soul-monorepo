"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import React from "react"

/**
 * Use this component to create a Next.js `<Link />` that persists the current country code in the url,
 * without having to explicitly pass it as a prop.
 */
const LocalizedClientLink = ({
  children,
  href,
  className,
  activeClassName,
  ...props
}: {
  children?: React.ReactNode
  href: string
  className?: string
  activeClassName?: string
  onClick?: () => void
  passHref?: true
  [x: string]: any
}) => {
  const { countryCode } = useParams()
  const pathname = usePathname()
  
  const fullHref = `/${countryCode}${href}`
  
  const isActive = href === "/" 
    ? pathname === `/${countryCode}` || pathname === `/${countryCode}/` 
    : pathname.startsWith(`/${countryCode}${href}`)

  return (
    <Link 
      href={fullHref} 
      className={[className, isActive ? activeClassName : ""].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </Link>
  )
}

export default LocalizedClientLink
