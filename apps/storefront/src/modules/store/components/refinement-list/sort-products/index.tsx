import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "@headlessui/react"
import { Fragment } from "react"

export type SortOptions = "price_asc" | "price_desc" | "created_at" | "default" | "popularity" | "rating" | "latest"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

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

  const selected = options.find(o => o.value === sortBy) || options[0]

  return (
    <div className="flex items-center gap-x-2 md:gap-x-4 relative z-[40]" data-testid={dataTestId}>
      <span className="hidden md:block text-xs font-black text-[#2C1E36] uppercase tracking-[0.2em] font-sans whitespace-nowrap">
        Sort by
      </span>
      <div className="relative w-32 md:w-48">
        <Listbox
          value={selected}
          onChange={(v: any) => setQueryParams("sortBy", v.value as SortOptions)}
        >
          <div className="relative">
            <ListboxButton className="relative w-full bg-white border border-gray-100/80 rounded-[32px] py-2 md:py-3.5 pl-4 md:pl-6 pr-10 md:pr-12 text-left shadow-md hover:shadow-lg hover:border-[#C5A059]/30 transition-all duration-300 focus:outline-none group">
              <span className="block truncate text-xs font-bold uppercase tracking-[0.1em] text-[#2C1E36]">
                {selected.label}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-5">
                <svg 
                  className="h-3.5 w-3.5 text-[#C5A059] transition-transform duration-300 group-data-[active]:rotate-180" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth="4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </ListboxButton>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <ListboxOptions className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-2xl bg-white p-1 text-base shadow-2xl ring-1 ring-black/5 focus:outline-none sm:text-sm border border-gray-100/50 backdrop-blur-xl bg-white/95 shadow-[#2C1E36]/10">
                {options.map((option) => (
                  <ListboxOption
                    key={option.value}
                    value={option}
                    className={({ active, selected }) =>
                      `relative cursor-pointer select-none py-3.5 px-6 rounded-xl transition-all duration-200 ${
                        active ? 'bg-[#FAF9F6] text-[#C5A059]' : 'text-[#2C1E36]'
                      } ${selected ? 'font-black bg-gray-50/50' : 'font-medium'}`
                    }
                  >
                    {({ selected }) => (
                      <span className={`block truncate text-xs uppercase tracking-widest ${selected ? 'text-[#C5A059]' : ''}`}>
                        {option.label}
                      </span>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Transition>
          </div>
        </Listbox>
      </div>
    </div>
  )
}

export default SortProducts
