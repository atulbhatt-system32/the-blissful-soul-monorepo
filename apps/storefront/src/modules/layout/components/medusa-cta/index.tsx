import { Text } from "@medusajs/ui"

import Medusa from "../../../common/icons/medusa"
import NextJs from "../../../common/icons/nextjs"

const MedusaCTA = () => {
  return (
    <Text className="flex gap-x-2 txt-compact-small-plus items-center text-[#2C1E36]/30 uppercase tracking-[0.2em] font-bold text-[10px]">
      © {new Date().getFullYear()} The Blissful Soul
    </Text>
  )
}

export default MedusaCTA
