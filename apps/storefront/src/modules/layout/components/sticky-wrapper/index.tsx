"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion"

interface StickyWrapperProps {
  children: React.ReactNode
}

export default function StickyWrapper({ children }: StickyWrapperProps) {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [prevScroll, setPrevScroll] = useState(0)

  useMotionValueEvent(scrollY, "change", (latest) => {
    const isMobile = window.innerWidth < 768
    if (!isMobile && latest > prevScroll && latest > 150) {
      setHidden(true)
    } else {
      setHidden(false)
    }
    setPrevScroll(latest)
  })

  return (
    <motion.div
      variants={{
        visible: { y: 0 },
        hidden: { y: -160 },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="sticky top-0 inset-x-0 z-[100] w-full"
    >
      {children}
    </motion.div>
  )
}
