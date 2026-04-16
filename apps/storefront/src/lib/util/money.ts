import { isEmpty } from "./isEmpty"

/**
 * Splits `total` across `weights` proportionally using the largest remainder
 * method, guaranteeing the returned values sum exactly to `total`.
 */
export function allocateProportionally(weights: number[], total: number): number[] {
  const sum = weights.reduce((a, b) => a + b, 0)
  if (sum === 0) return weights.map(() => 0)

  const floors = weights.map(w => Math.floor((w / sum) * total))
  let remainder = total - floors.reduce((a, b) => a + b, 0)

  const order = weights
    .map((w, i) => ({ i, frac: (w / sum) * total - floors[i] }))
    .sort((a, b) => b.frac - a.frac)

  for (let k = 0; k < remainder; k++) floors[order[k].i]++

  return floors
}

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "en-US",
}: ConvertToLocaleParams) => {
  const isINR = currency_code?.toUpperCase() === "INR"

  // For INR, use 0 decimals by default to ensure a clean, rounded look.
  // Other currencies default to 2 decimal places.
  const minDigits = minimumFractionDigits ?? (isINR ? 0 : 2)
  const maxDigits = maximumFractionDigits ?? (isINR ? 0 : 2)

  // Use Math.round to ensure consistency if we're suppressing decimals
  const displayAmount = (minDigits === 0 && maxDigits === 0) ? Math.round(amount) : amount

  return currency_code && !isEmpty(currency_code)
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency_code,
        minimumFractionDigits: minDigits,
        maximumFractionDigits: maxDigits,
      }).format(displayAmount)
    : displayAmount.toString()
}
