import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Refund & Returns Policy | The Blissful Soul",
  description: "Comprehensive information about our 30-day refund and return policy for crystals, services, and other products.",
}

export default function RefundPolicyPage() {
  return (
    <div className="bg-[#FBFAF8] py-24 md:py-32 min-h-screen relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C5A059]/5 rounded-full blur-[100px] -mr-64 -mt-64"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#2C1E36]/5 rounded-full blur-[100px] -ml-64 -mb-64"></div>

      <div className="content-container max-w-4xl mx-auto px-4 md:px-0 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="mb-20 text-center md:text-left">
          <span className="text-[11px] text-[#C5A059] font-bold uppercase tracking-[0.5em] mb-4 block">Trust & Transparency</span>
          <h1 className="text-5xl md:text-6xl font-serif text-[#2C1E36] leading-[1.1] mb-6">
            Refund <span className="italic font-normal">&</span> <br className="hidden md:block" />
            Returns <span className="italic font-normal">Policy</span>
          </h1>
          <div className="w-24 h-0.5 bg-[#C5A059] mt-8 mx-auto md:mx-0"></div>
          <p className="mt-8 text-lg text-[#665D6B] font-sans max-w-2xl leading-relaxed">
            Our policy: <span className="font-bold text-[#2C1E36]">proper unpackaging video required for any claims</span>. If this is not provided, unfortunately, we cannot offer you a full refund or exchange.
          </p>
        </div>
        
        <div className="space-y-10">
          {/* Section 1: Eligibility */}
          <section className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-purple-900/5 border border-purple-50/50 group transition-all duration-500 hover:shadow-2xl hover:shadow-purple-900/10">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#C5A059]/10 text-[#C5A059] font-serif italic text-xl">01</span>
              </div>
              <div className="flex-grow">
                <h2 className="text-2xl font-serif text-[#2C1E36] mb-6">Eligibility for Returns</h2>
                <div className="prose prose-purple max-w-none font-sans text-[#665D6B] leading-relaxed space-y-4">
                  <p>
                    To be eligible for a return, your item must be <span className="text-[#2C1E36] font-medium">unused and in the same condition</span> that you received it. It must also be in the original packaging.
                  </p>
                  <p>
                    To complete your return, we require a receipt or proof of purchase. Please do not send your purchase back to the manufacturer.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Exemptions */}
          <section className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-purple-900/5 border border-purple-50/50 group transition-all duration-500 hover:shadow-2xl hover:shadow-purple-900/10">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#2C1E36]/10 text-[#2C1E36] font-serif italic text-xl">02</span>
              </div>
              <div className="flex-grow">
                <h2 className="text-2xl font-serif text-[#2C1E36] mb-6">Exempt Goods</h2>
                <div className="prose prose-purple max-w-none font-sans text-[#665D6B] leading-relaxed">
                  <p className="mb-4">Several types of goods are exempt from being returned:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {[
                      "Perishable goods (food, flowers, etc.)",
                      "Sanitary or intimate goods",
                      "Hazardous materials or flammable liquids",
                      "Gift cards",
                      "Downloadable software products",
                      "Health and personal care items"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></div>
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Partial Refunds */}
          <section className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-purple-900/5 border border-purple-50/50 group transition-all duration-500 hover:shadow-2xl hover:shadow-purple-900/10">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#C5A059]/10 text-[#C5A059] font-serif italic text-xl">03</span>
              </div>
              <div className="flex-grow">
                <h2 className="text-2xl font-serif text-[#2C1E36] mb-6">Partial Refunds</h2>
                <p className="text-[#665D6B] mb-6">There are certain situations where only partial refunds are granted:</p>
                <ul className="space-y-4 font-sans text-sm text-[#665D6B]">
                  <li className="flex gap-4">
                    <span className="text-[#C5A059]">•</span>
                    <span>Books with obvious signs of use.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-[#C5A059]">•</span>
                    <span>CD, DVD, VHS tape, software, video game, cassette tape, or vinyl record that has been opened.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-[#C5A059]">•</span>
                    <span>Any item not in its original condition, is damaged or missing parts for reasons not due to our error.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-[#C5A059]">•</span>
                    <span>Any item that is returned without a proper unpackaging video required for any claims.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4: Process */}
          <section className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-purple-900/5 border border-purple-50/50 group transition-all duration-500 hover:shadow-2xl hover:shadow-purple-900/10">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#2C1E36]/10 text-[#2C1E36] font-serif italic text-xl">04</span>
              </div>
              <div className="flex-grow">
                <h2 className="text-2xl font-serif text-[#2C1E36] mb-6">Refund Process</h2>
                <div className="prose prose-purple max-w-none font-sans text-[#665D6B] leading-relaxed space-y-4">
                  <p>
                    Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
                  </p>
                  <p>
                    If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within a certain amount of days.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Late Refunds */}
          <section className="bg-[#2C1E36] p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-purple-900/20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <h2 className="text-2xl font-serif text-white mb-8 relative z-10">Late or Missing Refunds</h2>
            <div className="space-y-6 relative z-10 font-sans text-white/80">
              <p>If you haven’t received a refund yet, follow these steps:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { step: "1", text: "Check your bank account again." },
                  { step: "2", text: "Contact your credit card company." },
                  { step: "3", text: "Contact your bank to check processing times." }
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <span className="text-[#C5A059] font-serif italic mb-4 block">Step {item.step}</span>
                    <p className="text-sm leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
              <p className="pt-4 text-center border-t border-white/10">
                Still haven't received it? Contact us at <strong className="text-white">tbspragya@gmail.com</strong>
              </p>
            </div>
          </section>

          {/* Section 6: Sale Items & Exchanges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <section className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-purple-900/5 border border-purple-50/50">
              <h3 className="text-xl font-serif text-[#2C1E36] mb-4">Sale Items</h3>
              <p className="text-[#665D6B] font-sans leading-relaxed">
                Only regular priced items may be refunded. Sale items cannot be refunded.
              </p>
            </section>
            <section className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-purple-900/5 border border-purple-50/50">
              <h3 className="text-xl font-serif text-[#2C1E36] mb-4">Exchanges</h3>
              <p className="text-[#665D6B] font-sans leading-relaxed">
                We only replace items if they are defective or damaged. If you need to exchange it for the same item, email us at <strong className="text-[#2C1E36]">tbspragya@gmail.com</strong>
              </p>
            </section>
          </div>

          {/* Section 7: Gifts */}
          <section className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-purple-900/5 border border-purple-50/50">
            <h2 className="text-2xl font-serif text-[#2C1E36] mb-6">Gifts</h2>
            <div className="prose prose-purple max-w-none font-sans text-[#665D6B] leading-relaxed space-y-4">
              <p>
                If the item was marked as a gift when purchased and shipped directly to you, you’ll receive a gift credit for the value of your return. Once the returned item is received, a gift certificate will be mailed to you.
              </p>
              <p>
                If the item wasn’t marked as a gift, or the gift giver had the order shipped to themselves, we will send a refund to the gift giver.
              </p>
            </div>
          </section>

          {/* Section 8: Shipping Returns */}
          <section className="bg-[#FBFAF8] p-8 md:p-12 rounded-[2.5rem] border-2 border-dashed border-[#C5A059]/30">
            <h2 className="text-2xl font-serif text-[#2C1E36] mb-6">Shipping Returns</h2>
            <div className="prose prose-purple max-w-none font-sans text-[#665D6B] leading-relaxed space-y-4">
              <p>
                To return your product, you should mail it to: <br />
                <span className="text-[#2C1E36] font-medium">The Blissful Soul, Shakti Nagar, Delhi 110007</span>
              </p>
              <p>
                You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.
              </p>
              <p className="text-sm italic">
                For expensive items, we recommend using a trackable shipping service or purchasing shipping insurance. We don’t guarantee that we will receive your returned item.
              </p>
            </div>
          </section>
        </div>

        {/* Footer CTA */}
        <div className="mt-20 text-center">
          <p className="text-[#665D6B] font-sans">
            Need help? Contact us at <a href="mailto:tbspragya@gmail.com" className="text-[#C5A059] font-bold hover:underline">tbspragya@gmail.com</a> for questions related to refunds and returns.
          </p>
        </div>
      </div>
    </div>
  )
}

