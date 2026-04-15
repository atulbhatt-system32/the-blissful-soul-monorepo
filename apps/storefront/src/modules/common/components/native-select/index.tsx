import { ChevronUpDown } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import {
  SelectHTMLAttributes,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"

export type NativeSelectProps = {
  placeholder?: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
  label?: string
} & SelectHTMLAttributes<HTMLSelectElement>

const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  (
    {
      placeholder = "Select...",
      defaultValue = "",
      className,
      children,
      label,
      required,
      ...props
    },
    ref
  ) => {
    const innerRef = useRef<HTMLSelectElement>(null)
    const [isPlaceholder, setIsPlaceholder] = useState(false)

    useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
      ref,
      () => innerRef.current
    )

    useEffect(() => {
      if (innerRef.current && innerRef.current.value === "") {
        setIsPlaceholder(true)
      } else {
        setIsPlaceholder(false)
      }
    }, [innerRef.current?.value])

    return (
      <div className="flex flex-col w-full">
        <div
          onFocus={() => innerRef.current?.focus()}
          onBlur={() => innerRef.current?.blur()}
          className={clx(
            "relative flex items-center text-base-regular border border-ui-border-base bg-ui-bg-subtle rounded-md hover:bg-ui-bg-field-hover focus-within:border-[#2C1E36] focus-within:ring-2 focus-within:ring-[#2C1E36]/10 transition-all duration-200",
            className,
            {
              "text-ui-fg-muted": isPlaceholder,
            }
          )}
        >
          <select
            ref={innerRef}
            defaultValue={defaultValue}
            {...props}
            onChange={(e) => {
              if (props.onChange) props.onChange(e)
              setIsPlaceholder(e.target.value === "")
            }}
            className={clx(
              "appearance-none flex-1 bg-transparent border-none px-4 transition-colors duration-150 outline-none h-11 peer",
              {
                "pt-4 pb-1": label,
                "py-2.5": !label,
              }
            )}
          >
            <option disabled value="">
              {placeholder}
            </option>
            {children}
          </select>
          {label && (
            <label
              className={clx(
                "flex items-center justify-center mx-3 px-1 transition-all absolute duration-300 top-3 -z-1 origin-0 text-ui-fg-subtle text-small-regular peer-focus:-translate-y-2 peer-focus:text-xsmall-regular",
                {
                  "-translate-y-2 text-xsmall-regular": !isPlaceholder,
                }
              )}
            >
              {label}
              {required && <span className="text-rose-500">*</span>}
            </label>
          )}
          <span className="absolute right-4 inset-y-0 flex items-center pointer-events-none ">
            <ChevronUpDown />
          </span>
        </div>
      </div>
    )
  }
)

NativeSelect.displayName = "NativeSelect"

export default NativeSelect
