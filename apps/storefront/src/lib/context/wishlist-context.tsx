"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type WishlistContextType = {
  wishlist: string[]
  toggleWishlist: (productId: string) => void
  isWishlisted: (productId: string) => boolean
  isLoading: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const loadWishlist = () => {
      try {
        const savedWishlist = localStorage.getItem("wishlist")
        if (savedWishlist) {
          try {
            setWishlist(JSON.parse(savedWishlist))
          } catch (e) {
            console.error("Error parsing wishlist from localStorage", e)
          }
        }
      } catch (e) {
        console.error("Error loading wishlist", e)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadWishlist()
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isLoading) return
    
    localStorage.setItem("wishlist", JSON.stringify(wishlist))
  }, [wishlist, isLoading])

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => 
      prev.includes(productId) 
        ? prev.filter((id) => id !== productId) 
        : [...prev, productId]
    )
  }

  const isWishlisted = (productId: string) => wishlist.includes(productId)

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted, isLoading }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
