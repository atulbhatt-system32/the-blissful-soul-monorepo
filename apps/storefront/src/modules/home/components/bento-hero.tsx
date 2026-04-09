"use client"

import React from "react"
import { motion } from "framer-motion"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const BentoHero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }
    }
  }

  return (
    <section className="w-full py-8 md:py-12 relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] to-[#F1ECE5]">
      {/* Subtle Grid Pattern Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:60px_60px]"></div>

      <div className="content-container relative z-10">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Welcome Card */}
          <motion.div 
            variants={cardVariants}
            className="md:col-span-2 bg-[#FDFCFB]/90 backdrop-blur-sm rounded-[40px] p-10 md:p-14 flex flex-col justify-between min-h-[450px] md:min-h-[520px] shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-white/60"
          >
            <div className="flex flex-col gap-y-6">
              <span className="text-[11px] md:text-[12px] uppercase tracking-[0.25em] font-semibold text-[#C5A059] font-sans">
                WELCOME
              </span>
              <h1 className="font-serif text-[32px] md:text-[48px] text-[#2C1E36] leading-[1.15] tracking-tight max-w-xl font-semibold">
                Heal, manifest & align with Master Pragya Vijh
              </h1>
              <p className="text-[#665D6B] text-[14px] md:text-[15px] leading-[1.65] max-w-md font-sans font-medium">
                Premium healing crystals, bracelets, pyramids — and personal audio & video sessions for clarity and growth.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <LocalizedClientLink 
                href="/book-session" 
                className="bg-[#2C1E36] text-white px-8 py-3.5 rounded-full font-medium text-[14px] hover:opacity-90 transition-all shadow-lg active:scale-95 font-sans"
              >
                Book now
              </LocalizedClientLink>
              <LocalizedClientLink 
                href="/about" 
                className="bg-white text-[#2C1E36] border border-[#2C1E36]/15 px-8 py-3.5 rounded-full font-medium text-[14px] hover:bg-[#F8F6F3] transition-all font-sans shadow-sm"
              >
                Read more
              </LocalizedClientLink>
            </div>
          </motion.div>

          {/* Right Column Stack */}
          <div className="flex flex-col gap-6 md:gap-8">
            {/* Sacred Collection Card */}
            <motion.div 
              variants={cardVariants}
              className="flex-1 bg-[#F4EFEA]/80 backdrop-blur-sm rounded-[40px] flex items-center justify-center p-8 min-h-[220px] shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-[#E8DFD5]/40 group relative overflow-hidden cursor-pointer"
            >
               <LocalizedClientLink href="/store" className="flex flex-col items-center gap-y-2 z-10 transition-transform group-hover:scale-105 duration-500">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#C5A059]">TREASURES</span>
                  <span className="font-serif text-2xl text-[#2C1E36] font-medium">
                     Sacred Collection
                  </span>
               </LocalizedClientLink>
               <div className="absolute inset-0 bg-gradient-to-tr from-[#C5A059]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </motion.div>

            {/* Shop Card */}
            <motion.div 
              variants={cardVariants}
              className="flex-1 bg-[#FDF6EF]/70 backdrop-blur-sm rounded-[40px] p-10 flex flex-col justify-between min-h-[260px] shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-white/40"
            >
              <div className="flex flex-col gap-y-4">
                <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#5A8A6A] font-sans">
                  SHOP
                </span>
                <h3 className="font-serif text-[22px] text-[#2C1E36] font-semibold leading-tight">
                  Crystals & tools
                </h3>
                <p className="text-[#665D6B] text-[14px] font-sans font-medium">
                  Bracelets, pyramids, tumbles & more.
                </p>
              </div>
              
              <LocalizedClientLink 
                href="/store" 
                className="bg-[#2C1E36] text-white px-7 py-3 rounded-full font-medium text-[14px] self-start hover:opacity-90 transition-all shadow-md font-sans mt-6 inline-block"
              >
                Explore shop
              </LocalizedClientLink>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default BentoHero
