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
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[101] w-[95%] max-w-4xl bg-[#2C1E36] rounded-[2rem] shadow-[0_0_80px_rgba(197,160,89,0.2)] overflow-hidden flex flex-col md:flex-row border border-[#C5A059]/30 animate-in fade-in zoom-in duration-300">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 z-[102] p-2 bg-white/5 backdrop-blur-md rounded-full text-white/50 hover:bg-white/10 hover:text-white hover:rotate-90 transition-all duration-300"
          aria-label="Close popup"
        >
          <XMark />
        </button>

        {/* Image side */}
        {imageUrl && (
          <div className="relative w-full md:w-1/2 min-h-[350px] md:min-h-full flex items-center justify-center p-6 md:p-8 bg-[#2C1E36]/50">
            <div className="relative w-full h-full rounded-2xl md:rounded-[2rem] overflow-hidden border border-[#C5A059]/30 shadow-2xl">
              <Image 
                src={imageUrl} 
                alt={data.title} 
                fill 
                className="object-contain bg-[#1F1426]" 
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        )}

        {/* Content Side */}
        <div className="p-10 md:p-16 flex flex-col items-center justify-center text-center flex-1 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#C5A059]/10 blur-[60px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/10 blur-[60px] rounded-full pointer-events-none" />

          <h3 className="font-serif text-2xl md:text-3xl text-[#C5A059] mb-4 md:mb-6 tracking-[0.05em] uppercase leading-[1.2] relative z-10 max-w-[500px]">
            {data.title}
          </h3>
          
          {data.description && (
            <p className="text-purple-100/80 text-sm md:text-lg mb-8 md:mb-10 leading-relaxed italic relative z-10 max-w-[450px]">
              {data.description}
            </p>
          )}
          
          {data.button_text && data.button_link && (
            <LocalizedClientLink 
              href={data.button_link}
              onClick={handleClose}
              className="inline-block w-full px-10 py-5 bg-[#C5A059] text-[#2C1E36] rounded-full font-black uppercase tracking-widest text-sm hover:bg-white transition-all shadow-xl hover:shadow-[#C5A059]/30 relative z-10"
            >
              {data.button_text}
            </LocalizedClientLink>
          )}

          <button 
            onClick={handleClose}
            className="mt-8 text-[11px] text-white/40 uppercase tracking-widest hover:text-[#C5A059] transition-colors relative z-10 font-bold"
          >
            No thanks, maybe later
          </button>
        </div>
      </div>
    </>
  )
}

export default WelcomePopup
