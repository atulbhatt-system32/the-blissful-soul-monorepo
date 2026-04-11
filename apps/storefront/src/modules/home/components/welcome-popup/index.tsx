"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { XMark } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type PopUpProps = {
  data: {
    is_active: boolean
    title: string
    description?: string
    button_text?: string
    button_link?: string
    image?: {
      url: string
    } | null
  } | null
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

const WelcomePopup = ({ data }: PopUpProps) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Only show if the popup is enabled in CMS
    if (!data?.is_active) return

    // Simple delay to let the page load before jumping up
    const timer = setTimeout(() => {
      // Check if user has already seen and closed it in this session
      const hasSeenPopup = sessionStorage.getItem("hasSeenWelcomePopup")
      if (!hasSeenPopup) {
        setIsOpen(true)
      }
    }, 2000) // Shows after 2 seconds

    return () => clearTimeout(timer)
  }, [data])

  const handleClose = () => {
    setIsOpen(false)
    sessionStorage.setItem("hasSeenWelcomePopup", "true")
  }

  if (!isOpen || !data) return null

  const imageUrl = data.image?.url 
    ? (data.image.url.startsWith("http") ? data.image.url : `${STRAPI_URL}${data.image.url}`)
    : null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[100] bg-[#2C1E36]/80 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Pop-up Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[101] w-[90%] max-w-lg bg-[#2C1E36] rounded-3xl shadow-[0_0_60px_rgba(197,160,89,0.15)] overflow-hidden flex flex-col md:flex-row border border-[#C5A059]/20 animate-in fade-in zoom-in duration-300">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-[102] p-2 bg-white/5 backdrop-blur-md rounded-full text-white/50 hover:bg-white/10 hover:text-white hover:rotate-90 transition-all duration-300"
          aria-label="Close popup"
        >
          <XMark />
        </button>

        {/* Optional Image side */}
        {imageUrl && (
          <div className="relative w-full md:w-5/12 aspect-[4/3] md:aspect-auto hidden md:block border-r border-[#C5A059]/10">
            <Image 
              src={imageUrl} 
              alt={data.title} 
              fill 
              className="object-cover" 
            />
          </div>
        )}

        {/* Content Side */}
        <div className="p-8 md:p-10 flex flex-col items-center justify-center text-center flex-1 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/10 blur-[50px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600/10 blur-[50px] rounded-full pointer-events-none" />

          <h3 className="font-serif text-2xl md:text-3xl text-[#C5A059] mb-4 tracking-tight uppercase relative z-10">
            {data.title}
          </h3>
          
          {data.description && (
            <p className="text-purple-100/70 text-sm md:text-base mb-8 leading-relaxed italic relative z-10">
              {data.description}
            </p>
          )}
          
          {data.button_text && data.button_link && (
            <LocalizedClientLink 
              href={data.button_link}
              onClick={handleClose}
              className="inline-block w-full px-8 py-3.5 bg-[#C5A059] text-[#2C1E36] rounded-full font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-lg hover:shadow-[#C5A059]/20 relative z-10"
            >
              {data.button_text}
            </LocalizedClientLink>
          )}

          <button 
            onClick={handleClose}
            className="mt-6 text-[10px] text-white/30 uppercase tracking-widest hover:text-[#C5A059] transition-colors relative z-10"
          >
            No thanks, maybe later
          </button>
        </div>
      </div>
    </>
  )
}

export default WelcomePopup
