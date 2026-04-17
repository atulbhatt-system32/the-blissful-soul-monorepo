"use client"

import React, { useState } from "react"

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    regarding: "Healing Session",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()
      
      if (response.ok && (data as any).success) {
        setIsSuccess(true)
        setFormData({ name: "", email: "", phone: "", regarding: "Healing Session", message: "" })
      } else {
        setError((data as any).message || "Failed to send message. Please try again later.")
      }
    } catch (err: any) {
      setError("A network error occurred. Please check your connection.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-[#2C1E36]/5 shadow-2xl shadow-purple-900/10 animate-in fade-in zoom-in duration-500 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h3 className="text-2xl font-serif text-[#2C1E36] mb-3">Message Received</h3>
        <p className="text-[#665D6B] max-w-xs leading-relaxed">
          Your message has been sent. We'll get back to you shortly.
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          type="button"
          className="mt-8 text-[10px] uppercase tracking-[0.2em] font-bold text-[#C5A059] hover:text-[#2C1E36] transition-colors"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form className="space-y-10" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
        <div className="space-y-3 group relative">
          <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059] ml-1 transition-colors group-focus-within:text-[#2C1E36]">
            Your Name
          </label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-transparent border-b border-[#2C1E36]/10 px-1 py-3 focus:border-[#C5A059] outline-none transition-all font-sans text-[#2C1E36] placeholder:text-gray-200" 
            placeholder="Apurv..." 
          />
          <div className="absolute bottom-0 left-0 h-0.5 bg-[#C5A059] w-0 group-focus-within:w-full transition-all duration-500"></div>
        </div>
        
        <div className="space-y-3 group relative">
          <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059] ml-1 transition-colors group-focus-within:text-[#2C1E36]">
            Email Address
          </label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-transparent border-b border-[#2C1E36]/10 px-1 py-3 focus:border-[#C5A059] outline-none transition-all font-sans text-[#2C1E36] placeholder:text-gray-200" 
            placeholder="your@email.com" 
          />
          <div className="absolute bottom-0 left-0 h-0.5 bg-[#C5A059] w-0 group-focus-within:w-full transition-all duration-500"></div>
        </div>
        
        <div className="space-y-3 group relative">
          <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059] ml-1 transition-colors group-focus-within:text-[#2C1E36]">
            Phone Number
          </label>
          <input 
            type="tel" 
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-[#2C1E36]/10 px-1 py-3 focus:border-[#C5A059] outline-none transition-all font-sans text-[#2C1E36] placeholder:text-gray-200" 
            placeholder="+91..." 
          />
          <div className="absolute bottom-0 left-0 h-0.5 bg-[#C5A059] w-0 group-focus-within:w-full transition-all duration-500"></div>
        </div>
        
        <div className="space-y-3 group relative">
          <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059] ml-1 transition-colors group-focus-within:text-[#2C1E36]">
            Regarding
          </label>
          <select 
            name="regarding"
            value={formData.regarding}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-[#2C1E36]/10 px-1 py-3 focus:border-[#C5A059] outline-none transition-all font-sans text-[#2C1E36] appearance-none cursor-pointer"
          >
             <option value="Healing Session">Healing Session</option>
             <option value="Crystal Inquiry">Crystal Inquiry</option>
             <option value="Tarot Reading">Tarot Reading</option>
             <option value="Other">Other</option>
          </select>
          <div className="absolute bottom-0 left-0 h-0.5 bg-[#C5A059] w-0 group-focus-within:w-full transition-all duration-500"></div>
        </div>
      </div>
      
      <div className="space-y-3 group relative">
        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059] ml-1 transition-colors group-focus-within:text-[#2C1E36]">
          Your Message
        </label>
        <textarea 
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4} 
          required
          className="w-full bg-transparent border-b border-[#2C1E36]/10 px-1 py-3 focus:border-[#C5A059] outline-none transition-all font-sans text-[#2C1E36] placeholder:text-gray-200 resize-none" 
          placeholder="How can we help you?"
        ></textarea>
        <div className="absolute bottom-0 left-0 h-0.5 bg-[#C5A059] w-0 group-focus-within:w-full transition-all duration-500"></div>
      </div>
      
      {error && (
        <p className="text-red-500 text-xs font-medium pl-1">{error}</p>
      )}

      <div className="pt-6">
        <button 
          disabled={isSubmitting}
          type="submit" 
          className="px-16 h-16 bg-[#2C1E36] text-white rounded-full font-bold uppercase tracking-[0.3em] text-[11px] hover:bg-white hover:text-[#2C1E36] border border-transparent hover:border-[#2C1E36]/20 transition-all shadow-2xl shadow-purple-900/20 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-4"
        >
           {isSubmitting ? (
             <>
               <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
               Sending...
             </>
           ) : (
             "Send Message"
           )}
        </button>
      </div>
    </form>
  )
}

export default ContactForm
