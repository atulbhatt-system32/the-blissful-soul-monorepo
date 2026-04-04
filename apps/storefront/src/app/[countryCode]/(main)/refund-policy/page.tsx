import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Refund Policy | The Blissful Soul",
  description: "Our policies regarding refunds and returns.",
}

export default function RefundPolicyPage() {
  return (
    <div className="bg-white py-24 md:py-32">
      <div className="content-container max-w-3xl mx-auto px-4 md:px-0">
        <h1 className="text-4xl md:text-5xl font-serif text-pink-900 mb-12 uppercase tracking-tight">
          Refund Policy
        </h1>
        
        <div className="prose prose-pink max-w-none text-serif text-lg leading-relaxed text-pink-900/80 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4 font-serif italic">1. Refund Eligibility</h2>
            <p>
              We want you to be completely satisfied with your purchase. However, due to the spiritual and energetic nature of our crystals and services, we have specific criteria for refunds.
            </p>
            <p>
              <strong>Crystals & Products:</strong> To be eligible for a refund, crystals must be returned in their original condition and packaging within 7 days of receipt. Items that show signs of wear, alternation, or damage cannot be refunded.
            </p>
            <p>
              <strong>Services (Tarot, Astrology, Healing):</strong> Refunds for services are only available if the appointment is cancelled at least 24 hours in advance. Once a session has been conducted, no refunds will be issued as the divine energy and time have already been shared.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4 font-serif italic">2. Return Process</h2>
            <p>
              To initiate a return for a physical product, please contact our support team at <strong>theblissfulsoul27@gmail.com</strong> with your order number and reason for return.
            </p>
            <p>
              Once your return is received and inspected, we will send you an email to notify you that we have received your returned item and inform you of the approval or rejection of your refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4 font-serif italic">3. Timelines</h2>
            <p>
              If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 7-10 business days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4 font-serif italic">4. Shipping Costs</h2>
            <p>
              Shipping costs are non-refundable. If you receive a refund, the cost of initial shipping will be deducted from your refund. You will also be responsible for paying for your own shipping costs for returning your item.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
