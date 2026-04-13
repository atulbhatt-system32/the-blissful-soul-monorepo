import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Our policies regarding refunds and returns.",
}

export default function RefundPolicyPage() {
  return (
    <div className="bg-[#FBFAF8] py-24 md:py-32 min-h-screen relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2C1E36]/5 rounded-full blur-3xl -ml-48 -mb-48"></div>

      <div className="content-container max-w-3xl mx-auto px-4 md:px-0 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="mb-16">
          <span className="text-[10px] text-[#C5A059] font-bold uppercase tracking-[0.4em] mb-4 block">Trust & Clarity</span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#2C1E36] uppercase tracking-tight leading-loose">
            Refund <span className="italic font-normal">Policy</span>
          </h1>
          <div className="w-24 h-0.5 bg-[#C5A059] mt-6"></div>
        </div>
        
        <div className="prose prose-purple max-w-none font-sans text-base leading-relaxed text-[#665D6B] space-y-12">
          <section className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-purple-900/5 border border-purple-50/50">
            <h2 className="text-2xl font-bold text-[#2C1E36] mb-6 font-serif italic flex items-center gap-3">
              <span className="text-[#C5A059] not-italic text-sm font-sans tracking-widest">01.</span>
              Eligibility
            </h2>
            <div className="space-y-6">
              <p>
                We want you to be completely satisfied with your purchase. However, due to the spiritual and energetic nature of our crystals and services, we have specific criteria for refunds.
              </p>
              <div className="p-6 bg-gray-50/50 rounded-2xl border-l-2 border-[#C5A059]">
                <p className="font-bold text-[#2C1E36] mb-2 uppercase text-[11px] tracking-widest">Crystals & Products:</p>
                <p className="text-sm">To be eligible for a refund, crystals must be returned in their original condition and packaging within 7 days of receipt. Items that show signs of wear, alteration, or damage cannot be refunded.</p>
              </div>
              <div className="p-6 bg-gray-50/50 rounded-2xl border-l-2 border-[#2C1E36]">
                <p className="font-bold text-[#2C1E36] mb-2 uppercase text-[11px] tracking-widest">Services (Sessions):</p>
                <p className="text-sm">Refunds for services are only available if the appointment is cancelled at least 24 hours in advance. Once a session has been conducted, no refunds will be issued as the divine energy and time have already been shared.</p>
              </div>
            </div>
          </section>

          <section className="px-8 md:px-12">
            <h2 className="text-2xl font-bold text-[#2C1E36] mb-6 font-serif italic flex items-center gap-3">
              <span className="text-[#C5A059] not-italic text-sm font-sans tracking-widest">02.</span>
              Return Process
            </h2>
            <p>
              To initiate a return for a physical product, please contact our support team at <strong className="text-[#2C1E36]">theblissfulsoul27@gmail.com</strong> with your order number and reason for return.
            </p>
            <p className="mt-4">
              Once your return is received and inspected, we will send you an email to notify you that we have received your returned item and inform you of the approval or rejection of your refund.
            </p>
          </section>

          <section className="px-8 md:px-12">
            <h2 className="text-2xl font-bold text-[#2C1E36] mb-6 font-serif italic flex items-center gap-3">
              <span className="text-[#C5A059] not-italic text-sm font-sans tracking-widest">03.</span>
              Timelines
            </h2>
            <p>
              If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within <strong className="text-[#2C1E36]">7-10 business days</strong>.
            </p>
          </section>

          <section className="px-8 md:px-12">
            <h2 className="text-2xl font-bold text-[#2C1E36] mb-6 font-serif italic flex items-center gap-3">
              <span className="text-[#C5A059] not-italic text-sm font-sans tracking-widest">04.</span>
              Shipping Costs
            </h2>
            <p>
              Shipping costs are non-refundable. If you receive a refund, the cost of initial shipping will be deducted from your refund. You will also be responsible for paying for your own shipping costs for returning your item.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
