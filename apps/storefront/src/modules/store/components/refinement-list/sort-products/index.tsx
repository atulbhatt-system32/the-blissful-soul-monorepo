"use client"

export type SortOptions = "price_asc" | "price_desc" | "created_at" | "default" | "popularity" | "rating" | "latest"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

const sortOptions = [
  { value: "default", label: "Default sorting" },
  { value: "popularity", label: "Sort by popularity" },
  { value: "rating", label: "Sort by average rating" },
  { value: "latest", label: "Sort by latest" },
  { value: "price_asc", label: "Sort by price: low to high" },
  { value: "price_desc", label: "Sort by price: high to low" },
]

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  const options = [
    { value: "latest", label: "Latest" },
    { value: "price_asc", label: "Price ↑" },
    { value: "price_desc", label: "Price ↓" },
    { value: "default", label: "Name" },
  ]

  const activeSort = options.some(o => o.value === sortBy) ? sortBy : "latest"

  return (
    <div className="flex items-center gap-x-3" data-testid={dataTestId}>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mr-2 font-sans">
        Sort
      </span>
      <div className="flex items-center gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setQueryParams("sortBy", opt.value as SortOptions)}
            className={`px-6 py-2.5 rounded-[24px] text-[11px] font-bold uppercase tracking-wider transition-all duration-300 border-[1.5px] ${
              activeSort === opt.value
                ? 'bg-[#2C1E36] text-white border-[#C5A059] shadow-md scale-105'
                : 'bg-white text-[#6B6670] border-gray-100 hover:border-[#2C1E36]/20'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SortProducts
