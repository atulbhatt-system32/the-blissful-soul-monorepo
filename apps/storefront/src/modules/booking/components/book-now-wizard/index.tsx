"use client"

import React, { useState, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@lib/util/get-product-price"
import { addToCart } from "@lib/data/cart"
import { useRouter } from "next/navigation"
import MedusaCheckoutPayment from "@modules/booking/components/book-now-wizard/payment-wrapper"
import { fetchAvailableSlots } from "@lib/data/calcom"
import GuestAutoRegister from "@modules/order/components/guest-auto-register"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type BookNowProps = {
  categories: any[]
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
  initialServiceId?: string
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
  region,
  initialServiceId,
  countryCode,
  customer
}: BookNowProps) {
  const router = useRouter()
//... // skipping all the logic, wait, I MUST provide the replacement exactly on the lines targeted or it will delete the middle part!!

// Let me use a smaller targeted replacement. I'll split it into two replacement calls.
  const [currentStep, setCurrentStep] = useState(1)

  // Form State
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedService, setSelectedService] = useState<string>(initialServiceId || "")
  const [selectedEmployee, setSelectedEmployee] = useState<string>(EMPLOYEES[0].id)
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

  // Set category if initialServiceId is provided
  useEffect(() => {
    if (initialServiceId) {
      const prod = products.find((p) => p.id === initialServiceId)
      if (prod && prod.categories && prod.categories.length > 0) {
        setSelectedCategory(prod.categories[0].id)
      }
    } else if (categories.length > 0 && !selectedCategory) {
      // Auto-select first category if none
      setSelectedCategory(categories[0].id)
    }
  }, [initialServiceId, products, categories])

  // Fetch real slots from Cal.com when date changes
  useEffect(() => {
    if (!selectedDate) return

    const loadSlots = async () => {
      setSlotsLoading(true)
      setSlotsError(null)
      setSelectedTime("")
      setSelectedSlotIso("")
      
      try {
        // Look for cal_link on the product or its first variant
        let calLink = serviceObj?.metadata?.cal_link || serviceObj?.variants?.[0]?.metadata?.cal_link
        let slug: string | undefined = undefined
        
        if (typeof calLink === "string") {
          // calLink might be full URL: https://cal.com/username/video-session
          // or just: username/video-session
          const parts = calLink.split('/')
          slug = parts[parts.length - 1] // Get the last part (the slug)
        }

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
  }, [selectedDate, selectedService])

  // Filter products by selected category
  const filteredProducts = products.filter((p) => {
    if (!selectedCategory) return true
    return p.categories?.some((c: any) => c.id === selectedCategory)
  })

  // Selected Service details
  const serviceObj = products.find((p) => p.id === selectedService)

  const handleNext = () => {
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
    }
    setCurrentStep((p) => Math.min(p + 1, 5))
  }
  const handlePrev = () => setCurrentStep((p) => Math.max(p - 1, 1))

  const isStep1Valid = selectedService && selectedCategory && selectedDate && selectedEmployee
  const isStep2Valid = selectedTime !== ""
  const isStep3Valid = details.firstName.trim() !== "" && details.lastName.trim() !== "" && details.email.trim() !== "" && details.phone.trim() !== ""

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-10">
      
      {/* Progress Bar */}
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
                onChange={(e) => setSelectedService(e.target.value)}
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

            {/* Employee */}
            <div>
              <label className="block text-[#2C1E36] text-sm font-bold mb-2">Employee</label>
              <select 
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-[#2C1E36]/30 bg-transparent text-gray-800"
              >
                {EMPLOYEES.map((e) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-[#2C1E36] text-sm font-bold mb-2">I'm available on or after</label>
              <input 
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-[#2C1E36]/30 text-gray-800"
              />
            </div>

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
          <h3 className="text-xl font-serif text-gray-800 mb-6 text-center">Your Details</h3>
          
          <div className="space-y-4 mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 text-sm mb-1">First Name *</label>
                <input 
                  type="text" 
                  value={details.firstName}
                  onChange={(e) => setDetails({...details, firstName: e.target.value})}
                  className="w-full border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-[#2C1E36]/30"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">Last Name *</label>
                <input 
                  type="text" 
                  value={details.lastName}
                  onChange={(e) => setDetails({...details, lastName: e.target.value})}
                  className="w-full border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-[#2C1E36]/30"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-600 text-sm mb-1">Email *</label>
              <input 
                type="email" 
                value={details.email}
                onChange={(e) => setDetails({...details, email: e.target.value})}
                className="w-full border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-[#2C1E36]/30"
              />
            </div>
            
            <div>
              <label className="block text-gray-600 text-sm mb-1">Phone *</label>
              <input 
                type="tel" 
                value={details.phone}
                onChange={(e) => setDetails({...details, phone: e.target.value})}
                className="w-full border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-[#2C1E36]/30"
              />
            </div>
          </div>

          <div className="flex justify-between">
            <button onClick={handlePrev} className="px-8 py-3 bg-gray-100 text-gray-600 rounded-md font-bold uppercase tracking-wider text-sm hover:bg-gray-200 transition-colors">Back</button>
            <button 
              disabled={!isStep3Valid}
              onClick={handleNext}
              className="px-10 py-3 bg-[#2C1E36] text-white rounded-md font-bold disabled:bg-gray-200 disabled:cursor-not-allowed uppercase tracking-wider text-sm hover:opacity-90 transition-all active:scale-95"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: PAYMENT */}
      {currentStep === 4 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
          <h3 className="text-xl font-serif text-gray-800 mb-6 text-center">Payment securing your booking</h3>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
            <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Booking Summary</h4>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Service:</span>
              <span className="font-medium text-right">{serviceObj?.title}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Date & Time:</span>
              <span className="font-medium text-right">{new Date(selectedDate).toLocaleDateString()}, {selectedTime}</span>
            </div>
            <div className="flex justify-between mb-2 text-[#2C1E36] font-bold mt-4 pt-4 border-t">
              <span>Total:</span>
              <span>
                {/* For mock purpose we display price text, in production Medusa cart calculates it */}
                {getProductPrice({ product: serviceObj! }).cheapestPrice?.calculated_price || 'Free'}
              </span>
            </div>
          </div>

          <MedusaCheckoutPayment 
            serviceId={selectedService}
            variantId={serviceObj?.variants?.[0]?.id || ""}
            details={details}
            date={selectedDate}
            time={selectedTime}
            slotIsoStart={selectedSlotIso}
            countryCode={countryCode}
            eventSlug={(() => {
              const calLink = serviceObj?.metadata?.cal_link || serviceObj?.variants?.[0]?.metadata?.cal_link
              if (typeof calLink === "string") {
                const parts = calLink.split('/')
                return parts[parts.length - 1]
              }
              return undefined
            })()}
            price={getProductPrice({ product: serviceObj! }).cheapestPrice?.calculated_price_number || 0}
            onSuccess={() => setCurrentStep(5)}
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
          <h2 className="text-3xl font-serif text-gray-800 mb-4">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-8">
            Thank you, {details.firstName}. Your session for <strong>{serviceObj?.title}</strong> on <strong>{new Date(selectedDate).toLocaleDateString()} at {selectedTime}</strong> has been successfully booked.
            We've sent a confirmation email to {details.email}.
          </p>

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

          {!customer && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <GuestAutoRegister 
                email={details.email} 
                firstName={details.firstName} 
                lastName={details.lastName}
              />
            </div>
          )}
        </div>
      )}

    </div>
  )
}
