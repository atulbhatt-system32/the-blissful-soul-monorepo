import { Modules } from "@medusajs/framework/utils"
import { initialize as initAuth } from "@medusajs/auth"
import { config } from "dotenv"

config({ path: "apps/backend/.env" })

async function test() {
  try {
    const authModuleService = await initAuth({
        database: {
            clientUrl: process.env.DATABASE_URL
        }
    })
    const email = "nynisaso@rxzig.com" // that's what's in the screenshot!
    const authIdentities = await authModuleService.listAuthIdentities({
      provider_identities: { 
        entity_id: email, 
        provider_id: "emailpass" 
      }
    })
    console.log("Found:", JSON.stringify(authIdentities, null, 2))
  } catch (e) {
    console.error(e)
  }
}
test()
