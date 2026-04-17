import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How we protect and manage your personal data.",
}

export default function PrivacyPage() {
  return (
    <div className="bg-[#FBFAF8] py-24 md:py-32 min-h-screen relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2C1E36]/5 rounded-full blur-3xl -ml-48 -mb-48"></div>

      <div className="content-container max-w-3xl mx-auto px-4 md:px-0 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="mb-16">
          <span className="text-[10px] text-[#C5A059] font-bold uppercase tracking-[0.4em] mb-4 block">Privacy & Transparency</span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#2C1E36] uppercase tracking-tight leading-loose">
            Privacy <span className="italic font-normal">Policy</span>
          </h1>
          <div className="w-24 h-0.5 bg-[#C5A059] mt-6"></div>
        </div>
        
        <div className="prose prose-purple max-w-none font-sans text-base leading-relaxed text-[#665D6B] space-y-12">
          <section className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-purple-900/5 border border-purple-50/50">
            <h2 className="text-2xl font-bold text-[#2C1E36] mb-6 font-serif italic flex items-center gap-3">
              <span className="text-[#C5A059] not-italic text-sm font-sans tracking-widest">01.</span>
              Information We Collect
            </h2>
            <p>
              When you visit the Site, we collect certain information about your device, your interaction with the Site, and information necessary to process your purchases. We may also collect additional information if you contact us for customer support.
            </p>
          </section>

          <section className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-purple-900/5 border border-purple-50/50">
            <h2 className="text-2xl font-bold text-[#2C1E36] mb-6 font-serif italic flex items-center gap-3">
              <span className="text-[#C5A059] not-italic text-sm font-sans tracking-widest">02.</span>
              How We Use Your Personal Information
            </h2>
            <p>
              We use your personal information to provide our services to you, which includes: offering products for sale, processing payments, shipping and fulfillment of your order, and keeping you up to date on new products, services, and offers.
            </p>
          </section>

          <section className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-purple-900/5 border border-purple-50/50">
            <h2 className="text-2xl font-bold text-[#2C1E36] mb-6 font-serif italic flex items-center gap-3">
              <span className="text-[#C5A059] not-italic text-sm font-sans tracking-widest">03.</span>
              Sharing Personal Information
            </h2>
            <p>
              We share your Personal Information with service providers to help us provide our services and fulfill our contracts with you, as described above. For example: We use Medusa as our e-commerce platform and Strapi for content management.
            </p>
          </section>

          <section className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-purple-900/5 border border-purple-50/50">
            <h2 className="text-2xl font-bold text-[#2C1E36] mb-6 font-serif italic flex items-center gap-3">
              <span className="text-[#C5A059] not-italic text-sm font-sans tracking-widest">04.</span>
              Your Rights
            </h2>
            <p>
              You have the right to access the personal information we hold about you, to port it to a new service, and to ask that your personal information be corrected, updated, or erased. If you would like to exercise these rights, please contact us through the contact information above.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
