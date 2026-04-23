"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const FAQSection = ({ items }: { items?: any[] }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const displayFaqs = items && items.length > 0 ? items : []

  if (displayFaqs.length === 0) return null

  return (
    <section className="py-24 bg-white">
      <div className="content-container max-w-4xl">
        <div className="text-center mb-16">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold text-[#C5A059] font-sans mb-4 block">
            Got Questions?
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#2C1E36] mb-6 uppercase tracking-tight leading-tight">
            Frequently Asked <span className="italic">Questions</span>
          </h2>
          <div className="h-0.5 w-24 bg-[#C5A059]/40 mx-auto rounded-full" />
        </div>

        <div className="space-y-4">
          {displayFaqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-[#2C1E36]/5 rounded-3xl bg-[#FAF9F6] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left"
              >
                <span className="text-lg md:text-xl font-serif font-bold text-[#2C1E36]">
                  {faq.question}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border border-[#C5A059]/30 transition-transform duration-300 ${activeIndex === index ? 'rotate-180 bg-[#C5A059] text-white' : 'text-[#C5A059]'}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 md:px-8 pb-8 text-[#665D6B] leading-relaxed font-medium">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQSection
