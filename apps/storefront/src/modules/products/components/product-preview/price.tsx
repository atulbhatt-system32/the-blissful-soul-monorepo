import { Text, clx } from "@medusajs/ui"
import { VariantPrice } from "types/global"

export default function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-x-2">
        {price.price_type === "sale" && (
          <span className="line-through text-gray-400 text-xs text-[10px] md:text-sm">
            {price.original_price}
          </span>
        )}
        <span className={clx("text-sm md:text-base font-bold", {
          "text-pink-500": price.price_type === "sale",
          "text-pink-950": price.price_type !== "sale",
        })}>
          {price.calculated_price}
        </span>
      </div>
    </div>
  )
}
