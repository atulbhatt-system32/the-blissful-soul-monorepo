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
        className="fixed inset-0 z-[100] bg-black/90 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Pop-up Modal */}
      {/* Pop-up Modal — Vertical layout: image top, text bottom */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[101] w-[92%] max-w-2xl max-h-[90vh] bg-[#2C1E36] rounded-2xl md:rounded-[2rem] shadow-[0_0_100px_rgba(197,160,89,0.3)] overflow-y-auto flex flex-col border border-[#C5A059]/50 animate-in fade-in zoom-in duration-300">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-[102] p-1.5 md:p-2 bg-white/10 rounded-full text-white/70 hover:bg-white/20 hover:text-white hover:rotate-90 transition-all duration-300"
          aria-label="Close popup"
        >
          <XMark />
        </button>

        {/* Image — Top */}
        {imageUrl && (
          <div className="relative w-full h-[200px] md:h-[320px] flex-shrink-0 p-3 md:p-4 bg-[#2C1E36]/50">
            <div className="relative w-full h-full rounded-xl md:rounded-2xl overflow-hidden border border-[#C5A059]/20 shadow-2xl">
              <Image 
                src={imageUrl} 
                alt={data.title} 
                fill 
                className="object-cover bg-[#1F1426]" 
                priority
                sizes="(max-width: 768px) 100vw, 520px"
              />
            </div>
          </div>
        )}

        {/* Content — Bottom */}
        <div className={`px-6 py-10 md:px-10 md:py-12 flex flex-col items-center justify-center text-center relative overflow-hidden ${!imageUrl ? 'py-16 md:py-24' : ''}`}>
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/10 blur-[60px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600/10 blur-[60px] rounded-full pointer-events-none" />

          {/* Title — rendered as bullet list if it contains '•' */}
          {data.title.includes('•') ? (
            <ul className="text-left space-y-4 md:space-y-5 relative z-10 mb-8 md:mb-10 w-fit max-w-[95%] mx-auto">
              {data.title.split('•').map((line, i) => {
                const trimmed = line.trim()
                if (!trimmed) return null
                return (
                  <li key={i} className="flex items-start gap-3 md:gap-4">
                    <span className="text-[#C5A059] mt-[4px] md:mt-[6px] flex-shrink-0 text-xs md:text-sm">✦</span>
                    <span className="text-[#C5A059] font-serif text-base md:text-xl font-bold leading-tight tracking-wide">
                      {trimmed}
                    </span>
                  </li>
                )
              })}
            </ul>
          ) : (
            <h3 className="font-serif text-xl md:text-3xl text-[#C5A059] mb-3 md:mb-5 tracking-[0.03em] uppercase leading-[1.3] relative z-10 font-bold">
              {data.title}
            </h3>
          )}
          
          {/* Description — also supports bullet points with '•' */}
          {data.description && (
            data.description.includes('•') ? (
              <ul className="text-left space-y-2 md:space-y-3 relative z-10 mb-5 md:mb-8 w-fit max-w-[95%] mx-auto">
                {data.description.split('•').map((line, i) => {
                  const trimmed = line.trim()
                  if (!trimmed) return null
                  return (
                    <li key={i} className="flex items-start gap-3 md:gap-4">
                      <span className="text-[#C5A059]/80 mt-[5px] flex-shrink-0 text-[10px]">●</span>
                      <span className="text-purple-100/80 text-sm md:text-base leading-relaxed font-medium">
                        {trimmed}
                      </span>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="text-purple-100/70 text-xs md:text-sm mb-5 md:mb-8 leading-relaxed italic relative z-10 max-w-[380px]">
                {data.description}
              </p>
            )
          )}
          
          {data.button_text && (
            <LocalizedClientLink 
              href="/services"
              onClick={handleClose}
              className="inline-block px-10 md:px-14 py-3.5 md:py-4 bg-[#C5A059] text-[#2C1E36] rounded-full font-black uppercase tracking-[0.2em] text-xs md:text-sm hover:bg-white hover:text-[#2C1E36] transition-all shadow-xl hover:shadow-[#C5A059]/40 relative z-10 mt-8 md:mt-10"
            >
              {data.button_text}
            </LocalizedClientLink>
          )}


        </div>
      </div>
    </>
  )
}

export default WelcomePopup
