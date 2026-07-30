// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

/**
 * GET /admin/weight-shipping-config
 *
 * Returns the current weight-based shipping configuration.
 * Reads the per_kg_rate from the shipping option's metadata.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const fulfillmentModule = req.scope.resolve(Modules.FULFILLMENT)

    // Find the weight-based shipping option
    const options = await fulfillmentModule.listShippingOptions({
      provider_id: "weight-based_weight-based",
    })

    if (!options.length) {
      return res.status(404).json({
        success: false,
        message: "Weight-based shipping option not found. Run the setup script first.",
      })
    }

    const option = options[0]
    const perKgRate = (option.metadata as any)?.per_kg_rate ?? 9900

    return res.json({
      success: true,
      shipping_option_id: option.id,
      per_kg_rate: perKgRate,
      per_kg_rate_display: (perKgRate / 100).toFixed(2),
      name: option.name,
    })
  } catch (error: any) {
    console.error("[Weight Shipping Config] GET error:", error.message)
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch config",
    })
  }
}

/**
 * POST /admin/weight-shipping-config
 *
 * Updates the per_kg_rate in the shipping option's metadata.
 * Body: { per_kg_rate: number } (in paisa, e.g. 9900 = ₹99)
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { per_kg_rate } = req.body as { per_kg_rate: number }

    if (!per_kg_rate || typeof per_kg_rate !== "number" || per_kg_rate <= 0) {
      return res.status(400).json({
        success: false,
        message: "per_kg_rate must be a positive number (in paisa)",
      })
    }

    const fulfillmentModule = req.scope.resolve(Modules.FULFILLMENT)

    // Find the weight-based shipping option
    const options = await fulfillmentModule.listShippingOptions({
      provider_id: "weight-based_weight-based",
    })

    if (!options.length) {
      return res.status(404).json({
        success: false,
        message: "Weight-based shipping option not found. Run the setup script first.",
      })
    }

    const option = options[0]

    // Update metadata with new rate
    const existingMetadata = (option.metadata as Record<string, unknown>) || {}
    await fulfillmentModule.updateShippingOptions([
      {
        id: option.id,
        metadata: {
          ...existingMetadata,
          per_kg_rate,
        },
      },
    ])

    console.log(`[Weight Shipping Config] Updated per_kg_rate to ${per_kg_rate} paisa (₹${(per_kg_rate / 100).toFixed(2)})`)

    return res.json({
      success: true,
      message: `Shipping rate updated to ₹${(per_kg_rate / 100).toFixed(2)} per kg`,
      per_kg_rate,
    })
  } catch (error: any) {
    console.error("[Weight Shipping Config] POST error:", error.message)
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update config",
    })
  }
}
