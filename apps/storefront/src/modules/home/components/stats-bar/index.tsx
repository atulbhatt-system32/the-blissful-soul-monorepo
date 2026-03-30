"use client"

import React, { useEffect, useRef, useState } from "react"

const defaultStats = [
  { label: "Happy Clients", value: "800+" },
  { label: "Years of Experience", value: "3+" },
  { label: "Successful Consultations", value: "4500+" },
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
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!inView || hasAnimated.current) return
    hasAnimated.current = true

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
        // Ease-out effect: faster at beginning, slower at end
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
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="bg-pink-300 py-10 md:py-16 text-white text-center">
      <div className="content-container grid grid-cols-2 lg:grid-cols-4 gap-8">
        {data.map((stat, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <span className="text-3xl md:text-5xl font-serif font-black mb-2 opacity-90 tracking-tighter transition-transform hover:scale-110 duration-300 inline-block px-1 sm:px-2">
              <AnimatedNumber value={stat.value} inView={isVisible} />
            </span>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest font-medium opacity-80 px-2 line-clamp-2 md:line-clamp-none">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default StatsBar
