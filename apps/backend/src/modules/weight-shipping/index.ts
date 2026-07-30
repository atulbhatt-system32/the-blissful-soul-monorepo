import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import WeightBasedFulfillmentService from "./service"

export default ModuleProvider(Modules.FULFILLMENT, {
  services: [WeightBasedFulfillmentService],
})
