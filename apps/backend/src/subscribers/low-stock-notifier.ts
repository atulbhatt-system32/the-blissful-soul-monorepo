import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function lowStockHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const inventoryModule = container.resolve(Modules.INVENTORY)
  const productModule = container.resolve(Modules.PRODUCT)
  const notificationService = container.resolve("notification")
  const logger = container.resolve("logger")

  // 1. Fetch the updated inventory item to check levels
  const inventoryItem = await inventoryModule.retrieveInventoryItem(data.id)
  
  // Use the default location or sum up all locations
  const levels = await inventoryModule.listInventoryLevels({ inventory_item_id: data.id })
  const totalStock = levels.reduce((acc, level) => acc + (level.stocked_quantity - level.reserved_quantity), 0)

  // 2. Check if stock hits low (2) or out (0) thresholds
  if (totalStock <= 2) {
    const status = totalStock === 0 ? "OUT OF STOCK" : "LOW STOCK"
    
    // 3. Find the variant handle/title associated with this inventory item
    // Note: Link module is usually needed to find the exact variant, 
    // but we can log for now or query variant if we have the link.

    logger.warn(`[Inventory Alert] Item ${data.id} is ${status}. Current level: ${totalStock}`)

    // 4. Send Email to Admin
    try {
      await (notificationService as any).createNotifications([
        {
          to: process.env.ADMIN_EMAIL || "admin@theblissfulsoul.com",
          channel: "email",
          template: "inventory-alert",
          data: {
            subject: `Inventory Alert: ${status}`,
            html_body: `<p>Attention Admin,</p><p>An item is ${status}.</p><p>Inventory Item ID: ${data.id}</p><p>Current Balance: <b>${totalStock}</b></p>`,
          },
        }
      ])
    } catch (error) {
      logger.error(`Failed to send low stock notification for ${data.id}:`, error)
    }
  }
}

export const config: SubscriberConfig = {
  event: "inventory_item.updated",
}
