import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export type ShopCategoryTile = {
  id: string
  handle: string
  name: string
  image?: string
  comingSoon: boolean
}

/**
 * Whether a category is flagged "coming soon" in the Medusa admin via its
 * `coming_soon` metadata. The admin's metadata editor saves values as strings,
 * so "true" counts as well as a real boolean.
 */
export const isComingSoon = (metadata?: Record<string, unknown> | null) => {
  const value = metadata?.coming_soon
  return value === true || String(value).trim().toLowerCase() === "true"
}

const VARIANTS = {
  grid: {
    card: "rounded-[1.25rem] md:rounded-[2rem]",
    hover: "hover:shadow-xl hover:shadow-purple-900/10 transition-all duration-500",
    label: "p-3 md:p-4",
    text: "text-[11px] md:text-sm tracking-[0.12em] leading-snug",
    initial: "text-2xl md:text-3xl",
    badge: "top-3 left-3 px-2.5 py-1 text-[9px] md:text-[10px]",
    sizes: "(max-width: 1024px) 33vw, 17vw",
  },
  slider: {
    // h-full so every tile in a row matches when a name wraps to two lines.
    card: "h-full rounded-xl",
    hover: "",
    label: "flex flex-1 items-center justify-center px-1.5 py-2",
    text: "text-[11px] tracking-[0.06em] leading-tight break-words",
    initial: "text-xl",
    badge: "top-1.5 left-1.5 px-1.5 py-0.5 text-[8px]",
    sizes: "33vw",
  },
} as const

/**
 * One category tile, shared by the mobile slider and the tablet/desktop grid
 * so both handle "coming soon" the same way: a gold badge over a faded image,
 * and a plain block rather than a link, so nobody lands on an empty category.
 */
const CategoryTile = ({
  tile,
  variant,
}: {
  tile: ShopCategoryTile
  variant: keyof typeof VARIANTS
}) => {
  const v = VARIANTS[variant]

  const body = (
    <>
      <div className="relative w-full aspect-square bg-[#FAF9F6] overflow-hidden">
        {tile.image ? (
          <Image
            src={tile.image}
            alt={tile.name}
            fill
            sizes={v.sizes}
            className={`object-cover ${
              tile.comingSoon
                ? "opacity-60"
                : "group-hover:scale-105 transition-transform duration-700"
            }`}
          />
        ) : (
          // Placeholder until an image is uploaded to the category in the admin
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#2C1E36]/5 to-[#C5A059]/10">
            <span className={`font-serif italic text-[#2C1E36]/30 ${v.initial}`}>
              {tile.name?.charAt(0)}
            </span>
          </div>
        )}

        {tile.comingSoon && (
          <span
            className={`absolute rounded-full bg-[#C5A059] font-bold uppercase tracking-[0.12em] text-white shadow-sm ${v.badge}`}
          >
            Coming Soon
          </span>
        )}
      </div>

      <div className={`text-center ${v.label}`}>
        <span className={`block font-bold uppercase text-[#2C1E36] ${v.text}`}>
          {tile.name}
        </span>
      </div>
    </>
  )

  const card = `flex flex-col overflow-hidden bg-white border border-purple-50/60 shadow-sm ${v.card}`

  if (tile.comingSoon) {
    return (
      <div className={card} aria-disabled="true" data-testid="shop-category-coming-soon">
        {body}
      </div>
    )
  }

  return (
    <LocalizedClientLink
      href={`/categories/${tile.handle}`}
      className={`group ${card} ${v.hover}`}
      data-testid="shop-category-link"
    >
      {body}
    </LocalizedClientLink>
  )
}

export default CategoryTile
