import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { phoneMatchVariants, phonesMatch } from "../../../../lib/phone"

/**
 * POST /store/custom/resolve-phone
 *
 * Resolves a phone number to the account's login email so the storefront can
 * sign the customer in with the emailpass provider.
 *
 * The password is required and verified here: without it this route would be an
 * open oracle mapping phone numbers to email addresses (the publishable key
 * gating /store/* is public and ships to the browser). "No such phone" and
 * "wrong password" deliberately return the same message.
 */

// Same response for every failure, so nothing can be inferred from it.
const GENERIC_FAILURE = "Invalid phone number or password."

// `phone` is not unique on the customer model, so a number can hit several
// profiles. Verify a bounded number of them and let the password pick.
const MAX_CANDIDATES = 5

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { phone, password } = (req.body ?? {}) as {
    phone?: string
    password?: string
  }

  if (!phone || !password) {
    res
      .status(400)
      .json({ success: false, message: "Phone and password are required" })
    return
  }

  const variants = phoneMatchVariants(phone)

  if (!variants.length) {
    res.status(401).json({ success: false, message: GENERIC_FAILURE })
    return
  }

  try {
    const customerModule = req.scope.resolve(Modules.CUSTOMER)
    const authModule = req.scope.resolve(Modules.AUTH) as any

    // `phone` is a real column but is missing from FilterableCustomerProps,
    // hence the cast.
    const matched = await customerModule.listCustomers({
      phone: { $in: variants },
    } as any)

    // The filter only narrows: re-check each row against the requested number
    // so an ignored or over-broad filter can never widen the candidate set.
    const candidates = matched
      .filter((customer) => customer.email && phonesMatch(customer.phone ?? "", phone))
      .slice(0, MAX_CANDIDATES)

    for (const customer of candidates) {
      // Auth identities store entity_id exactly as it was registered, so try
      // the stored casing before falling back to lowercase.
      const emails = [customer.email!]
      if (customer.email!.toLowerCase() !== customer.email) {
        emails.push(customer.email!.toLowerCase())
      }

      for (const email of emails) {
        const { success } = await authModule.authenticate("emailpass", {
          body: { email, password },
        })

        if (success) {
          res.json({ success: true, email })
          return
        }
      }
    }

    res.status(401).json({ success: false, message: GENERIC_FAILURE })
  } catch (error) {
    req.scope
      .resolve("logger")
      .error(`[Resolve Phone] ${(error as Error).message}`)
    res.status(500).json({ success: false, message: "An error occurred" })
  }
}
