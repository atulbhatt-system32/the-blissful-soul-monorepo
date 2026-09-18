import ProductRankModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const PRODUCT_RANK_MODULE = "product_rank"

export default Module(PRODUCT_RANK_MODULE, {
  service: ProductRankModuleService,
})
