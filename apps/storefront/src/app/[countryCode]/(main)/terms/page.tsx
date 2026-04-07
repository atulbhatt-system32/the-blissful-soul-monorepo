import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | The Blissful Soul",
  description: "The terms and conditions for using our website and services.",
}

export default function TermsPage() {
  return (
    <div className="bg-[#FBFAF8] py-24 md:py-32 min-h-screen relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2C1E36]/5 rounded-full blur-3xl -ml-48 -mb-48"></div>

      <div className="content-container max-w-3xl mx-auto px-4 md:px-0 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="mb-16">
          <span className="text-[10px] text-[#C5A059] font-bold uppercase tracking-[0.4em] mb-4 block">Foundations</span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#2C1E36] uppercase tracking-tight leading-loose">
            Terms of <span className="italic font-normal">Service</span>
          </h1>
          <div className="w-24 h-0.5 bg-[#C5A059] mt-6"></div>
        </div>
        
        <div className="prose prose-purple max-w-none font-sans text-base leading-relaxed text-[#665D6B] space-y-12">
          <section className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-purple-900/5 border border-purple-50/50">
            <h2 className="text-2xl font-bold text-[#2C1E36] mb-6 font-serif italic flex items-center gap-3">
              <span className="text-[#C5A059] not-italic text-sm font-sans tracking-widest">01.</span>
              Overview
            </h2>
            <p>
              This website is operated by <strong className="text-[#2C1E36]">The Blissful Soul</strong>. Throughout the site, the terms “we”, “us” and “our” refer to The Blissful Soul. The Blissful Soul offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.
            </p>
          </section>

          <section className="px-8 md:px-12">
            <h2 className="text-2xl font-bold text-[#2C1E36] mb-6 font-serif italic flex items-center gap-3">
              <span className="text-[#C5A059] not-italic text-sm font-sans tracking-widest">02.</span>
              Online Store Terms
            </h2>
            <p>
              By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence. You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction.
            </p>
          </section>

          <section className="bg-[#2C1E36] p-8 md:p-12 rounded-[2.5rem] text-white shadow-2xl shadow-purple-900/20">
            <h2 className="text-2xl font-bold text-[#C5A059] mb-6 font-serif italic flex items-center gap-3">
              <span className="text-white/60 not-italic text-sm font-sans tracking-widest">03.</span>
              Spiritual Services Disclaimer
            </h2>
            <p className="text-white/90 leading-relaxed font-serif italic text-lg">
              "Our spiritual services, including tarot readings, astrology, and healing sessions, are for guidance purposes only."
            </p>
            <p className="mt-4 text-white/70 text-sm">
              They should not substitute for professional medical, legal, or financial advice. The Blissful Soul is not responsible for any actions taken by the client based on information received during a session.
            </p>
          </section>

          <section className="px-8 md:px-12">
            <h2 className="text-2xl font-bold text-[#2C1E36] mb-6 font-serif italic flex items-center gap-3">
              <span className="text-[#C5A059] not-italic text-sm font-sans tracking-widest">04.</span>
              Modifications to prices
            </h2>
            <p>
              Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
