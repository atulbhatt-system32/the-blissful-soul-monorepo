import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { useState } from "react"
import { Button, Input, Label, Text, toast } from "@medusajs/ui"

const RazorpayRefundWidget = ({ data }: { data: any }) => {
  const razorpayId = data?.metadata?.razorpay_id
  const alreadyRefunded = data?.metadata?.razorpay_refund_id
  const maxAmount = (data?.total ?? 0) / 100

  const [amount, setAmount] = useState(String(maxAmount))
  const [loading, setLoading] = useState(false)

  if (!razorpayId) return null

  const handleRefund = async () => {
    const parsed = parseFloat(amount)
    if (isNaN(parsed) || parsed <= 0) {
      toast.error("Enter a valid amount")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/admin/custom/razorpay-refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ order_id: data.id, amount: parsed }),
      })

      const json = await res.json()

      if (!res.ok) {
        toast.error(json.message || "Refund failed")
      } else {
        toast.success(`Refund of ₹${parsed} initiated — ID: ${json.refund_id}`)
      }
    } catch (e: any) {
      toast.error(e.message || "Unexpected error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-ui-bg-base shadow-elevation-card-rest rounded-xl px-6 py-4 flex flex-col gap-y-3">
      <div className="flex items-center justify-between">
        <Text className="font-semibold text-ui-fg-base">Razorpay Refund</Text>
        <Text size="small" className="text-ui-fg-subtle font-mono">{razorpayId}</Text>
      </div>

      {alreadyRefunded ? (
        <Text size="small" className="text-ui-fg-subtle">
          Refunded ₹{data.metadata.razorpay_refunded_amount} — ID: {data.metadata.razorpay_refund_id}
        </Text>
      ) : (
        <div className="flex items-end gap-x-3">
          <div className="flex flex-col gap-y-1 flex-1">
            <Label htmlFor="refund-amount" size="xsmall">Amount (₹)</Label>
            <Input
              id="refund-amount"
              type="number"
              min="1"
              max={maxAmount}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <Button
            variant="secondary"
            size="small"
            onClick={handleRefund}
            disabled={loading}
          >
            {loading ? "Processing..." : "Refund via Razorpay"}
          </Button>
        </div>
      )}
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.side.before",
})

export default RazorpayRefundWidget
