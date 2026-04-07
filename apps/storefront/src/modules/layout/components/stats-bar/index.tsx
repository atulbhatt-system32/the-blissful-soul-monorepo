"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

const defaultStats = [
  { label: "Happy Clients", value: "800+" },
  { label: "Years Experience", value: "3+" },
  { label: "Consultations", value: "4500+" },
  { label: "Positive Feedback", value: "10%" }
]

type StatItem = {
  label: string
  value: string
}

function parseStatValue(value: string): { num: number; suffix: string } {
  const match = value.match(/^([\d,.]+)(.*)$/)
  if (!match) return { num: 0, suffix: value }
  const num = parseFloat(match[1].replace(/,/g, ""))
  const suffix = match[2] || ""
  return { num, suffix }
}

function formatNumber(n: number): string {
  if (n >= 1000) {
    return n.toLocaleString("en-IN")
  }
  return n.toString()
}

function AnimatedNumber({ value, inView }: { value: string; inView: boolean }) {
  const { num, suffix } = parseStatValue(value)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!inView) {
      setCurrent(0)
      return
    }

    const duration = 2000 // 2 seconds
    const steps = 60
    const stepTime = duration / steps
    const increment = num / steps
    let step = 0

    const timer = setInterval(() => {
      step++
      if (step >= steps) {
        setCurrent(num)
        clearInterval(timer)
      } else {
        const progress = step / steps
        const eased = 1 - Math.pow(1 - progress, 3)
        setCurrent(Math.round(num * eased))
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [inView, num])

  return (
    <span>
      {formatNumber(current)}{suffix}
    </span>
  )
}

const StatsBar = ({ stats }: { stats?: StatItem[] | null }) => {
  const data = stats && stats.length > 0 ? stats : defaultStats
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={sectionRef}>
      {/* Dark Stats Section */}
      <section className="bg-[#120B15] py-16 md:py-20 text-white text-center">
        <div className="content-container flex flex-col items-center">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-24 w-full">
            {data.map((stat, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="flex flex-col items-center gap-y-3"
              >
                <span className="text-[42px] md:text-[48px] font-serif font-semibold text-[#C5A059] tracking-tight leading-none">
                  <AnimatedNumber value={stat.value} inView={isVisible} />
                </span>
                <span className="text-[10px] uppercase tracking-[0.5em] font-medium text-white/40 px-2 font-sans line-clamp-2 md:line-clamp-none whitespace-nowrap">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Light Google Reviews Section */}
      <section className="relative overflow-hidden bg-[#FDFCFB] py-10 md:py-14 border-y border-metal/10">
        {/* Subtle Grid Pattern Background */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px)] bg-[size:60px_60px]"></div>

        <div className="content-container relative z-10 flex flex-col items-center">
          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={isVisible ? { opacity: 1, scale: 1 } : {}}
             transition={{ duration: 0.6, delay: 0.4 }}
          >
            <a 
              href="#" 
              className="bg-[#F0EEEB] text-[#2C2830] px-10 py-3 rounded-full text-sm font-medium transition-all hover:bg-[#E8E4DF] shadow-sm inline-flex items-center font-sans tracking-wide"
            >
              Google reviews
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default StatsBar
