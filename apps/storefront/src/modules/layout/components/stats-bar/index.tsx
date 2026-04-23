"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

const defaultStats = [
  { label: "Happy Clients", value: "50K+" },
  { label: "Years Experience", value: "10+" },
  { label: "Insta Followers", value: "80K+" },
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
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 md:gap-24 w-full">
            {data.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="flex flex-col items-center gap-y-3"
              >
                <span className="text-[32px] md:text-[48px] font-serif font-semibold text-[#C5A059] tracking-tight leading-none">
                  <AnimatedNumber value={stat.value} inView={isVisible} />
                </span>
                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.5em] font-medium text-white/40 px-2 font-sans text-center">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

export default StatsBar
