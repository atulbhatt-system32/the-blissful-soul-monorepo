import { Text, clx } from "@medusajs/ui"
import { VariantPrice } from "types/global"

export default function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-x-1.5 md:gap-x-2">
        {price.price_type === "sale" && (
          <span className="line-through text-gray-400 text-[9px] md:text-sm whitespace-nowrap">
            {price.original_price}
          </span>
        )}
        <span className={clx("text-base md:text-xl font-extrabold whitespace-nowrap", {
          "text-[#C5A059]": price.price_type === "sale",
          "text-[#2C1E36]": price.price_type !== "sale",
        })}>
          {price.calculated_price}
        </span>
      </div>
    </div>
  )
}
