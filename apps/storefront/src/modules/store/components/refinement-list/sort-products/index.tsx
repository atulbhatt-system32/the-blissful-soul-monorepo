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
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQueryParams("sortBy", e.target.value as SortOptions)
  }

  // Ensure sortBy maps to one of our allowed options, or fallback to default
  const currentValue = sortOptions.some(o => o.value === sortBy) ? sortBy : "default"

  return (
    <div className="relative" data-testid={dataTestId}>
      <select 
        value={currentValue} 
        onChange={handleChange}
        className="appearance-none bg-[#333333] text-white text-xs py-2.5 pl-4 pr-10 rounded-md shadow-sm outline-none cursor-pointer focus:ring-0 focus:border-transparent border-none border-transparent"
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 10px center',
          backgroundSize: '16px'
        }}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value} className="bg-[#333333] text-white py-1">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SortProducts
