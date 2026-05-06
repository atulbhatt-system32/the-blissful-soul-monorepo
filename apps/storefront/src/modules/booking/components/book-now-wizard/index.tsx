"use client"

import React, { useState, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@lib/util/get-product-price"
import MedusaCheckoutPayment from "@modules/booking/components/book-now-wizard/payment-wrapper"
import { fetchAvailableSlots } from "@lib/data/calcom"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { addToCart, deleteLineItem, getCartForBookingStep } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"

type BookNowProps = {
  categories: any[]
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
  initialServiceId?: string
  initialVariantId?: string
  countryCode: string
  customer?: HttpTypes.StoreCustomer | null
}

const STEPS = ["Service", "Time", "Details", "Payment", "Done"]

// Mock Data
const EMPLOYEES = [
  { id: "e1", name: "Pragya Vijh" },
  { id: "e2", name: "Master Healer" }
]

type SlotInfo = {
  time: string
  isoStart: string
}

export default function BookNowClient({
  categories,
  products,
  initialServiceId,
  initialVariantId,
  countryCode,
  customer
}: BookNowProps) {
  // Determine if initial service is a package to skip Steps 1 & 2
  const initialServiceObj = products.find((p) => p.id === (initialServiceId || ""))
  const isInitialPackage = initialServiceObj?.tags?.some((t: any) => t.value?.toLowerCase() === "package")

  const [currentStep, setCurrentStep] = useState(isInitialPackage ? 3 : 1)

  // Form State
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedService, setSelectedService] = useState<string>(initialServiceId || "")
  const [selectedVariant, setSelectedVariant] = useState<string>(initialVariantId || "")
  const selectedEmployee = EMPLOYEES[0].id
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedSlotIso, setSelectedSlotIso] = useState<string>("")
  
  // Cal.com slots state
  const [availableSlots, setAvailableSlots] = useState<SlotInfo[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [slotsError, setSlotsError] = useState<string | null>(null)
  
  const [details, setDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  })

  const [shippingAddress, setShippingAddress] = useState({
    address1: "",
    city: "",
    state: "",
    postalCode: "",
  })

  // Cart state for step 4
  const [cartItems, setCartItems] = useState<HttpTypes.StoreCartLineItem[]>([])
  const [cartLoading, setCartLoading] = useState(false)
  const [sessionLineItemId, setSessionLineItemId] = useState<string | null>(null)
  const [removingItemId, setRemovingItemId] = useState<string | null>(null)

  // Track if we have already initialized from URL params
  const hasInitialized = React.useRef(false)

  // Set category if initialServiceId is provided
  useEffect(() => {
    if (hasInitialized.current || products.length === 0 || categories.length === 0) return

    if (initialServiceId) {
      const prod = products.find((p) => p.id === initialServiceId)
      if (prod && prod.categories) {
        const matchingCat = prod.categories.find((pc: any) => 
          categories.some((c) => c.id === pc.id)
        )
        if (matchingCat) {
          setSelectedCategory(matchingCat.id)
          hasInitialized.current = true
        }
      }
    } else if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id)
      hasInitialized.current = true
    }
  }, [initialServiceId, products, categories, selectedCategory])

  // Fetch real slots from Cal.com when date changes
  useEffect(() => {
    if (!selectedDate) return

    const loadSlots = async () => {
      setSlotsLoading(true)
      setSlotsError(null)
      setSelectedTime("")
      setSelectedSlotIso("")
      
      try {
        const slug = serviceObj?.handle

        const slots = await fetchAvailableSlots(selectedDate, "Asia/Kolkata", slug)
        setAvailableSlots(slots)
        if (slots.length === 0) {
          setSlotsError("No available slots for this date. Please try another date.")
        }
      } catch (err: any) {
        console.error("Failed to fetch slots:", err)
        setSlotsError(err?.message || "Failed to load available times. Please try again.")
        setAvailableSlots([])
      } finally {
        setSlotsLoading(false)
      }
    }

    loadSlots()
  }, [selectedDate, selectedService, selectedVariant])

  // Filter products by selected category
  const filteredProducts = products
    .filter((p) => {
      if (!selectedCategory) return true
      return p.categories?.some((c: any) => c.id === selectedCategory)
    })
    .sort((a: any, b: any) => {
      const categoryHandle = categories.find(c => c.id === selectedCategory)?.handle || ""
      const rankA = a.metadata?.[`rank_${categoryHandle}`]
      const rankB = b.metadata?.[`rank_${categoryHandle}`]
      
      if (rankA !== undefined && rankB !== undefined) return Number(rankA) - Number(rankB)
      if (rankA !== undefined) return -1
      if (rankB !== undefined) return 1
      return 0
    })

  // Selected Service details
  const serviceObj = products.find((p) => p.id === selectedService)
  const isPackage = serviceObj?.tags?.some((t: any) => t.value?.toLowerCase() === "package")

  const addSessionToCartAndProceed = async () => {
    setCartLoading(true)
    try {
      const varId = selectedVariant || serviceObj?.variants?.[0]?.id || ""
      if (!varId) {
        alert("No variant selected. Please go back and select a service.")
        return
      }

      // Remove any stale booking items for this variant before adding fresh one
      const existingCart = await getCartForBookingStep()
      const staleBookings = (existingCart?.items || []).filter(
        (i) =>
          ((i as any).variant_id === varId || (i as any).variant?.id === varId) &&
          i.metadata?.is_booking === "true"
      )
      for (const stale of staleBookings) {
        await deleteLineItem(stale.id)
      }

      await addToCart({
        variantId: varId,
        quantity: 1,
        countryCode,
        metadata: {
          is_booking: "true",
          booking_date: isPackage ? "" : selectedDate,
          booking_time: isPackage ? "" : selectedTime,
          booking_slot_iso: isPackage ? "" : selectedSlotIso,
        },
      })
      const cart = await getCartForBookingStep()
      const items: HttpTypes.StoreCartLineItem[] = (cart?.items || []) as HttpTypes.StoreCartLineItem[]
      setCartItems(items)
      const bookingItem = items.find(
        (i) =>
          ((i as any).variant_id === varId || (i as any).variant?.id === varId) &&
          i.metadata?.is_booking === "true"
      )
      if (bookingItem) setSessionLineItemId(bookingItem.id)
      setCurrentStep(4)
    } catch (err: any) {
      console.error("Failed to add session to cart:", err)
      alert("Failed to prepare booking. Please try again.")
    } finally {
      setCartLoading(false)
    }
  }

  const handleRemoveCartItem = async (lineId: string) => {
    setRemovingItemId(lineId)
    try {
      await deleteLineItem(lineId)
      const cart = await getCartForBookingStep()
      const items: HttpTypes.StoreCartLineItem[] = (cart?.items || []) as HttpTypes.StoreCartLineItem[]
      setCartItems(items)
      
      const isRemovingSession = lineId === sessionLineItemId
      if (isRemovingSession) {
        setSessionLineItemId(null)
      }

      // Only go back to Step 1 if the cart is now empty
      if (items.length === 0) {
        setCurrentStep(1)
      }
    } catch (err: any) {
      console.error("Failed to remove cart item:", err)
    } finally {
      setRemovingItemId(null)
    }
  }

  const handleNext = () => {
    if (currentStep === 1 && isPackage) {
      setCurrentStep(3)
      return
    }
    if (currentStep === 3) {
      // Step 3 Validation
      if (!details.firstName.trim() || !details.lastName.trim()) {
        alert("Please enter your full name.")
        return
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(details.email)) {
        alert("Please enter a valid email address.")
        return
      }
      if (details.phone.length < 10) {
        alert("Please enter a valid phone number (at least 10 digits).")
        return
      }
      addSessionToCartAndProceed()
      return
    }
    setCurrentStep((p) => Math.min(p + 1, 5))
  }

  const handlePrev = () => {
    if (currentStep === 4) {
      if (sessionLineItemId) {
        const id = sessionLineItemId
        setSessionLineItemId(null)
        deleteLineItem(id).catch(console.error)
      }
      setCartItems([])
      setCurrentStep(3)
      return
    }
    if (currentStep === 3 && isPackage) {
      setCurrentStep(1)
      return
    }
    setCurrentStep((p) => Math.max(p - 1, 1))
  }

  const variantObj = serviceObj?.variants?.find((v: any) => v.id === selectedVariant)
  const lengthValue = variantObj?.length || serviceObj?.length || serviceObj?.variants?.[0]?.length
  const isConfigValid = !!lengthValue

  const isStep1Valid = selectedService && selectedCategory && selectedEmployee && (isPackage || selectedDate)
  const isStep2Valid = selectedTime !== ""
  const isStep3Valid = details.firstName.trim() !== "" && details.lastName.trim() !== "" && details.email.trim() !== "" && details.phone.trim() !== ""

  const sessionPrice = (() => {
    if (!serviceObj) return 0
    const vObj = serviceObj.variants?.find((v: any) => v.id === selectedVariant)
    return (vObj?.calculated_price as any)?.calculated_amount || getProductPrice({ product: serviceObj }).cheapestPrice?.calculated_price_number || 0
  })()

  const hamperTiers = products
    .filter((p: any) => p.tags?.some((t: any) => t.value === "gift-hamper") && p.metadata?.hamper_threshold != null)
    .map((p: any) => ({
      threshold: Number(p.metadata.hamper_threshold),
      title: p.title,
      gift_label: p.metadata?.gift_label as string | undefined,
      thumbnail: p.thumbnail || p.images?.[0]?.url || p.variants?.[0]?.images?.[0]?.url,
    }))
    .filter((t: any) => !isNaN(t.threshold))
    .sort((a: any, b: any) => b.threshold - a.threshold)

  // Use full cart total (session + products) if available, otherwise fall back to session price alone (Step 3 preview)
  const cartTotal = cartItems.reduce((sum, i) => sum + (i.unit_price ?? 0) * (i.quantity ?? 1), 0)
  const effectiveTotal = cartTotal > 0 ? cartTotal : sessionPrice

  const qualifiedHamper = sessionLineItemId ? hamperTiers.find((t: any) => effectiveTotal >= t.threshold) : null

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-10">
      
      {/* Progress Bar - Hidden for packages to feel like a direct checkout */}
      {!isPackage && (
        <div className="flex flex-col mb-10">
          <div className="flex justify-between mb-2">
            {STEPS.map((step, idx) => {
              const stepNum = idx + 1
              const isActive = currentStep === stepNum
              const isCompleted = currentStep > stepNum
              return (
                <div 
                  key={step} 
                  className={`text-[10px] md:text-sm font-bold uppercase ${isActive ? 'text-[#2C1E36]' : isCompleted ? 'text-[#2C1E36]/70' : 'text-gray-400'}`}
                >
                  {stepNum}. {step}
                </div>
              )
            })}
          </div>
          <div className="flex gap-1 h-3 w-full bg-gray-100 rounded-full overflow-hidden">
            {STEPS.map((_, idx) => {
              const stepNum = idx + 1
              return (
                <div 
                  key={idx} 
                  className={`h-full flex-1 ${stepNum <= currentStep ? 'bg-[#2C1E36]' : 'bg-transparent'}`}
                ></div>
              )
            })}
          </div>
        </div>
      )}

      {/* STEP 1: SERVICE */}
      {currentStep === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            {/* Category */}
            <div>
              <label className="block text-[#2C1E36] text-sm font-bold mb-2">Category</label>
              <select 
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value)
                  setSelectedService("") // reset service when cat changes
                }}
                className="w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-[#2C1E36]/30 bg-transparent text-gray-800"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Service */}
            <div>
              <label className="block text-[#2C1E36] text-sm font-bold mb-2">Service</label>
              <select 
                value={selectedService}
                onChange={(e) => {
                  const sId = e.target.value
                  setSelectedService(sId)
                  const sObj = products.find(p => p.id === sId)
                  if (sObj && sObj.variants && sObj.variants.length > 0) {
                    setSelectedVariant(sObj.variants[0].id)
                  } else {
                    setSelectedVariant("")
                  }
                }}
                className="w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-[#2C1E36]/30 bg-transparent text-gray-800"
                disabled={!selectedCategory}
              >
                <option value="">Select Service</option>
                {filteredProducts.map((p) => {
                  const { cheapestPrice } = getProductPrice({ product: p })
                  const priceStr = cheapestPrice?.calculated_price 
                    ? ` (${cheapestPrice.calculated_price})` 
                    : ''
                  return (
                    <option key={p.id} value={p.id}>{p.title}{priceStr}</option>
                  )
                })}
              </select>
            </div>

            {/* Date Picker Removed from Step 1 as requested - use Step 2 for scheduling */}

          </div>
          
          {/* Session Configuration warning removed as per user request (logic moved to handles) */}
          <div className="mt-4 mb-8">
            <p className="text-[11px] text-gray-400 italic">
              This is a non-cancellable and non-refundable {isPackage ? "package" : "session"}.
            </p>
          </div>

          <div className="flex justify-start">
            <button
              disabled={!isStep1Valid}
              onClick={handleNext}
              className="px-10 py-3 bg-[#2C1E36] text-white rounded-md font-bold disabled:bg-gray-200 disabled:cursor-not-allowed uppercase tracking-wider text-sm hover:opacity-90 transition-all active:scale-95"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: TIME */}
      {currentStep === 2 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-xl font-serif text-gray-800 mb-2">Select a Time for <span className="text-[#2C1E36]">{new Date(selectedDate).toDateString()}</span></h3>
          
          {/* Date picker for quick navigation */}
          <div className="mb-6">
            <label className="block text-gray-500 text-sm mb-1">Change Date</label>
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-[#2C1E36]/30 text-gray-800"
            />
          </div>

          {/* Loading State */}
          {slotsLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-[#2C1E36]/20 border-t-[#2C1E36] rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 text-sm">Fetching available slots...</p>
            </div>
          )}

          {/* Error / Empty State */}
          {!slotsLoading && slotsError && (
            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border border-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500 text-sm text-center">{slotsError}</p>
              <p className="text-gray-400 text-xs mt-2">Try selecting a different date above.</p>
            </div>
          )}

          {/* Slot Grid */}
          {!slotsLoading && !slotsError && availableSlots.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
              {availableSlots.map((slot) => (
                <button
                  key={slot.isoStart}
                  onClick={() => {
                    setSelectedTime(slot.time)
                    setSelectedSlotIso(slot.isoStart)
                  }}
                  className={`py-3 px-4 rounded-lg border-2 text-sm font-medium transition-all ${selectedTime === slot.time && selectedSlotIso === slot.isoStart ? 'border-[#2C1E36] bg-[#2C1E36]/5 text-[#2C1E36]' : 'border-gray-100 bg-white text-gray-600 hover:border-[#2C1E36]/20'}`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button onClick={handlePrev} className="px-8 py-3 bg-gray-100 text-gray-600 rounded-md font-bold uppercase tracking-wider text-sm hover:bg-gray-200 transition-colors">Back</button>
            <button 
              disabled={!isStep2Valid}
              onClick={handleNext}
              className="px-10 py-3 bg-[#2C1E36] text-white rounded-md font-bold disabled:bg-gray-200 disabled:cursor-not-allowed uppercase tracking-wider text-sm hover:opacity-90 transition-all active:scale-95"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: DETAILS */}
      {currentStep === 3 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
          <div className="bg-[#2C1E36]/5 p-4 rounded-lg mb-8 border border-[#2C1E36]/10">
            <p className="text-[10px] uppercase tracking-widest text-[#2C1E36]/60 mb-1 font-bold">Booking Details</p>
            <div className="flex justify-between items-center gap-4">
              <h4 className="text-base md:text-lg font-serif text-[#2C1E36] font-bold leading-tight">
                {serviceObj?.title}
                {selectedVariant && serviceObj?.variants?.find((v: any) => v.id === selectedVariant)?.title !== "Default Variant" && 
                  ` (${serviceObj?.variants?.find((v: any) => v.id === selectedVariant)?.title})`
                }
              </h4>
              <span className="text-[#2C1E36] font-bold whitespace-nowrap">
                {(() => {
                  const variantObj = serviceObj?.variants?.find((v: any) => v.id === selectedVariant)
                  const price = variantObj?.calculated_price
                  const priceStr = typeof price === 'string' ? price : (price as any)?.calculated_amount != null ? String((price as any).calculated_amount) : null
                  if (priceStr) return `₹${priceStr}`
                  const cheapest = getProductPrice({ product: serviceObj! }).cheapestPrice?.calculated_price
                  return cheapest || 'Free'
                })()}
              </span>
            </div>
            {!isPackage && selectedDate && selectedTime && (
              <p className="text-[11px] text-[#2C1E36]/60 mt-2 font-medium">
                Scheduled for: {new Date(selectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} at {selectedTime}
              </p>
            )}
            {qualifiedHamper && (
              <div className="mt-4 border-t border-[#2C1E36]/10 pt-4">
                <div className="w-full pl-2 pr-4 py-2 rounded-full bg-[#FAF5EB] border border-[#DAB97B] flex items-center shadow-sm">
                  <div className="flex items-center gap-3">
                    {qualifiedHamper.thumbnail && (
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-[#DAB97B]/50 bg-white flex-shrink-0">
                        <img src={qualifiedHamper.thumbnail} alt={qualifiedHamper.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <span className="text-[#B8860B] font-bold text-[12px] tracking-wide">
                      {qualifiedHamper.gift_label || `Free Gift: ${qualifiedHamper.title}`}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <h3 className="text-xl font-serif text-gray-800 mb-2 text-center">
            {isPackage ? "Where should we send your receipt?" : "Your Details"}
          </h3>
          {isPackage && <p className="text-center text-sm text-gray-500 mb-6">We need your email to send the automated confirmation mail you requested.</p>}
          {!isPackage && <div className="mb-6"></div>}
          
          <div className="space-y-4 mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 text-[11px] uppercase tracking-wider font-bold mb-1">First Name *</label>
                <input 
                  type="text" 
                  placeholder="John"
                  value={details.firstName}
                  onChange={(e) => setDetails({...details, firstName: e.target.value})}
                  className="w-full border border-gray-200 rounded-md py-2.5 px-3 focus:outline-none focus:border-[#2C1E36]/30 text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-[11px] uppercase tracking-wider font-bold mb-1">Last Name *</label>
                <input 
                  type="text" 
                  placeholder="Doe"
                  value={details.lastName}
                  onChange={(e) => setDetails({...details, lastName: e.target.value})}
                  className="w-full border border-gray-200 rounded-md py-2.5 px-3 focus:outline-none focus:border-[#2C1E36]/30 text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-600 text-[11px] uppercase tracking-wider font-bold mb-1">Email Address *</label>
              <input 
                type="email" 
                placeholder="john@example.com"
                value={details.email}
                onChange={(e) => setDetails({...details, email: e.target.value})}
                className="w-full border border-gray-200 rounded-md py-2.5 px-3 focus:outline-none focus:border-[#2C1E36]/30 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-gray-600 text-[11px] uppercase tracking-wider font-bold mb-1">Phone Number *</label>
              <input 
                type="tel" 
                placeholder="+91 00000 00000"
                value={details.phone}
                onChange={(e) => setDetails({...details, phone: e.target.value})}
                className="w-full border border-gray-200 rounded-md py-2.5 px-3 focus:outline-none focus:border-[#2C1E36]/30 text-sm"
              />
            </div>
          </div>

          <div className="mb-8 pt-4 border-t border-gray-50">
            <p className="text-[11px] text-gray-400 text-center italic leading-relaxed">
              This is a non-cancellable and non-refundable {isPackage ? "package" : "session"}. By proceeding, you agree to our terms of service.
            </p>
          </div>

          <div className="flex justify-between">
            <button onClick={handlePrev} className="px-8 py-3 bg-gray-100 text-gray-600 rounded-md font-bold uppercase tracking-wider text-sm hover:bg-gray-200 transition-colors">Back</button>
            <button
              disabled={!isStep3Valid || cartLoading}
              onClick={handleNext}
              className="px-10 py-3 bg-[#2C1E36] text-white rounded-md font-bold disabled:bg-gray-200 disabled:cursor-not-allowed uppercase tracking-wider text-sm hover:opacity-90 transition-all active:scale-95 flex items-center gap-2"
            >
              {cartLoading && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {cartLoading ? "Adding to cart..." : "Proceed to Payment"}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: PAYMENT */}
      {currentStep === 4 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
          <h3 className="text-xl font-serif text-gray-800 mb-6 text-center">Review & Pay</h3>

          {/* Cart Items */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 mb-6 overflow-hidden">
            <h4 className="font-bold text-gray-800 px-6 pt-5 pb-3 border-b border-gray-200">Your Cart</h4>
            {cartLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-[#2C1E36]/20 border-t-[#2C1E36] rounded-full animate-spin" />
              </div>
            ) : cartItems.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">No items in cart.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => {
                  const isSession = item.id === sessionLineItemId
                  const prod = (item as any).variant?.product
                  const thumbnail = prod?.thumbnail || prod?.images?.[0]?.url
                  const title = prod?.title || "Product"
                  const unitPrice = item.unit_price ?? 0
                  const priceLabel = convertToLocale({ amount: unitPrice, currency_code: "INR" })
                  const bookingDate = item.metadata?.booking_date as string | undefined
                  const bookingTime = item.metadata?.booking_time as string | undefined
                  const isRemoving = removingItemId === item.id
                  const isAutoGift = item.metadata?.is_auto_gift === true || item.metadata?.is_auto_gift === "true"
                  const giftLabel = isAutoGift ? (prod?.metadata?.gift_label as string | undefined) : undefined

                  return (
                    <div key={item.id} className="flex items-center gap-3 px-6 py-4">
                      {thumbnail && (
                        <div className="w-14 h-14 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                          <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-sm truncate">{title}</p>
                        {isSession && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {isPackage
                              ? "Package – flexible schedule"
                              : bookingDate && bookingTime
                              ? `${new Date(bookingDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} at ${bookingTime}`
                              : "Appointment"}
                          </p>
                        )}
                        {!isSession && (item.quantity ?? 1) > 1 && (
                          <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                        )}
                        {!isSession && unitPrice === 0 && isAutoGift && (
                          <div className="flex flex-col gap-y-1.5 mt-0.5">
                            <p className="text-[10px] uppercase tracking-widest text-[#C5A059] font-black">FREE GIFT</p>
                            {giftLabel && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#C5A059]/5 border border-[#C5A059]/30 text-[#C5A059] text-[10px] font-bold leading-none w-fit">
                                {giftLabel}
                              </span>
                            )}
                          </div>
                        )}
                        <p className="text-[#2C1E36] font-bold text-sm mt-1">{unitPrice === 0 ? "₹0.00" : priceLabel}</p>
                      </div>
                      {isAutoGift ? null : (
                        <button
                          onClick={() => handleRemoveCartItem(item.id)}
                          disabled={isRemoving}
                          className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 p-1 disabled:opacity-40"
                          title="Remove item"
                        >
                          {isRemoving ? (
                            <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin block" />
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Shipping address — only when physical products are in the cart */}
          {(() => {
            const hasPhysicalItems = cartItems.some(i => i.id !== sessionLineItemId && i.metadata?.is_booking !== "true")
            if (!hasPhysicalItems) return null
            const isAddressValid = shippingAddress.address1.trim() && shippingAddress.city.trim() && shippingAddress.postalCode.trim()
            return (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-6">
                <h4 className="font-bold text-[#2C1E36] text-sm mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Shipping Address
                  <span className="text-[11px] font-normal text-gray-500 ml-1">(required for physical items)</span>
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-600 text-[11px] uppercase tracking-wider font-bold mb-1">Address Line 1 *</label>
                    <input
                      type="text"
                      placeholder="House no., Street, Area"
                      value={shippingAddress.address1}
                      onChange={(e) => setShippingAddress(p => ({ ...p, address1: e.target.value }))}
                      className="w-full border border-gray-200 rounded-md py-2.5 px-3 focus:outline-none focus:border-[#2C1E36]/30 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-600 text-[11px] uppercase tracking-wider font-bold mb-1">City *</label>
                      <input
                        type="text"
                        placeholder="e.g. Mumbai"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress(p => ({ ...p, city: e.target.value }))}
                        className="w-full border border-gray-200 rounded-md py-2.5 px-3 focus:outline-none focus:border-[#2C1E36]/30 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 text-[11px] uppercase tracking-wider font-bold mb-1">State</label>
                      <input
                        type="text"
                        placeholder="e.g. Maharashtra"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress(p => ({ ...p, state: e.target.value }))}
                        className="w-full border border-gray-200 rounded-md py-2.5 px-3 focus:outline-none focus:border-[#2C1E36]/30 text-sm"
                      />
                    </div>
                  </div>
                  <div className="w-1/2">
                    <label className="block text-gray-600 text-[11px] uppercase tracking-wider font-bold mb-1">PIN Code *</label>
                    <input
                      type="text"
                      placeholder="e.g. 400001"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress(p => ({ ...p, postalCode: e.target.value }))}
                      className="w-full border border-gray-200 rounded-md py-2.5 px-3 focus:outline-none focus:border-[#2C1E36]/30 text-sm"
                    />
                  </div>
                </div>
                {!isAddressValid && (
                  <p className="text-xs text-amber-600 mt-3 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Please fill in your delivery address to proceed.
                  </p>
                )}
              </div>
            )
          })()}

          {/* Cart total with shipping */}
          {(() => {
            const hasPhysicalItems = cartItems.some(i => i.id !== sessionLineItemId && i.metadata?.is_booking !== "true")
            const subtotal = cartItems.reduce((sum, i) => sum + (i.unit_price ?? 0) * (i.quantity ?? 1), 0)
            const shipping = hasPhysicalItems ? 99 : 0  // ₹99
            const grandTotal = subtotal + shipping
            return (
              <div className="border-t border-gray-200 pt-4 mb-6 space-y-2 px-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-800 font-medium">{convertToLocale({ amount: subtotal, currency_code: "INR" })}</span>
                </div>
                {hasPhysicalItems && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping (Standard Delivery)</span>
                    <span className="text-gray-800 font-medium">{convertToLocale({ amount: shipping, currency_code: "INR" })}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-gray-800 font-bold">Total:</span>
                  <span className="text-[#2C1E36] font-bold text-lg">{convertToLocale({ amount: grandTotal, currency_code: "INR" })}</span>
                </div>
              </div>
            )
          })()}

          <MedusaCheckoutPayment
            serviceId={selectedService}
            variantId={selectedVariant || serviceObj?.variants?.[0]?.id || ""}
            serviceTitle={serviceObj?.title || ""}
            details={details}
            date={selectedDate}
            time={selectedTime}
            slotIsoStart={selectedSlotIso}
            countryCode={countryCode}
            eventSlug={serviceObj?.handle}
            meetingAbout={`${details.firstName} ${details.lastName} | ${details.phone}`}
            price={(() => {
              const hasPhysicalItems = cartItems.some(i => i.id !== sessionLineItemId && i.metadata?.is_booking !== "true")
              const subtotal = cartItems.reduce((sum, i) => sum + (i.unit_price ?? 0) * (i.quantity ?? 1), 0)
              return subtotal + (hasPhysicalItems ? 99 : 0)
            })()}
            isPackage={isPackage}
            hasSession={!!sessionLineItemId}
            cartItems={cartItems}
            shippingAddress={(() => {
              const hasPhysicalItems = cartItems.some(i => i.id !== sessionLineItemId && i.metadata?.is_booking !== "true")
              return hasPhysicalItems ? shippingAddress : undefined
            })()}
            isAddressRequired={cartItems.some(i => i.id !== sessionLineItemId && i.metadata?.is_booking !== "true")}
            onSuccess={() => {
              if (sessionLineItemId) {
                deleteLineItem(sessionLineItemId).catch(console.error)
                // We keep sessionLineItemId so the success screen can show booking details
              }
              setCurrentStep(5)
            }}
            onBack={handlePrev}
          />
        </div>
      )}

      {/* STEP 5: DONE */}
      {currentStep === 5 && (
        <div className="animate-in fade-in zoom-in-95 duration-500 max-w-lg mx-auto text-center py-10">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-serif text-gray-800 mb-2">
            {sessionLineItemId ? "Booking Confirmed!" : "Order Confirmed!"}
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Thank you, <strong>{details.firstName}</strong>. {sessionLineItemId ? (
              <>Your booking for <strong>{serviceObj?.title}</strong> has been successfully placed.</>
            ) : (
              <>Your purchase has been successfully completed.</>
            )}
            We've sent a confirmation email with your invoice to <strong>{details.email}</strong>.
          </p>

          {/* Itemized Summary */}
          <div className="bg-[#2C1E36]/5 rounded-2xl border border-[#2C1E36]/10 p-6 mb-10 text-left max-w-md mx-auto animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
             <h4 className="font-bold text-[#2C1E36] mb-4 text-[10px] uppercase tracking-[0.2em]">Purchase Summary</h4>
             <ul className="space-y-4">
               {cartItems.map((item) => {
                 const isSession = item.id === sessionLineItemId
                 const title = item.variant?.product?.title || item.title
                 const unitPrice = item.unit_price ?? 0
                 
                 return (
                   <li key={item.id} className="flex justify-between items-start gap-4">
                     <div className="flex-1 min-w-0">
                       <p className="text-sm font-bold text-[#2C1E36] truncate">{title}</p>
                       {isSession && (
                         <p className="text-[11px] text-[#2C1E36]/60 mt-0.5 font-medium">
                           {isPackage 
                             ? "Flexible schedule package" 
                             : `${new Date(selectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} at ${selectedTime}`
                           }
                         </p>
                       )}
                       {!isSession && (item.quantity ?? 1) > 1 && (
                         <p className="text-[11px] text-[#2C1E36]/60 mt-0.5 font-medium">Quantity: {item.quantity}</p>
                       )}
                     </div>
                     <p className="text-sm font-bold text-[#2C1E36] whitespace-nowrap">
                       {convertToLocale({ amount: unitPrice * (item.quantity ?? 1), currency_code: "INR" })}
                     </p>
                   </li>
                 )
               })}
             </ul>
             <div className="mt-6 pt-5 border-t border-[#2C1E36]/10 flex justify-between items-center">
               <span className="text-xs font-bold text-[#2C1E36]/50 uppercase tracking-wider">Total Paid</span>
               <span className="text-xl font-serif font-bold text-[#2C1E36]">
                 {convertToLocale({
                   amount: cartItems.reduce((sum, i) => sum + (i.unit_price ?? 0) * (i.quantity ?? 1), 0),
                   currency_code: "INR",
                 })}
               </span>
             </div>
          </div>

          {customer && (
            <div className="flex flex-col items-center gap-4">
              <LocalizedClientLink
                href="/account/sessions"
                className="w-full max-w-sm py-4 bg-[#2C1E36] text-white rounded-xl font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-all shadow-lg shadow-[#2C1E36]/10 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                Go to My Sessions
              </LocalizedClientLink>
            </div>
          )}

        </div>
      )}

    </div>
  )
}
