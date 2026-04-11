"use client"

import { Badge, Heading, Input, Label, Text } from "@medusajs/ui"
import React from "react"

import { applyPromotions } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import Trash from "@modules/common/icons/trash"
import ErrorMessage from "../error-message"
import { SubmitButton } from "../submit-button"

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")

  const { promotions = [] } = cart
  const removePromotionCode = async (code: string) => {
    const validPromotions = promotions.filter(
      (promotion) => promotion.code !== code
    )

    await applyPromotions(
      validPromotions.filter((p) => p.code !== undefined).map((p) => p.code!)
    )
  }

  const addPromotionCode = async (formData: FormData) => {
    setErrorMessage("")

    const code = formData.get("code")
    if (!code) {
      return
    }
    const input = document.getElementById("promotion-input") as HTMLInputElement
    const codes = promotions
      .filter((p) => p.code !== undefined)
      .map((p) => p.code!)
    codes.push(code.toString())

    try {
      await applyPromotions(codes)
    } catch (e: any) {
      setErrorMessage(e.message)
    }

    if (input) {
      input.value = ""
    }
  }

  return (
    <div className="w-full bg-transparent flex flex-col">
      <div className="txt-medium">
        <form action={(a) => addPromotionCode(a)} className="w-full">
          <div className={`flex justify-start ${isOpen ? 'mb-4' : ''}`}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="group flex items-center gap-x-3 text-[11px] uppercase tracking-[0.3em] font-bold text-[#C5A059] hover:text-white transition-all"
              data-testid="add-discount-button"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#C5A059]/30 transition-colors group-hover:border-white">
                {isOpen ? (
                  <svg width="8" height="2" viewBox="0 0 8 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 1V7M1 4H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )}
              </span>
              Have a Promotion Code?
            </button>
          </div>

          {isOpen && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex w-full items-center gap-x-2">
                <Input
                  className="h-10 border-metal/30 bg-black/40 hover:bg-black/60 text-white caret-white placeholder:text-white/20 focus:bg-black/60 focus:border-metal focus:ring-1 focus:ring-metal/20 rounded-xl transition-all shadow-inner"
                  id="promotion-input"
                  name="code"
                  type="text"
                  autoFocus={false}
                  placeholder="Code"
                  data-testid="discount-input"
                />
                <SubmitButton
                  variant="secondary"
                  className="bg-[#C5A059] text-[#2C1E36] hover:bg-white border-none rounded-xl h-10 px-4 text-[10px] font-black uppercase tracking-widest"
                  data-testid="discount-apply-button"
                >
                  Apply
                </SubmitButton>
              </div>
              <p className="mt-2 text-[9px] text-purple-300/60">
                Try: <span className="text-purple-200 uppercase">HEAL10</span>, <span className="text-purple-200 uppercase">CRYSTAL20</span>
              </p>

              <ErrorMessage
                error={errorMessage}
                data-testid="discount-error-message"
              />
            </div>
          )}
        </form>

        {promotions.length > 0 && (
          <div className="w-full flex items-center mt-4 pt-4 border-t border-white/10">
            <div className="flex flex-col w-full">
              <span className="text-[10px] uppercase tracking-widest text-purple-300 font-bold mb-3">
                Applied Blessings
              </span>

              {promotions.map((promotion) => {
                return (
                  <div
                    key={promotion.id}
                    className="flex items-center justify-between w-full mb-2 bg-white/5 p-2 rounded-lg border border-white/5"
                    data-testid="discount-row"
                  >
                    <div className="flex gap-x-2 items-center">
                       <span className="text-[11px] font-black text-white" data-testid="discount-code">
                        {promotion.code}
                       </span>
                       <span className="text-[10px] text-[#C5A059] font-bold">
                        (
                        {promotion.application_method?.value !== undefined &&
                          promotion.application_method.currency_code !==
                            undefined && (
                            <>
                              {promotion.application_method.type ===
                              "percentage"
                                ? `${promotion.application_method.value}%`
                                : convertToLocale({
                                    amount: +promotion.application_method.value,
                                    currency_code:
                                      promotion.application_method
                                        .currency_code,
                                  })}
                            </>
                          )}
                        )
                       </span>
                    </div>
                    {!promotion.is_automatic && (
                      <button
                        className="text-purple-300/40 hover:text-red-400 transition-colors"
                        onClick={() => {
                          if (!promotion.code) {
                            return
                          }

                          removePromotionCode(promotion.code)
                        }}
                        data-testid="remove-discount-button"
                      >
                        <Trash size={14} />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscountCode
