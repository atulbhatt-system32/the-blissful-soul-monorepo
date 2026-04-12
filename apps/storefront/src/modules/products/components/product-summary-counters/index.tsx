"use client"

import Eye from "@modules/common/icons/eye"
import Flame from "@modules/common/icons/flame"
import { Text, clx } from "@medusajs/ui"
import { useMemo } from "react"
import { motion } from "framer-motion"

interface ProductSummaryCountersProps {
  productId: string
  storeConfig?: any
}

const ProductSummaryCounters = ({ productId, storeConfig }: ProductSummaryCountersProps) => {
  // Use config from Strapi to determine if we show real or fake data
  // Allowing for different possible field names from Strapi config
  const isReal = storeConfig?.product_status_type === "real" || storeConfig?.show_real_data === true

  // Stable random logic for "fake" values based on productId
  const fakeSold = useMemo(() => {
    let hash = 0
    for (let i = 0; i < productId.length; i++) {
      hash = productId.charCodeAt(i) + ((hash << 5) - hash)
    }
    return Math.abs((hash % 20) + 5)
  }, [productId])

  const fakeWatching = useMemo(() => {
    let hash = 0
    for (let i = 0; i < productId.length; i++) {
      hash = productId.charCodeAt(i) + ((hash << 3) - hash)
    }
    return Math.abs((hash % 50) + 10)
  }, [productId])

  // Placeholder for real values
  const realSold = 2 
  const realWatching = 1

  return (
    <div className="flex flex-col gap-y-3 py-6 border-y border-gray-100">
      <div className="flex items-center gap-x-3 group">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-50 group-hover:bg-orange-100 transition-colors"
        >
          <Flame className="text-orange-600 outline-none" size={16} />
        </motion.div>
        <Text className="text-sm text-ui-fg-subtle">
          <span className="font-semibold text-ui-fg-base">
            {isReal ? realSold : fakeSold} Items
          </span>{" "}
          sold in last 3 hours
        </Text>
      </div>

      <div className="flex items-center gap-x-3 group">
        <motion.div 
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors"
        >
          <Eye className="text-blue-600 outline-none" size={16} />
        </motion.div>
        <Text className="text-sm text-ui-fg-subtle">
          <span className="font-semibold text-ui-fg-base">
            {isReal ? realWatching : fakeWatching}
          </span>{" "}
          People watching this product now!
        </Text>
      </div>

    </div>
  )
}

export default ProductSummaryCounters
