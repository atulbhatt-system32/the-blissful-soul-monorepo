import { defineRouteConfig } from "@medusajs/admin-sdk"
import { CurrencyDollar } from "@medusajs/icons"
import { Button, Container, Heading, Input, Label, Text, toast } from "@medusajs/ui"
import { useEffect, useState } from "react"

const WeightShippingConfigPage = () => {
  const [perKgRateRupees, setPerKgRateRupees] = useState("")
  const [shippingOptionId, setShippingOptionId] = useState("")
  const [optionName, setOptionName] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Fetch current config on mount
  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    setLoading(true)
    try {
      const res = await fetch("/admin/weight-shipping-config", {
        credentials: "include",
      })
      const data = await res.json()

      if (data.success) {
        setPerKgRateRupees(data.per_kg_rate_display)
        setShippingOptionId(data.shipping_option_id)
        setOptionName(data.name)
      } else {
        toast.error(data.message || "Failed to load config")
      }
    } catch (err: any) {
      toast.error("Failed to connect to server")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    const rupees = parseFloat(perKgRateRupees)
    if (isNaN(rupees) || rupees <= 0) {
      toast.error("Please enter a valid rate (e.g. 99)")
      return
    }

    const paisa = Math.round(rupees * 100)

    setSaving(true)
    try {
      const res = await fetch("/admin/weight-shipping-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ per_kg_rate: paisa }),
      })

      const data = await res.json()
      if (data.success) {
        toast.success(data.message)
      } else {
        toast.error(data.message || "Failed to save")
      }
    } catch (err: any) {
      toast.error("Failed to connect to server")
    } finally {
      setSaving(false)
    }
  }

  // Example calculations
  const rateNum = parseFloat(perKgRateRupees) || 0
  const examples = [
    { weight: "500g", kg: 1, cost: rateNum * 1 },
    { weight: "1 kg", kg: 1, cost: rateNum * 1 },
    { weight: "2 kg", kg: 2, cost: rateNum * 2 },
    { weight: "3 kg", kg: 3, cost: rateNum * 3 },
    { weight: "5 kg", kg: 5, cost: rateNum * 5 },
  ]

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center py-12">
          <Text className="text-ui-fg-muted">Loading shipping config...</Text>
        </div>
      </Container>
    )
  }

  if (!shippingOptionId) {
    return (
      <Container>
        <div className="py-8">
          <Heading level="h1" className="mb-4">Weight-Based Shipping Config</Heading>
          <div className="bg-ui-bg-field border border-ui-border-base rounded-lg p-6">
            <Text className="text-ui-fg-muted">
              No weight-based shipping option found. Please run the setup script first:
            </Text>
            <pre className="mt-2 bg-ui-bg-subtle p-3 rounded text-sm font-mono">
              npx medusa exec setup-weight-shipping.ts
            </pre>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="py-8">
        <div className="mb-8">
          <Heading level="h1" className="mb-2">Weight-Based Shipping Config</Heading>
          <Text className="text-ui-fg-muted">
            Configure the per-kg shipping rate for salt products. Changes take effect immediately.
          </Text>
        </div>

        {/* Current Shipping Option Info */}
        <div className="bg-ui-bg-field border border-ui-border-base rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <CurrencyDollar className="text-ui-fg-muted" />
            <Text className="font-semibold">Shipping Option</Text>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Text className="text-ui-fg-muted">Name</Text>
              <Text className="font-medium">{optionName}</Text>
            </div>
            <div>
              <Text className="text-ui-fg-muted">Option ID</Text>
              <Text className="font-mono text-xs">{shippingOptionId}</Text>
            </div>
          </div>
        </div>

        {/* Rate Editor */}
        <div className="bg-ui-bg-field border border-ui-border-base rounded-lg p-6 mb-6">
          <Label htmlFor="rate" className="mb-2 block font-semibold">
            Per-KG Shipping Rate (₹)
          </Label>
          <Text className="text-ui-fg-muted text-sm mb-4">
            Formula: <span className="font-mono">rate × ceil(total_weight_kg)</span>
          </Text>
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-ui-fg-muted">₹</span>
            <Input
              id="rate"
              type="number"
              min="1"
              step="1"
              value={perKgRateRupees}
              onChange={(e) => setPerKgRateRupees(e.target.value)}
              placeholder="99"
              className="max-w-[200px]"
            />
            <span className="text-sm text-ui-fg-muted">per kg</span>
          </div>
          <div className="mt-4">
            <Button
              onClick={handleSave}
              isLoading={saving}
              disabled={saving}
              variant="primary"
            >
              Save Rate
            </Button>
          </div>
        </div>

        {/* Preview Table */}
        <div className="bg-ui-bg-field border border-ui-border-base rounded-lg p-6">
          <Text className="font-semibold mb-4">Shipping Cost Preview</Text>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ui-border-base">
                <th className="text-left py-2 text-ui-fg-muted font-medium">Product Weight</th>
                <th className="text-left py-2 text-ui-fg-muted font-medium">Billable KG</th>
                <th className="text-right py-2 text-ui-fg-muted font-medium">Shipping Charge</th>
              </tr>
            </thead>
            <tbody>
              {examples.map((ex) => (
                <tr key={ex.weight} className="border-b border-ui-border-base last:border-0">
                  <td className="py-2">{ex.weight}</td>
                  <td className="py-2">{ex.kg} kg</td>
                  <td className="py-2 text-right font-medium">
                    ₹{ex.cost.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Weight Shipping",
  icon: CurrencyDollar,
})

export default WeightShippingConfigPage
