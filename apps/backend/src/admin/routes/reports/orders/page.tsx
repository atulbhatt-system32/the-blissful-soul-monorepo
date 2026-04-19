import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ArrowDownTray, DocumentText } from "@medusajs/icons"
import { Button, DatePicker, Heading, Text, toast } from "@medusajs/ui"
import { useState } from "react"

const OrdersReportPage = () => {
  const [from, setFrom] = useState<Date | undefined>()
  const [to, setTo] = useState<Date | undefined>()
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (from) params.set("from", from.toISOString())
      if (to) params.set("to", to.toISOString())

      const url = `/admin/reports/orders${params.size ? `?${params}` : ""}`
      const res = await fetch(url, { credentials: "include" })

      if (!res.ok) {
        toast.error("Failed to generate report")
        return
      }

      const blob = await res.blob()
      const anchor = document.createElement("a")
      anchor.href = URL.createObjectURL(blob)
      anchor.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`
      anchor.click()
      URL.revokeObjectURL(anchor.href)
      toast.success("Report downloaded")
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-y-4 p-8">
      <div className="flex items-center gap-x-3">
        <DocumentText className="text-ui-fg-subtle" />
        <Heading level="h1">Orders Report</Heading>
      </div>
      <Text className="text-ui-fg-subtle">
        Download a CSV export of orders matching the same format as WooCommerce order reports.
      </Text>

      <div className="bg-ui-bg-base border-ui-border-base mt-2 flex flex-col gap-y-4 rounded-xl border p-6 shadow-elevation-card-rest">
        <Heading level="h2">Filters</Heading>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-y-1">
            <Text size="small" weight="plus">
              From
            </Text>
            <DatePicker
              value={from}
              onChange={setFrom}
              placeholder="Start date"
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <Text size="small" weight="plus">
              To
            </Text>
            <DatePicker
              value={to}
              onChange={setTo}
              placeholder="End date"
            />
          </div>
        </div>
        <div className="flex items-center gap-x-2 pt-2">
          <Button
            variant="primary"
            onClick={handleDownload}
            isLoading={loading}
          >
            <ArrowDownTray />
            Download CSV
          </Button>
          {(from || to) && (
            <Button
              variant="transparent"
              onClick={() => {
                setFrom(undefined)
                setTo(undefined)
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Orders Report",
})

export default OrdersReportPage
