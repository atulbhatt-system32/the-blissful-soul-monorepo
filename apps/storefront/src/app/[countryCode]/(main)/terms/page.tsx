import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | The Blissful Soul",
  description: "The terms and conditions for using our website and services.",
}

export default function TermsPage() {
  return (
    <div className="bg-white py-24 md:py-32">
      <div className="content-container max-w-3xl mx-auto px-4 md:px-0">
        <h1 className="text-4xl md:text-5xl font-serif text-pink-900 mb-12 uppercase tracking-tight">
          Terms of Service
        </h1>
        
        <div className="prose prose-pink max-w-none text-serif text-lg leading-relaxed text-pink-900/80 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4 font-serif italic">1. Overview</h2>
            <p>
              This website is operated by The Blissful Soul. Throughout the site, the terms “we”, “us” and “our” refer to The Blissful Soul. The Blissful Soul offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4 font-serif italic">2. Online Store Terms</h2>
            <p>
              By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence. You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4 font-serif italic">3. Spiritual Services Disclaimer</h2>
            <p>
              Our spiritual services, including tarot readings, astrology, and healing sessions, are for guidance purposes only. They should not substitute for professional medical, legal, or financial advice. The Blissful Soul is not responsible for any actions taken by the client based on information received during a session.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4 font-serif italic">4. Modifications to the Service and Prices</h2>
            <p>
              Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
