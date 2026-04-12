"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { revalidateTag } from "next/cache"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
  removeAuthToken,
  removeCartId,
  setAuthToken,
} from "./cookies"

export const retrieveCustomer =
  async (): Promise<HttpTypes.StoreCustomer | null> => {
    const authHeaders = await getAuthHeaders()

    if (!authHeaders) return null

    const headers = {
      ...authHeaders,
    }

    const next = {
      ...(await getCacheOptions("customers")),
    }

    return await sdk.client
      .fetch<{ customer: HttpTypes.StoreCustomer }>(`/store/customers/me`, {
        method: "GET",
        query: {
          fields: "*orders",
        },
        headers,
        next,
        cache: "force-cache",
      })
      .then(({ customer }) => customer)
      .catch(() => null)
  }

export const updateCustomer = async (body: HttpTypes.StoreUpdateCustomer) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const updateRes = await sdk.store.customer
    .update(body, {}, headers)
    .then(({ customer }) => customer)
    .catch(medusaError)

  const cacheTag = await getCacheTag("customers")
  revalidateTag(cacheTag)

  return updateRes
}

export async function signup(_currentState: unknown, formData: FormData) {
  const password = formData.get("password") as string
  const customerForm = {
    email: formData.get("email") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    phone: formData.get("phone") as string,
  }

  try {
    const token = await sdk.auth.register("customer", "emailpass", {
      email: customerForm.email,
      password: password,
    })

    await setAuthToken(token as string)

    const headers = {
      ...(await getAuthHeaders()),
    }

    const { customer: createdCustomer } = await sdk.store.customer.create(
      customerForm,
      {},
      headers
    )

    const loginToken = await sdk.auth.login("customer", "emailpass", {
      email: customerForm.email,
      password,
    })

    await setAuthToken(loginToken as string)

    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)

    await transferCart()

    return createdCustomer
  } catch (error: any) {
    return error.toString()
  }
}

export async function login(_currentState: unknown, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    await sdk.auth
      .login("customer", "emailpass", { email, password })
      .then(async (token) => {
        await setAuthToken(token as string)
        const customerCacheTag = await getCacheTag("customers")
        revalidateTag(customerCacheTag)
      })
  } catch (error: any) {
    return error.toString()
  }

  try {
    await transferCart()
  } catch (error: any) {
    return error.toString()
  }

  // Extract countryCode from the current request path (e.g. /in/account → "in")
  // and redirect so the browser does a full navigation with the new JWT cookie,
  // causing the account layout to re-render and show the dashboard.
  const headersList = await headers()
  const pathname = headersList.get("next-url") || ""
  const countryCode = pathname.match(/^\/([a-z]{2})\//)?.[1] ?? "in"
  redirect(`/${countryCode}/account`)
}

export async function signout(countryCode: string) {
  await sdk.auth.logout()

  await removeAuthToken()

  const customerCacheTag = await getCacheTag("customers")
  revalidateTag(customerCacheTag)

  await removeCartId()

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)

  redirect(`/${countryCode}/account`)
}

export async function transferCart() {
  const cartId = await getCartId()

  if (!cartId) {
    return
  }

  const headers = await getAuthHeaders()

  await sdk.store.cart.transferCart(cartId, {}, headers)

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)
}

export const addCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<any> => {
  const addressType = formData.get("address_type") as string
  const isDefaultBilling = addressType === "billing"
  const isDefaultShipping = addressType === "shipping"

  const address = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company: formData.get("company") as string,
    address_1: formData.get("address_1") as string,
    address_2: formData.get("address_2") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    province: formData.get("province") as string,
    country_code: formData.get("country_code") as string,
    phone: formData.get("phone") as string,
    is_default_billing: isDefaultBilling,
    is_default_shipping: isDefaultShipping,
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.customer
    .createAddress(address, {}, headers)
    .then(async ({ customer }) => {
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

export const deleteCustomerAddress = async (
  addressId: string
): Promise<void> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.customer
    .deleteAddress(addressId, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

export const updateCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<any> => {
  const addressId =
    (currentState.addressId as string) || (formData.get("addressId") as string)

  if (!addressId) {
    return { success: false, error: "Address ID is required" }
  }

  const addressType = formData.get("address_type") as string
  const isDefaultBilling = addressType === "billing"
  const isDefaultShipping = addressType === "shipping"

  const address = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company: formData.get("company") as string,
    address_1: formData.get("address_1") as string,
    address_2: formData.get("address_2") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    province: formData.get("province") as string,
    country_code: formData.get("country_code") as string,
    is_default_billing: isDefaultBilling,
    is_default_shipping: isDefaultShipping,
  } as HttpTypes.StoreUpdateCustomerAddress

  const phone = formData.get("phone") as string

  if (phone) {
    address.phone = phone
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.customer
    .updateAddress(addressId, address, {}, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

/**
 * Request a password reset email for a customer.
 * First checks if the customer exists in our DB before triggering the reset flow.
 */
export async function requestPasswordReset(email: string) {
  try {
    // 1. Check if the customer actually exists before triggering the reset
    const backendUrl = process.env.STOREFRONT_MEDUSA_URL || "http://localhost:9000"
    const checkRes = await fetch(`${backendUrl}/custom/check-account?email=${encodeURIComponent(email)}`)
    const checkData = await checkRes.json()

    if (!checkData.exists) {
      console.log(`[Password Reset] No account found for ${email}. Blocking reset.`)
      return { success: false, error: "No account found with this email address." }
    }

    // 2. Customer exists — proceed with the actual reset via robust synchronous proxy
    const resetRes = await fetch(`${backendUrl}/custom/password-reset-request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    })
    
    if (!resetRes.ok) {
      const errorData = await resetRes.json().catch(() => ({}))
      throw new Error(errorData.message || errorData.error || "Failed to process reset request via backend proxy.")
    }

    return { success: true }
  } catch (error: any) {
    console.error("[Password Reset] Error requesting token:", error.message || error)
    return { success: false, error: error.message || "Failed to request password reset. Please try again." }
  }
}

/**
 * Set a new password using the token sent via email.
 */
export async function resetPassword(email: string, token: string, newPassword: string) {
  try {
    const backendUrl = process.env.STOREFRONT_MEDUSA_URL || "http://localhost:9000"
    
    const updateRes = await fetch(`${backendUrl}/custom/password-reset-update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token, password: newPassword })
    })

    const updateData = await updateRes.json()

    if (!updateRes.ok) {
      return { success: false, error: updateData.message || "Reset failed. Your token may be invalid or expired." }
    }
    
    // Auto login after successful reset
    try {
        const loginToken = await sdk.auth.login("customer", "emailpass", { email, password: newPassword })
        if (loginToken) {
           await setAuthToken(loginToken as string)
           const customerCacheTag = await getCacheTag("customers")
           revalidateTag(customerCacheTag)
        }
    } catch {}
    
    return { success: true }
  } catch (error: any) {
    console.error("[Password Reset] Error resetting password:", error.message || error)
    return { success: false, error: error.message || "Failed to reset password. Please try again." }
  }
}
