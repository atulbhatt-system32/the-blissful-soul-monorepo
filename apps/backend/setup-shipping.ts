import { Modules } from "@medusajs/framework/utils"
import { ExecArgs } from "@medusajs/framework/types"

export default async function ({ container }: ExecArgs) {
  const fulfillmentModule = container.resolve(Modules.FULFILLMENT)
  const regionModule = container.resolve(Modules.REGION)
  const remoteLink = container.resolve("remoteLink") 
  const pricingModule = container.resolve(Modules.PRICING)
  const logger = container.resolve("logger")
  
  logger.info("=== Creating proper shipping option ===")

  try {
    // Get India region
    const regions = await regionModule.listRegions({})
    const region = regions[0]
    logger.info(`Region: ${region.id} - ${region.name} (${region.currency_code})`)

    // Use the correct SHIPPING service zone (not pickup)
    // serzo_01KMQ2KNE5MD69P6KVX8GTX0JJ = India Shipping (type: shipping)  
    const shippingServiceZoneId = "serzo_01KMQ2KNE5MD69P6KVX8GTX0JJ"
    
    // Get shipping profile
    const profiles = await fulfillmentModule.listShippingProfiles()
    const profileId = profiles[0].id
    logger.info(`Shipping Profile: ${profileId}`)

    // Create shipping option under the SHIPPING fulfillment set
    const createdOptions = await fulfillmentModule.createShippingOptions([
      {
        name: "Standard Delivery",
        price_type: "flat",
        service_zone_id: shippingServiceZoneId,
        shipping_profile_id: profileId,
        provider_id: "manual_manual",
        type: {
          label: "Standard Delivery",
          description: "Standard delivery to your address",
          code: "standard-delivery"
        },
        rules: [
          {
            attribute: "enabled_in_store",
            operator: "eq",
            value: "true",
          }
        ]
      }
    ])
    const option = createdOptions[0]
    logger.info(`Created Shipping Option: ${option.id} - ${option.name}`)

    // Create a price set with ₹199 (flat rate)
    const priceSet = await pricingModule.createPriceSets([
      {
        prices: [
          {
            amount: 19900,
            currency_code: region.currency_code,
          }
        ]
      }
    ])
    logger.info(`Created Price Set: ${priceSet[0].id} with amount 19900`)

    // Link shipping option to price set via remote link
    await remoteLink.create({
      [Modules.FULFILLMENT]: {
        shipping_option_id: option.id,
      },
      [Modules.PRICING]: {
        price_set_id: priceSet[0].id,
      },
    })
    logger.info("Linked shipping option to price set!")

    logger.info("=== DONE! Shipping option created and priced. ===")
  } catch (error: any) {
    logger.error("Error:", error.message || error)
  }
}
