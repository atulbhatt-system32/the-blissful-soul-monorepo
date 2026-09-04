import React from "react"

/**
 * Shared building blocks for the long-form legal pages (Terms of Service,
 * Refund & Return Policy). They exist so a policy page is written as its
 * content rather than as a few hundred lines of repeated card markup.
 */

export const CONTACT_EMAIL = "tbspragya@gmail.com"
export const CONTACT_PHONE = "+91 98116 11341"

const cardClass =
  "bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-purple-900/5 border border-purple-50/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-900/10"

export function PolicyHero({
  eyebrow,
  title,
  effectiveDate,
  lastUpdated,
  children,
}: {
  eyebrow: string
  title: React.ReactNode
  effectiveDate: string
  lastUpdated: string
  children?: React.ReactNode
}) {
  return (
    <div className="mb-20 text-center md:text-left">
      <span className="text-[11px] text-[#C5A059] font-bold uppercase tracking-[0.5em] mb-4 block">
        {eyebrow}
      </span>
      <h1 className="text-5xl md:text-6xl font-serif text-[#2C1E36] leading-[1.1] mb-6">
        {title}
      </h1>
      <div className="w-24 h-0.5 bg-[#C5A059] mt-8 mx-auto md:mx-0"></div>

      <div className="mt-8 flex flex-col sm:flex-row gap-2 sm:gap-8 justify-center md:justify-start text-[11px] uppercase tracking-[0.2em] text-[#665D6B]">
        <span>
          Effective Date:{" "}
          <span className="text-[#2C1E36] font-bold">{effectiveDate}</span>
        </span>
        <span>
          Last Updated:{" "}
          <span className="text-[#2C1E36] font-bold">{lastUpdated}</span>
        </span>
      </div>

      {children && (
        <div className="mt-8 space-y-4 text-lg text-[#665D6B] font-sans max-w-2xl leading-relaxed">
          {children}
        </div>
      )}
    </div>
  )
}

export function PolicySection({
  number,
  title,
  children,
}: {
  number: string
  title: string
  children: React.ReactNode
}) {
  // Alternate the badge colour so the numbered sections read as a sequence.
  const isGold = Number(number) % 2 !== 0

  return (
    <section className={cardClass}>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0">
          <span
            className={`flex items-center justify-center w-12 h-12 rounded-2xl font-serif italic text-xl ${
              isGold
                ? "bg-[#C5A059]/10 text-[#C5A059]"
                : "bg-[#2C1E36]/10 text-[#2C1E36]"
            }`}
          >
            {number}
          </span>
        </div>
        <div className="flex-grow">
          <h2 className="text-2xl font-serif text-[#2C1E36] mb-6">{title}</h2>
          <div className="font-sans text-[#665D6B] leading-relaxed space-y-4">
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}

/** A numbered section rendered on the dark aubergine card, for emphasis. */
export function DarkPolicySection({
  number,
  title,
  children,
}: {
  number: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="bg-[#2C1E36] p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-purple-900/20 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="relative z-10">
        <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 text-[#C5A059] font-serif italic text-xl mb-8">
          {number}
        </span>
        <h2 className="text-2xl font-serif text-white mb-6">{title}</h2>
        <div className="font-sans text-white/80 leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </section>
  )
}

/** A numbered section in a dashed gold outline, for savings/override clauses. */
export function OutlinedPolicySection({
  number,
  title,
  children,
}: {
  number: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="bg-[#FBFAF8] p-8 md:p-12 rounded-[2.5rem] border-2 border-dashed border-[#C5A059]/30">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0">
          <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#2C1E36]/10 text-[#2C1E36] font-serif italic text-xl">
            {number}
          </span>
        </div>
        <div className="flex-grow">
          <h2 className="text-2xl font-serif text-[#2C1E36] mb-6">{title}</h2>
          <div className="font-sans text-[#665D6B] leading-relaxed space-y-4">
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}

export function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#2C1E36] pt-2">
      {children}
    </h3>
  )
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 text-sm">
      {items.map((item) => (
        <li key={item} className="flex gap-4">
          <span className="text-[#C5A059] flex-shrink-0">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="space-y-3 text-sm">
      {items.map((item, i) => (
        <li key={item} className="flex gap-4">
          <span className="text-[#C5A059] font-serif italic flex-shrink-0">
            {i + 1}.
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  )
}

/** Items rendered as a two-column grid of pills, for long inventory-style lists. */
export function PillGrid({ items }: { items: string[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
      {items.map((item) => (
        <div
          key={item}
          className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] flex-shrink-0"></div>
          <span className="text-sm">{item}</span>
        </div>
      ))}
    </div>
  )
}

export function PolicyPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#FBFAF8] py-24 md:py-32 min-h-screen relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C5A059]/5 rounded-full blur-[100px] -mr-64 -mt-64"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#2C1E36]/5 rounded-full blur-[100px] -ml-64 -mb-64"></div>

      <div className="content-container max-w-4xl mx-auto px-4 md:px-0 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {children}
      </div>
    </div>
  )
}

export function PolicyFooterDates({
  effectiveDate,
  lastUpdated,
}: {
  effectiveDate: string
  lastUpdated: string
}) {
  return (
    <div className="mt-12 text-center text-[11px] uppercase tracking-[0.2em] text-[#665D6B]">
      <p>Effective Date: {effectiveDate}</p>
      <p className="mt-2">Last Updated: {lastUpdated}</p>
    </div>
  )
}

export function ContactDetails({ dark = false }: { dark?: boolean }) {
  const linkClass = "text-[#C5A059] font-bold hover:underline"

  return (
    <div
      className={`space-y-3 text-sm font-sans ${
        dark ? "text-white/80" : "text-[#665D6B]"
      }`}
    >
      <p
        className={`text-lg font-serif ${
          dark ? "text-white" : "text-[#2C1E36]"
        }`}
      >
        Pragya Vijh
      </p>
      <p>
        Email:{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
          {CONTACT_EMAIL}
        </a>
      </p>
      <p>
        Phone / WhatsApp:{" "}
        <a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className={linkClass}>
          {CONTACT_PHONE}
        </a>
      </p>
      <p>Location: Delhi, India</p>
      <p>
        Website:{" "}
        <a href="https://www.pragyavijh.com" className={linkClass}>
          www.pragyavijh.com
        </a>
      </p>
    </div>
  )
}
