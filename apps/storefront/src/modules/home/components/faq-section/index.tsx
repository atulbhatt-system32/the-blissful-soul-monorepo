"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const defaultFaqs = [
  {
    question: "What are healing crystals?",
    answer: "Healing crystals are natural minerals that are believed to have unique vibrational frequencies. They have been used for centuries to help balance energy, promote emotional well-being, and support manifestation and spiritual growth."
  },
  {
    question: "How do I choose the right crystal for me?",
    answer: "The best way is to trust your intuition. Often, the crystal you're most drawn to is the one you need most. You can also choose based on your specific intentions, such as love (Rose Quartz), protection (Black Tourmaline), or abundance (Citrine)."
  },
  {
    question: "How do I cleanse and charge my crystals?",
    answer: "You can cleanse your crystals under moonlight, using sage or incense smoke, or placing them on a selenite charging plate. Charging them in sunlight or moonlight helps restore their natural energy levels."
  },
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we ship our spiritual tools and crystals worldwide. Shipping costs and delivery times vary by location and will be calculated at checkout."
  },
  {
    question: "Can I book a personalized session with Master Pragya?",
    answer: "Yes, we offer various one-on-one sessions including audio and video consultations. You can book these directly through the 'Sessions' page on our website."
  }
]

const FAQSection = ({ items }: { items?: any[] }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const displayFaqs = items && items.length > 0 ? items : defaultFaqs

  return (
    <section className="py-24 bg-[#FAF9F6]">
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
              className="border border-[#2C1E36]/5 rounded-3xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
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
