import { Modules } from "@medusajs/framework/utils"
import { ExecArgs } from "@medusajs/framework/types"

/**
 * One-time setup script for weight-based shipping option.
 *
 * Run with: npx medusa exec setup-weight-shipping.ts
 *
 * Creates a "calculated" shipping option that uses the weight-based
 * fulfillment provider and creates the required dummy price set.
 */
export default async function ({ container }: ExecArgs) {
  const fulfillmentModule = container.resolve(Modules.FULFILLMENT)
  const pricingModule = container.resolve(Modules.PRICING)
  const remoteLink = container.resolve("remoteLink") as any
  const logger = container.resolve("logger")

  logger.info("=== Setting up Weight-Based Shipping Option ===")

  try {
    // Check if already exists
    const existing = await fulfillmentModule.listShippingOptions({
      provider_id: "weight-based_weight-based",
    })

    if (existing.length > 0) {
      logger.info(`Weight-based shipping option already exists: ${existing[0].id} - ${existing[0].name}`)
      logger.info("=== No changes needed ===")
      return
    }

    // Get the shipping service zone (India Shipping)
    const zones = await fulfillmentModule.listGeoZones()
    const indiaZone = zones.find((z: any) => z.country_code === "in")
    
    let shippingServiceZoneId
    if (indiaZone) {
      shippingServiceZoneId = indiaZone.service_zone_id
    } else {
      // Fallback
      const sszones = await fulfillmentModule.listServiceZones()
      shippingServiceZoneId = sszones[0].id
    }

    // Get shipping profile
    const profiles = await fulfillmentModule.listShippingProfiles()
    const profileId = profiles[0].id
    logger.info(`Shipping Profile: ${profileId}`)

    // Create weight-based shipping option
    const createdOptions = await fulfillmentModule.createShippingOptions([
      {
        name: "Weight-Based Delivery (Salt)",
        price_type: "calculated",
        service_zone_id: shippingServiceZoneId,
        shipping_profile_id: profileId,
        provider_id: "weight-based_weight-based",
        type: {
          label: "Weight-Based Delivery",
          description: "Shipping calculated by weight (per kg)",
          code: "weight-based-delivery",
        },
        data: {},
        rules: [
          {
            attribute: "enabled_in_store",
            operator: "eq",
            value: "true",
          },
        ],
        metadata: {
          per_kg_rate: 9900, // ₹99 per kg (in paisa)
        } as any,
      },
    ])

    const option = createdOptions[0]
    logger.info(`Created Shipping Option: ${option.id} - ${option.name}`)

    // Medusa v2 requires "calculated" shipping options to have a price set linked 
    // even though the price comes dynamically from calculatePrice
    logger.info(`Creating dummy price set for the calculated option...`)
    const priceSet = await pricingModule.createPriceSets([{
      prices: [
        {
          amount: 0,
          currency_code: "inr",
        }
      ]
    }])
    
    await remoteLink.create({
      [Modules.FULFILLMENT]: { shipping_option_id: option.id },
      [Modules.PRICING]: { price_set_id: priceSet.id }
    })

    logger.info("SUCCESS! Linked price set to shipping option")
    logger.info("=== DONE! Weight-based shipping option created. ===")
  } catch (error: any) {
    logger.error("Error:", error.message || error)
  }
}
