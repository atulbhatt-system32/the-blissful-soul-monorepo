// @ts-nocheck
import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils"
import { Logger } from "@medusajs/framework/types"

type InjectedDependencies = {
  logger: Logger
}

/**
 * Weight-based fulfillment provider for salt products.
 *
 * Calculates shipping as: per_kg_rate × ceil(total_weight_in_kg)
 * Default per_kg_rate = 9900 paisa (₹99).
 *
 * The per_kg_rate is read from the shipping option's metadata,
 * making it editable from the admin dashboard without redeployment.
 */
class WeightBasedFulfillmentService extends AbstractFulfillmentProviderService {
  static identifier = "weight-based"

  protected logger_: Logger

  constructor({ logger }: InjectedDependencies) {
    super()
    this.logger_ = logger
  }

  /**
   * Calculate shipping price based on total weight of items in the cart.
   *
   * @param optionData - Data from the shipping option (includes metadata with per_kg_rate)
   * @param data - Fulfillment data
   * @param context - Contains cart items with variant info (including weight)
   * @returns Price in smallest currency unit (paisa for INR)
   */
  async calculatePrice(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<any> {
    // Read per-kg rate from option metadata (set via admin widget)
    // Default to 9900 paisa = ₹99
    const metadata = (optionData as any)?.metadata || {}
    const perKgRate = Number(metadata.per_kg_rate) || 9900

    // Sum up total weight from all cart items
    const items = (context as any)?.items || []
    let totalWeightGrams = 0

    for (const item of items) {
      // Medusa stores weight in grams on the product variant
      const variantWeight = item.variant?.weight ?? item.weight ?? 0
      const quantity = item.quantity ?? 1
      totalWeightGrams += Number(variantWeight) * quantity
    }

    // Convert to kg and round up (minimum 1kg if any weight exists)
    const totalWeightKg = totalWeightGrams > 0
      ? Math.ceil(totalWeightGrams / 1000)
      : 1 // Default to 1kg if no weight data

    // perKgRate is stored in paisa (9900 = ₹99)
    // Medusa expects calculated_amount in the main currency unit for display
    const totalPricePaisa = perKgRate * totalWeightKg
    const totalPrice = totalPricePaisa / 100

    this.logger_.info(
      `[Weight Shipping] Items: ${items.length}, ` +
      `Total weight: ${totalWeightGrams}g (${totalWeightKg}kg), ` +
      `Rate: ₹${perKgRate / 100}/kg, ` +
      `Total: ₹${totalPrice.toFixed(2)}`
    )

    // Return object format required by Medusa's add-shipping-method-to-cart workflow
    // The workflow validates that calculated_price.calculated_amount exists
    return {
      calculated_amount: totalPrice,
      is_calculated_price_tax_inclusive: true,
    }
  }

  async validateFulfillmentData(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    return data
  }

  async validateOption(
    data: Record<string, unknown>
  ): Promise<boolean> {
    return true
  }

  async canCalculate(
    data: Record<string, unknown>
  ): Promise<boolean> {
    return true
  }

  async createFulfillment(
    data: Record<string, unknown>,
    items: Record<string, unknown>[],
    order: Record<string, unknown> | undefined,
    fulfillment: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    return {}
  }

  async cancelFulfillment(
    fulfillment: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    return {}
  }

  async getFulfillmentDocuments(
    data: Record<string, unknown>
  ): Promise<any> {
    return []
  }

  async createReturnFulfillment(
    fulfillment: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    return {}
  }

  async getReturnDocuments(
    data: Record<string, unknown>
  ): Promise<any> {
    return []
  }

  async getDeletionDocuments(
    data: Record<string, unknown>
  ): Promise<any> {
    return []
  }

  async retrieveDocuments(
    fulfillmentData: Record<string, unknown>,
    documentType: string
  ): Promise<any> {
    return []
  }
}

export default WeightBasedFulfillmentService
