"use client"

import React, { useState, useEffect } from "react"
import { fetchAvailableSlots } from "@lib/data/calcom"

type SlotInfo = {
  time: string
  isoStart: string
}

type BookingSlotPickerProps = {
  eventSlug: string
  onSelect: (date: string, time: string, isoStart: string) => void
}

export default function BookingSlotPicker({ eventSlug, onSelect }: BookingSlotPickerProps) {
  // Use a fallback slug if none provided (e.g., for old bookings without stored slug)
  const effectiveSlug = eventSlug || "video-session"
  
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0] // Start with tomorrow
  )
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedSlotIso, setSelectedSlotIso] = useState<string>("")
  
  const [availableSlots, setAvailableSlots] = useState<SlotInfo[]>([])
  const [slotsLoading, setSlotsLoading] = useState(true) // Start as loading
  const [slotsError, setSlotsError] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedDate) return

    const loadSlots = async () => {
      setSlotsLoading(true)
      setSlotsError(null)
      setSelectedTime("")
      setSelectedSlotIso("")
      
      try {
        const slots = await fetchAvailableSlots(selectedDate, "Asia/Kolkata", effectiveSlug)
        setAvailableSlots(slots)
        if (slots.length === 0) {
          setSlotsError("No available slots for this date. Please try another date.")
        }
      } catch (err: any) {
        console.error("Failed to fetch slots:", err)
        setSlotsError(err?.message || "Failed to load available times.")
        setAvailableSlots([])
      } finally {
        setSlotsLoading(false)
      }
    }

    loadSlots()
  }, [selectedDate, effectiveSlug])

  const handleSlotClick = (slot: SlotInfo) => {
    setSelectedTime(slot.time)
    setSelectedSlotIso(slot.isoStart)
    onSelect(selectedDate, slot.time, slot.isoStart)
  }

  return (
    <div className="flex flex-col gap-y-6">
      <div>
        <label className="block text-[#2C1E36]/70 text-sm font-semibold mb-3 ml-1">Select Date</label>
        <div className="relative group">
          <input 
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
            className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:bg-white focus:border-[#2C1E36]/30 focus:ring-4 focus:ring-[#2C1E36]/5 text-[#2C1E36] font-bold text-lg transition-all appearance-none"
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#2C1E36]/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-[#2C1E36]/70 text-sm font-semibold mb-3 ml-1">Available Slots</label>
        
        {slotsLoading ? (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50/50 rounded-[2rem] border border-dashed border-[#2C1E36]/10">
            <div className="w-10 h-10 border-[3px] border-[#2C1E36]/10 border-t-[#2C1E36] rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 text-sm font-medium italic">Seeking availability...</p>
          </div>
        ) : slotsError ? (
          <div className="py-12 px-6 bg-orange-50/30 rounded-[2rem] border border-orange-100/50 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-12 h-12 bg-orange-100/50 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <p className="text-orange-700/80 text-sm font-semibold max-w-[200px] mx-auto leading-relaxed">{slotsError}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar animate-in fade-in duration-500">
            {availableSlots.map((slot) => (
              <button
                key={slot.isoStart}
                onClick={() => handleSlotClick(slot)}
                className={`py-4 px-4 rounded-2xl border-2 text-sm font-bold tracking-tight transition-all duration-300 ${
                  selectedSlotIso === slot.isoStart 
                    ? 'border-[#2C1E36] bg-[#2C1E36] text-white shadow-xl shadow-[#2C1E36]/20 scale-[0.98]' 
                    : 'border-gray-100/50 bg-white text-[#2C1E36]/60 hover:border-[#2C1E36]/20 hover:bg-gray-50 hover:text-[#2C1E36]'
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
