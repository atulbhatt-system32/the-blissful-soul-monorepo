import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | The Blissful Soul",
  description: "How we protect and manage your personal data.",
}

export default function PrivacyPage() {
  return (
    <div className="bg-white py-24 md:py-32">
      <div className="content-container max-w-3xl mx-auto px-4 md:px-0">
        <h1 className="text-4xl md:text-5xl font-serif text-pink-900 mb-12 uppercase tracking-tight">
          Privacy Policy
        </h1>
        
        <div className="prose prose-pink max-w-none text-serif text-lg leading-relaxed text-pink-900/80 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4 font-serif italic">1. Information We Collect</h2>
            <p>
              When you visit the Site, we collect certain information about your device, your interaction with the Site, and information necessary to process your purchases. We may also collect additional information if you contact us for customer support.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4 font-serif italic">2. How We Use Your Personal Information</h2>
            <p>
              We use your personal information to provide our services to you, which includes: offering products for sale, processing payments, shipping and fulfillment of your order, and keeping you up to date on new products, services, and offers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4 font-serif italic">3. Sharing Personal Information</h2>
            <p>
              We share your Personal Information with service providers to help us provide our services and fulfill our contracts with you, as described above. For example: We use Medusa as our e-commerce platform and Strapi for content management.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-pink-900 mb-4 font-serif italic">4. Your Rights</h2>
            <p>
              You have the right to access the personal information we hold about you, to port it to a new service, and to ask that your personal information be corrected, updated, or erased. If you would like to exercise these rights, please contact us through the contact information above.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
