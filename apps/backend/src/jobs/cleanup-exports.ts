import { MedusaContainer } from "@medusajs/framework/types"
import * as fs from "fs"
import * as path from "path"

export default async function cleanupExports(container: MedusaContainer) {
  const staticDir = path.resolve(process.cwd(), "static")
  if (!fs.existsSync(staticDir)) return

  const files = fs.readdirSync(staticDir)
  const now = Date.now()
  const maxAgeMs = 1 * 60 * 1000 // 1 minute

  for (const file of files) {
    if (!file.endsWith(".csv")) continue
    const filePath = path.join(staticDir, file)
    const stat = fs.statSync(filePath)
    if (now - stat.mtimeMs > maxAgeMs) {
      fs.unlinkSync(filePath)
      console.log("[Cleanup] Deleted export file:", file)
    }
  }
}

export const config = {
  name: "cleanup-export-files",
  schedule: "* * * * *", // every minute
}
