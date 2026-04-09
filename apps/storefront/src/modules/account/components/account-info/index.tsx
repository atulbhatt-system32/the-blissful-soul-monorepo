import { Disclosure } from "@headlessui/react"
import { Badge, Button, clx } from "@medusajs/ui"
import { useEffect } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import { useFormStatus } from "react-dom"

type AccountInfoProps = {
  label: string
  currentInfo: string | React.ReactNode
  isSuccess?: boolean
  isError?: boolean
  errorMessage?: string
  clearState: () => void
  children?: React.ReactNode
  'data-testid'?: string
}

const AccountInfo = ({
  label,
  currentInfo,
  isSuccess,
  isError,
  clearState,
  errorMessage = "An error occurred, please try again",
  children,
  'data-testid': dataTestid
}: AccountInfoProps) => {
  const { state, close, toggle } = useToggleState()
  const { pending } = useFormStatus()

  const handleToggle = () => {
    clearState()
    setTimeout(() => toggle(), 100)
  }

  useEffect(() => {
    if (isSuccess) {
      close()
    }
  }, [isSuccess, close])

  return (
    <div className="text-small-regular border-b border-gray-100 py-8 last:border-none animate-in fade-in slide-in-from-bottom-2 duration-500" data-testid={dataTestid}>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C5A059]">{label}</span>
          <div className="flex items-center gap-x-4">
            {typeof currentInfo === "string" ? (
              <span className="text-base font-serif text-[#2C1E36] font-bold" data-testid="current-info">{currentInfo}</span>
            ) : (
              <div className="text-base font-serif text-[#2C1E36] font-bold">{currentInfo}</div>
            )}
          </div>
        </div>
        <div>
          <Button
            variant="secondary"
            className={clx(
              "rounded-xl px-6 py-2 h-auto text-[10px] uppercase tracking-widest font-black transition-all",
              state ? "bg-gray-100 text-gray-500 hover:bg-gray-200" : "bg-[#2C1E36]/5 text-[#2C1E36] hover:bg-[#2C1E36] hover:text-white"
            )}
            onClick={handleToggle}
            type={state ? "reset" : "button"}
            data-testid="edit-button"
            data-active={state}
          >
            {state ? "Dismiss" : "Change"}
          </Button>
        </div>
      </div>

      {/* Success state */}
      <Disclosure>
        <Disclosure.Panel
          static
          className={clx(
            "transition-all duration-300 ease-in-out overflow-hidden",
            {
              "max-h-[100px] opacity-100 mt-4": isSuccess,
              "max-h-0 opacity-0": !isSuccess,
            }
          )}
          data-testid="success-message"
        >
          <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl border border-green-100 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span className="text-[11px] font-bold uppercase tracking-wider">{label} updated successfully</span>
          </div>
        </Disclosure.Panel>
      </Disclosure>

      {/* Error state  */}
      <Disclosure>
        <Disclosure.Panel
          static
          className={clx(
            "transition-all duration-300 ease-in-out overflow-hidden",
            {
              "max-h-[100px] opacity-100 mt-4": isError,
              "max-h-0 opacity-0": !isError,
            }
          )}
          data-testid="error-message"
        >
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl border border-red-100 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span className="text-[11px] font-bold uppercase tracking-wider">{errorMessage}</span>
          </div>
        </Disclosure.Panel>
      </Disclosure>

      <Disclosure>
        <Disclosure.Panel
          static
          className={clx(
            "transition-all duration-500 ease-in-out overflow-visible",
            {
              "max-h-[1000px] opacity-100 mt-6": state,
              "max-h-0 opacity-0 pointer-events-none": !state,
            }
          )}
        >
          <div className="bg-gray-50/50 p-6 md:p-8 rounded-[2rem] border border-gray-100">
            <div>{children}</div>
            <div className="flex items-center justify-end mt-8">
              <Button
                isLoading={pending}
                className="w-full small:max-w-[180px] bg-[#2C1E36] text-white rounded-xl py-4 h-auto text-[11px] uppercase tracking-[0.2em] font-black hover:opacity-90 shadow-xl shadow-purple-900/10 active:scale-95 transition-all"
                type="submit"
                data-testid="save-button"
              >
                Apply Changes
              </Button>
            </div>
          </div>
        </Disclosure.Panel>
      </Disclosure>
    </div>
  )
}

export default AccountInfo
