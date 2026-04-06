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
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0] // Start with tomorrow
  )
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedSlotIso, setSelectedSlotIso] = useState<string>("")
  
  const [availableSlots, setAvailableSlots] = useState<SlotInfo[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [slotsError, setSlotsError] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedDate || !eventSlug) return

    const loadSlots = async () => {
      setSlotsLoading(true)
      setSlotsError(null)
      setSelectedTime("")
      setSelectedSlotIso("")
      
      try {
        const slots = await fetchAvailableSlots(selectedDate, "Asia/Kolkata", eventSlug)
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
  }, [selectedDate, eventSlug])

  const handleSlotClick = (slot: SlotInfo) => {
    setSelectedTime(slot.time)
    setSelectedSlotIso(slot.isoStart)
    onSelect(selectedDate, slot.time, slot.isoStart)
  }

  return (
    <div className="flex flex-col gap-y-6">
      <div>
        <label className="block text-gray-700 text-sm font-semibold mb-2">Select Date</label>
        <input 
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
          className="w-full border border-gray-200 rounded-lg py-2.5 px-4 focus:outline-none focus:border-pink-300 text-gray-800"
        />
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-semibold mb-2">Available Slots</label>
        
        {slotsLoading ? (
          <div className="flex flex-col items-center justify-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <div className="w-8 h-8 border-3 border-pink-200 border-t-pink-500 rounded-full animate-spin mb-3"></div>
            <p className="text-gray-400 text-xs">Looking for slots...</p>
          </div>
        ) : slotsError ? (
          <div className="py-8 px-4 bg-orange-50 rounded-xl border border-orange-100 text-center">
            <p className="text-orange-600 text-sm">{slotsError}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {availableSlots.map((slot) => (
              <button
                key={slot.isoStart}
                onClick={() => handleSlotClick(slot)}
                className={`py-2.5 px-3 rounded-lg border-2 text-xs font-bold transition-all ${
                  selectedSlotIso === slot.isoStart 
                    ? 'border-pink-500 bg-pink-50 text-pink-600 shadow-sm' 
                    : 'border-gray-100 bg-white text-gray-600 hover:border-pink-200 hover:bg-gray-50'
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
