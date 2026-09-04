import { Metadata } from "next"
import {
  BulletList,
  ContactDetails,
  CONTACT_EMAIL,
  DarkPolicySection,
  NumberedList,
  OutlinedPolicySection,
  PillGrid,
  PolicyFooterDates,
  PolicyHero,
  PolicyPageShell,
  PolicySection,
  SubHeading,
} from "@modules/legal/components/policy-page"

export const metadata: Metadata = {
  title: "Terms of Service | Pragya Vijh",
  description:
    "The Terms of Service governing your use of www.pragyavijh.com and the products, courses, consultations and spiritual services offered by Pragya Vijh.",
}

const EFFECTIVE_DATE = "1 January 2026"
const LAST_UPDATED = "1 January 2026"

export default function TermsPage() {
  return (
    <PolicyPageShell>
      <PolicyHero
        eyebrow="Foundations"
        title={
          <>
            Terms of <span className="italic font-normal">Service</span>
          </>
        }
        effectiveDate={EFFECTIVE_DATE}
        lastUpdated={LAST_UPDATED}
      >
        <p>
          Welcome to Pragya Vijh (&ldquo;Pragya Vijh&rdquo;, &ldquo;we&rdquo;,
          &ldquo;us&rdquo;, &ldquo;our&rdquo; or &ldquo;Company&rdquo;).
        </p>
        <p>
          These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your access
          to and use of{" "}
          <span className="text-[#2C1E36] font-medium">www.pragyavijh.com</span>{" "}
          (&ldquo;Website&rdquo;) and your purchase or use of any products,
          services, courses, consultations, readings, healing sessions, digital
          content or other offerings made available by Pragya Vijh through the
          Website or associated communication channels.
        </p>
        <p>
          By accessing the Website, creating an account, placing an order,
          booking a consultation, purchasing a course or product, or otherwise
          using our services, you acknowledge that you have read, understood and
          agreed to these Terms.
        </p>
        <p className="text-[#2C1E36] font-medium">
          If you do not agree with these Terms, please do not use the Website or
          purchase our products or services.
        </p>
        <p>
          These Terms should be read together with our Privacy Policy, which
          explains how we collect, use, store and process personal information.
        </p>
      </PolicyHero>

      <div className="space-y-10">
        <PolicySection number="01" title="About Pragya Vijh">
          <p>
            Pragya Vijh provides spiritual, wellness and guidance-oriented
            services and products, including:
          </p>
          <PillGrid
            items={[
              "Tarot readings and consultations",
              "Tarot courses and classes",
              "Numerology services",
              "Astrology-related services",
              "Reiki healing",
              "Crystal healing",
              "Spiritual consultations",
              "Crystals and other spiritual products",
              "Digital educational products and materials",
              "Online consultations and sessions",
            ]}
          />
          <p className="pt-2">
            Services may be provided online through platforms such as WhatsApp
            and Google Meet, or through such other communication methods as we
            may make available from time to time.
          </p>
        </PolicySection>

        <PolicySection number="02" title="Eligibility">
          <p>
            There is no general 18+ restriction for accessing the Website.
          </p>
          <p>
            However, certain services, products, courses or consultations may
            have specific eligibility requirements. Where applicable, those
            requirements will be communicated before purchase or participation.
          </p>
          <p>
            If a person under the applicable age of majority places an order or
            requests a service, the parent or legal guardian should review and
            accept these Terms and assume responsibility for the transaction
            where required by applicable law.
          </p>
        </PolicySection>

        <PolicySection number="03" title="Acceptance of Terms">
          <p>
            By using the Website or purchasing any product or service, you
            confirm that:
          </p>
          <NumberedList
            items={[
              "The information provided by you is accurate and complete.",
              "You are legally capable of entering into an agreement where required by applicable law.",
              "You will use the Website and our services only for lawful purposes.",
              "You will not misuse, reproduce, copy, distribute or commercially exploit our content without permission.",
              "You understand the nature and limitations of spiritual and guidance-based services offered by Pragya Vijh.",
            ]}
          />
        </PolicySection>

        <DarkPolicySection
          number="04"
          title="Spiritual, Tarot, Astrology, Numerology & Healing Disclaimer"
        >
          <p>
            Pragya Vijh provides spiritual, intuitive, educational and
            guidance-oriented services.
          </p>
          <p>
            Tarot readings, numerology, astrology-related guidance, Reiki,
            crystal healing and other spiritual consultations are intended for
            personal reflection, spiritual guidance, entertainment and general
            informational purposes.
          </p>
          <p className="text-white font-medium">
            They are not a substitute for professional advice.
          </p>
          <p>
            Nothing provided through our Website, consultations, readings,
            courses or healing services should be interpreted as:
          </p>
          <ul className="space-y-3 text-sm">
            {[
              "Medical advice",
              "Psychological or psychiatric advice",
              "Legal advice",
              "Financial or investment advice",
              "Tax advice",
              "Professional business advice",
              "Diagnosis or treatment of any medical or mental-health condition",
            ].map((item) => (
              <li key={item} className="flex gap-4">
                <span className="text-[#C5A059] flex-shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p>
            You should consult an appropriately qualified professional for
            medical, psychological, legal, financial or other professional
            matters.
          </p>

          <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#C5A059] pt-4">
            No Guaranteed Outcomes
          </h3>
          <p>
            No tarot reading, astrology reading, numerology reading, Reiki
            session, crystal healing session, spiritual consultation, course or
            other service guarantees a particular outcome.
          </p>
          <p>
            Any interpretation, prediction, insight or guidance provided is
            inherently subjective and may not correspond to future events or
            circumstances.
          </p>
          <p className="text-white font-medium">
            You acknowledge that your decisions, actions and their consequences
            remain your own responsibility.
          </p>
          <p>
            You should not make significant medical, legal, financial,
            relationship, career or other life decisions solely on the basis of a
            spiritual reading or consultation.
          </p>
        </DarkPolicySection>

        <PolicySection number="05" title="Personal Responsibility">
          <p>You voluntarily choose to use our services.</p>
          <p>
            You understand that spiritual practices and guidance may produce
            different experiences for different individuals.
          </p>
          <p>Pragya Vijh does not guarantee that any service will:</p>
          <BulletList
            items={[
              "produce a specific result;",
              "change another person’s behaviour;",
              "predict future events with certainty;",
              "restore or guarantee a relationship;",
              "guarantee employment or business success;",
              "guarantee financial gain;",
              "guarantee healing from an illness or medical condition; or",
              "produce any other specific personal, financial, professional or emotional outcome.",
            ]}
          />
        </PolicySection>

        <PolicySection number="06" title="Bookings & Consultations">
          <p>
            Appointments may be booked through the Website or through other
            authorised booking/payment channels.
          </p>
          <p>
            A booking is considered confirmed only after the required payment has
            been successfully received and the booking has been
            accepted/confirmed by Pragya Vijh.
          </p>
          <p>
            Customers are responsible for providing accurate contact details and
            any information reasonably required to conduct the consultation.
          </p>
          <p>
            Where a consultation requires information such as name, date of
            birth, time of birth, place of birth or personal background
            information, the customer is responsible for providing accurate
            information.
          </p>
        </PolicySection>

        <PolicySection number="07" title="Online Consultations">
          <p>
            Online consultations may be conducted through WhatsApp, Google Meet
            or another platform designated by Pragya Vijh.
          </p>
          <p>The customer is responsible for:</p>
          <BulletList
            items={[
              "having a suitable internet connection;",
              "providing a functioning phone number/email address;",
              "joining the session at the scheduled time;",
              "ensuring that the device and software required for the session are functional; and",
              "providing accurate information necessary for the consultation.",
            ]}
          />
          <p>
            Technical problems caused solely by the customer’s device, internet
            connection or circumstances may not entitle the customer to a refund.
          </p>
          <p>
            Where a genuine technical problem occurs on the part of Pragya Vijh,
            reasonable efforts will be made to reschedule the session.
          </p>
        </PolicySection>

        <PolicySection number="08" title="Cancellation & Refund Policy">
          <p className="text-[#2C1E36] font-medium">
            All purchases are non-refundable.
          </p>
          <p>
            Unless otherwise required by applicable law, payments made for
            consultations, tarot readings, courses, digital products, healing
            services, crystals and other products/services are non-refundable.
          </p>

          <SubHeading>Consultation Cancellation</SubHeading>
          <p>
            Once a consultation has been booked and payment has been made:
          </p>
          <BulletList
            items={[
              "cancellation by the customer is not permitted;",
              "no refund will be issued before the appointment;",
              "no refund will be issued once the appointment has commenced or been completed; and",
              "a customer failing to attend their appointment will be treated as a No-Show and will not be entitled to a refund.",
            ]}
          />

          <SubHeading>Rescheduling</SubHeading>
          <p>
            A customer may request rescheduling by informing Pragya Vijh{" "}
            <span className="text-[#2C1E36] font-medium">
              at least 3 hours before
            </span>{" "}
            the scheduled appointment.
          </p>
          <p>Rescheduling is:</p>
          <BulletList
            items={[
              "subject to availability;",
              "subject to the discretion of Pragya Vijh/the Master;",
              "not guaranteed; and",
              "not equivalent to a refund.",
            ]}
          />
          <p>
            Requests made less than 3 hours before the appointment may be treated
            as cancellations/no-shows and may not be eligible for rescheduling.
          </p>
        </PolicySection>

        <PolicySection number="09" title="No-Show Policy">
          <p>
            If a customer does not attend a scheduled consultation or is
            unavailable at the agreed appointment time, the appointment may be
            treated as a No-Show.
          </p>
          <p>No refund will be provided for a No-Show.</p>
          <p>
            Pragya Vijh may, at its sole discretion, offer a rescheduled
            appointment in exceptional circumstances, but no such accommodation
            is guaranteed.
          </p>
        </PolicySection>

        <PolicySection number="10" title="Courses & Digital Products">
          <p>
            Courses, classes, PDFs, recordings, educational material,
            downloadable content and other digital products are provided for
            educational and informational purposes.
          </p>
          <p>
            Once access to a digital product or course has been provided, the
            purchase is non-refundable unless otherwise required by applicable
            law.
          </p>
          <p>
            Course access, where applicable, is personal to the purchaser and may
            not be:
          </p>
          <BulletList
            items={[
              "shared;",
              "transferred;",
              "sold;",
              "sublicensed;",
              "reproduced;",
              "recorded for redistribution; or",
              "commercially exploited.",
            ]}
          />
          <p>
            Pragya Vijh reserves the right to suspend or terminate access if
            unauthorised sharing, copying or distribution is detected.
          </p>
        </PolicySection>

        <PolicySection number="11" title="Crystal & Physical Product Purchases">
          <p>
            Crystals and other physical spiritual products are sold{" "}
            <span className="text-[#2C1E36] font-medium">within India</span>.
          </p>
          <p>
            International shipping is currently not offered unless expressly
            agreed by Pragya Vijh.
          </p>
          <p>
            Orders are generally dispatched within{" "}
            <span className="text-[#2C1E36] font-medium">4 business days</span>{" "}
            after successful payment and order confirmation.
          </p>
          <p>
            Dispatch time does not necessarily constitute a guaranteed delivery
            date, as delivery may depend on the relevant courier or logistics
            provider.
          </p>
        </PolicySection>

        <PolicySection number="12" title="Damaged Crystal/Product Policy">
          <p>
            Customers must inspect their package immediately upon delivery.
          </p>
          <p>
            If a product arrives damaged, the customer must provide an{" "}
            <span className="text-[#2C1E36] font-medium">
              unpacking/unboxing video
            </span>{" "}
            clearly showing:
          </p>
          <NumberedList
            items={[
              "the unopened package;",
              "the condition of the package before opening;",
              "the opening of the package; and",
              "the damaged product.",
            ]}
          />
          <p>
            The unboxing video may be required before an exchange is processed.
          </p>
          <p>
            If the damage is verified and the claim is accepted, Pragya Vijh may
            provide an exchange/replacement in accordance with its applicable
            product policy.
          </p>
          <p>Claims without the required evidence may not be accepted.</p>
        </PolicySection>

        <PolicySection number="13" title="Lost Shipments">
          <p>
            If an order is confirmed as lost during transit, Pragya Vijh will
            make reasonable efforts to resolve the issue with the relevant
            logistics provider.
          </p>
          <p>
            Where a shipment is confirmed as lost, Pragya Vijh may resend the
            product to the customer.
          </p>
          <p>
            The customer must cooperate with reasonable requests for information
            required to investigate the shipment.
          </p>
        </PolicySection>

        <PolicySection number="14" title="No Returns for Crystals">
          <p>
            Crystals and physical spiritual products are not generally eligible
            for customer-initiated returns.
          </p>
          <p>
            An exchange may be considered where the product is demonstrably
            damaged in transit and the customer complies with the applicable
            evidence requirements, including the unboxing-video requirement.
          </p>
          <p className="text-sm italic">
            Nothing in this section is intended to exclude any mandatory rights
            or remedies available to a consumer under applicable law.
          </p>
        </PolicySection>

        <PolicySection number="15" title="Spiritual Nature of Crystals">
          <p>
            Crystals are offered as spiritual and wellness-oriented products.
          </p>
          <p>
            Any descriptions of spiritual, symbolic, energetic or traditional
            properties of crystals are provided for informational and spiritual
            purposes.
          </p>
          <p>
            Pragya Vijh does not guarantee that a crystal will produce a
            particular physical, medical, financial, emotional, relationship or
            other outcome.
          </p>
          <p>
            Crystals are not a substitute for medical treatment, professional
            healthcare, legal advice, financial advice or any other professional
            service.
          </p>
        </PolicySection>

        <PolicySection number="16" title="Payments">
          <p>
            Payments may be made through payment methods made available by Pragya
            Vijh, including:
          </p>
          <BulletList
            items={[
              "Razorpay;",
              "UPI;",
              "bank transfer; and",
              "other payment methods that may be introduced from time to time.",
            ]}
          />
          <p>
            Customers may be able to complete purchases either as registered
            users or as guests, depending on the functionality available on the
            Website.
          </p>
          <p>
            When making a payment, you confirm that the payment information
            provided by you is accurate and that you are authorised to use the
            selected payment method.
          </p>
          <p>
            Payment processing may be handled by third-party payment providers
            such as Razorpay. Such providers may have their own terms and privacy
            policies.
          </p>
          <p>
            Pragya Vijh does not store complete debit/credit card credentials
            unless expressly stated in the applicable payment process.
          </p>
        </PolicySection>

        <PolicySection number="17" title="Orders & Order Cancellation">
          <p>
            Pragya Vijh reserves the right to refuse, cancel or limit an order
            where reasonably necessary, including in circumstances involving:
          </p>
          <BulletList
            items={[
              "suspected fraud;",
              "unauthorised transactions;",
              "pricing or technical errors;",
              "incorrect product/service information;",
              "product unavailability;",
              "duplicate orders;",
              "payment failures; or",
              "circumstances beyond reasonable control.",
            ]}
          />
          <p>
            Where a payment has been received for an order that Pragya Vijh
            cancels, any refund will be handled in accordance with applicable law
            and the circumstances of the cancellation.
          </p>
        </PolicySection>

        <PolicySection number="18" title="Intellectual Property">
          <p>
            All original content available through www.pragyavijh.com belongs to
            Pragya Vijh or is used with appropriate permission.
          </p>
          <p>This includes, without limitation:</p>
          <PillGrid
            items={[
              "website content",
              "written material",
              "tarot interpretations",
              "tarot educational material",
              "courses",
              "PDFs",
              "e-books",
              "videos",
              "photographs",
              "graphics",
              "logos",
              "branding",
              "original designs",
              "social-media content",
              "educational material",
              "audio/video recordings",
              "other proprietary materials",
            ]}
          />
          <p className="pt-2">
            All such material is protected by applicable intellectual-property
            laws.
          </p>
        </PolicySection>

        <PolicySection number="19" title="Prohibited Copying & Commercial Use">
          <p>
            Customers may access purchased educational material only for their
            personal use and for the purpose for which it was provided.
          </p>
          <p>
            Without prior written permission from Pragya Vijh, customers must
            not:
          </p>
          <BulletList
            items={[
              "copy our courses;",
              "reproduce our PDFs;",
              "resell our educational material;",
              "upload our courses elsewhere;",
              "share paid course access;",
              "reproduce tarot material commercially;",
              "record consultations for redistribution;",
              "create derivative commercial products from our proprietary material;",
              "distribute our videos or recordings;",
              "use our branding or logo; or",
              "represent Pragya Vijh’s content as their own.",
            ]}
          />
          <p>
            Unauthorised copying, distribution or commercial exploitation may
            result in termination of access and/or appropriate legal action.
          </p>
        </PolicySection>

        <PolicySection number="20" title="Customer Reviews & Social Media">
          <p>
            Pragya Vijh may display genuine customer reviews or feedback for
            promotional or informational purposes.
          </p>
          <p>
            Where customer information is displayed publicly, Pragya Vijh intends
            to avoid unnecessarily revealing personally identifiable information.
          </p>
          <p>
            Customers should not submit confidential, sensitive or third-party
            personal information through reviews or public comments.
          </p>
          <p>
            Pragya Vijh may also maintain and publish its own social-media
            content, including content from official social-media accounts and
            other material lawfully available to it.
          </p>
          <p>
            Where identifiable customer content, photographs, messages or other
            personal material is proposed to be used for promotional purposes,
            appropriate permission/consent should be obtained where required by
            applicable law.
          </p>
        </PolicySection>

        <PolicySection number="21" title="Third-Party Services & Platforms">
          <p>
            The Website and services may use or interact with third-party
            platforms including:
          </p>
          <PillGrid
            items={[
              "Razorpay",
              "WhatsApp",
              "Interakt",
              "Meta/Facebook/Instagram",
              "Google Analytics",
              "Google Ads",
              "Google Meet",
              "Other technology, advertising, payment, communication or service providers",
            ]}
          />
          <p className="pt-2">
            Third-party platforms operate under their own terms, policies and
            privacy practices.
          </p>
          <p>
            Pragya Vijh is not responsible for independent changes,
            interruptions, security incidents or policies of third-party
            platforms outside our reasonable control.
          </p>
        </PolicySection>

        <PolicySection number="22" title="WhatsApp & Communications">
          <p>
            Pragya Vijh may communicate with customers through WhatsApp and
            Interakt for purposes including:
          </p>
          <BulletList
            items={[
              "booking confirmations;",
              "appointment reminders;",
              "customer support;",
              "order updates;",
              "payment/order notifications;",
              "service-related communication; and",
              "promotional offers and marketing communications.",
            ]}
          />
          <p>
            Customers are responsible for ensuring that the WhatsApp number
            provided to Pragya Vijh belongs to them or that they are authorised
            to use it.
          </p>
        </PolicySection>

        <PolicySection number="23" title="Advertising & Analytics">
          <p>
            The Website may use technologies including cookies and
            analytics/advertising tools such as:
          </p>
          <BulletList
            items={[
              "Google Analytics;",
              "Meta Pixel;",
              "Google Ads; and",
              "Meta advertising tools.",
            ]}
          />
          <p>
            These technologies may help us understand Website usage, measure
            advertising performance and provide or improve relevant marketing.
          </p>
          <p>
            Additional information about personal data, cookies and tracking
            technologies is provided in our Privacy Policy.
          </p>
        </PolicySection>

        <PolicySection number="24" title="Prohibited Uses">
          <p>You agree not to use the Website or our services:</p>
          <NumberedList
            items={[
              "For any unlawful purpose.",
              "To violate any applicable law or regulation.",
              "To impersonate Pragya Vijh or another person.",
              "To transmit spam or malicious communications.",
              "To interfere with the operation or security of the Website.",
              "To introduce viruses, malware or other harmful material.",
              "To attempt unauthorised access to our systems.",
              "To copy or scrape Website content for unauthorised purposes.",
              "To reproduce or commercially exploit our intellectual property.",
              "To abuse, threaten or harass Pragya Vijh, its representatives or other customers.",
              "To use our services for fraudulent or deceptive purposes.",
              "To misrepresent our services or claim to represent Pragya Vijh without authorisation.",
            ]}
          />
        </PolicySection>

        <PolicySection number="25" title="Website Availability">
          <p>
            We aim to keep the Website available and functional, but we do not
            guarantee that it will always be:
          </p>
          <BulletList
            items={[
              "available;",
              "uninterrupted;",
              "error-free;",
              "secure from every possible threat; or",
              "free of technical problems.",
            ]}
          />
          <p>
            Website functionality may be modified, suspended or discontinued from
            time to time for maintenance, upgrades, security reasons or
            circumstances beyond our reasonable control.
          </p>
        </PolicySection>

        <PolicySection number="26" title="Third-Party Links">
          <p>
            The Website may contain links to third-party websites, platforms or
            services.
          </p>
          <p>These third parties operate independently from Pragya Vijh.</p>
          <p>
            We do not control and are not responsible for the content,
            availability, privacy practices, security or terms of third-party
            websites.
          </p>
          <p>
            Customers should review the applicable policies of third-party
            websites before using them.
          </p>
        </PolicySection>

        <PolicySection number="27" title="Disclaimer of Warranties">
          <p>
            To the maximum extent permitted by applicable law, the Website and
            its content are provided on an &ldquo;as available&rdquo; basis.
          </p>
          <p>Pragya Vijh does not warrant that:</p>
          <BulletList
            items={[
              "the Website will always be uninterrupted;",
              "all information will always be complete or error-free;",
              "every service will produce a particular result;",
              "spiritual guidance will accurately predict future events; or",
              "the Website will always be free from technical defects.",
            ]}
          />
          <p className="text-sm italic">
            Nothing in these Terms excludes any warranty, right or remedy that
            cannot lawfully be excluded under applicable law.
          </p>
        </PolicySection>

        <PolicySection number="28" title="Limitation of Liability">
          <p>
            To the maximum extent permitted by applicable law, Pragya Vijh shall
            not be responsible for indirect, incidental, special or consequential
            losses arising from the use of the Website or services.
          </p>
          <p>
            Without limiting the spiritual-services disclaimer above, Pragya Vijh
            shall not be responsible for decisions, actions or consequences
            arising from a customer’s reliance on tarot readings, numerology,
            astrology, Reiki, crystal healing, spiritual consultations or other
            guidance-based services.
          </p>
          <p className="text-sm italic">
            Nothing in these Terms is intended to exclude or restrict liability
            that cannot lawfully be excluded or restricted under applicable law.
          </p>
        </PolicySection>

        <PolicySection number="29" title="Customer Responsibility">
          <p>You are responsible for:</p>
          <BulletList
            items={[
              "the accuracy of information provided by you;",
              "decisions made after receiving our services;",
              "maintaining the confidentiality of your account credentials;",
              "ensuring that you have appropriate authority to provide information relating to another person;",
              "complying with these Terms; and",
              "using our products and services responsibly.",
            ]}
          />
          <p>
            You should not provide confidential personal information belonging to
            another individual unless you have appropriate authority or
            permission to do so.
          </p>
        </PolicySection>

        <PolicySection number="30" title="Privacy">
          <p>
            Pragya Vijh may collect and process information necessary to provide
            Website functionality, process orders, conduct consultations,
            communicate with customers, provide courses/services, process
            payments, provide customer support, analyse Website usage and conduct
            marketing.
          </p>
          <p>
            This may include information such as name, email address,
            phone/WhatsApp number, date of birth, time of birth, place of birth,
            address, shipping information, billing information and information
            voluntarily provided during consultations.
          </p>
          <p>
            Our detailed practices concerning collection, use, storage,
            disclosure and protection of personal data are described in our
            Privacy Policy.
          </p>
          <p>
            The Privacy Policy forms part of the overall terms governing use of
            the Website.
          </p>
        </PolicySection>

        <PolicySection number="31" title="Changes to Services">
          <p>
            Pragya Vijh may modify, update, replace, suspend or discontinue any
            Website feature, product, course, service or offering at any time.
          </p>
          <p>
            Where appropriate, information concerning material changes will be
            updated on the Website.
          </p>
        </PolicySection>

        <PolicySection number="32" title="Amendments to These Terms">
          <p>Pragya Vijh may update these Terms from time to time.</p>
          <p>
            The revised version will be posted on the Website with an updated
            effective/last-updated date.
          </p>
          <p>
            Your continued use of the Website after revised Terms become
            effective constitutes acceptance of the revised Terms, to the extent
            permitted by applicable law.
          </p>
        </PolicySection>

        <PolicySection number="33" title="Severability">
          <p>
            If any provision of these Terms is determined to be invalid, unlawful
            or unenforceable, that provision shall be limited or removed to the
            minimum extent necessary, and the remaining provisions shall continue
            to remain effective.
          </p>
        </PolicySection>

        <PolicySection number="34" title="Waiver">
          <p>
            Failure by Pragya Vijh to enforce any provision of these Terms shall
            not constitute a waiver of the right to enforce that provision in the
            future.
          </p>
        </PolicySection>

        <OutlinedPolicySection number="35" title="Governing Law & Jurisdiction">
          <p>
            These Terms shall be governed by and interpreted in accordance with
            the laws of India.
          </p>
          <p>
            Subject to any mandatory jurisdiction or consumer rights available
            under applicable law, courts and competent authorities having
            jurisdiction in{" "}
            <span className="text-[#2C1E36] font-medium">
              New Delhi, Delhi, India
            </span>{" "}
            shall have jurisdiction over disputes arising in connection with these
            Terms or the Website.
          </p>
          <p className="text-sm italic">
            Nothing in this clause is intended to deprive a consumer of any
            mandatory statutory right to approach a competent consumer forum or
            authority where applicable law provides such a right.
          </p>
        </OutlinedPolicySection>

        <PolicySection number="36" title="Entire Agreement">
          <p>
            These Terms, together with the Privacy Policy and any additional
            terms specifically applicable to a particular product, service,
            course or promotion, constitute the agreement governing your use of
            the Website and purchase/use of our offerings.
          </p>
          <p>
            If there is a conflict between these Terms and a specific written
            term expressly provided for a particular product or service, the
            specific term may apply to that transaction to the extent permitted
            by applicable law.
          </p>
        </PolicySection>

        <DarkPolicySection number="37" title="Contact Us">
          <p className="mb-8">
            For questions, support requests or concerns relating to these Terms,
            please contact:
          </p>
          <ContactDetails dark />
        </DarkPolicySection>

        <PolicySection number="38" title="Promotions, Offers and Discounts">
          <p>
            From time to time, Pragya Vijh may offer promotions, discounts,
            special offers, campaigns or other promotional activities.
          </p>
          <p>Specific promotions may have additional terms and conditions.</p>
          <p>
            Where promotional terms conflict with these Terms, the specific terms
            applicable to that promotion will govern to the extent of the
            conflict.
          </p>
          <p>
            Promotional offers may be subject to availability, eligibility,
            validity periods and other conditions communicated at the time of the
            offer.
          </p>
        </PolicySection>

        <PolicySection number="39" title="Copyright Complaints">
          <p>We respect the intellectual property rights of others.</p>
          <p>
            If you believe that material available through our Service infringes
            your copyright or other intellectual-property rights, you may contact
            us at:{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-[#C5A059] font-bold hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
          <p>Your communication should identify:</p>
          <NumberedList
            items={[
              "The copyrighted work or other protected material;",
              "The location of the allegedly infringing material;",
              "Your contact information;",
              "The basis of your claim; and",
              "Any other information reasonably necessary for us to investigate the complaint.",
            ]}
          />
          <p>
            We may take appropriate action where a legitimate infringement claim
            is established.
          </p>
        </PolicySection>

        <PolicySection number="40" title="Feedback">
          <p>
            You may provide feedback, suggestions, ideas, complaints or
            recommendations concerning our Website, products or services.
          </p>
          <p>
            By submitting feedback, you acknowledge that Pragya Vijh may use such
            feedback to improve its services, Website or business.
          </p>
          <p>
            You should not submit confidential information or intellectual
            property belonging to another person through feedback.
          </p>
          <p>
            Nothing in this section transfers ownership of your legally protected
            intellectual property except to the extent necessary for us to use
            the feedback for the purpose for which it was submitted.
          </p>
        </PolicySection>

        <PolicySection number="41" title="Termination and Suspension">
          <p>
            Pragya Vijh may suspend or terminate access to the Service where
            reasonably necessary, including where a user:
          </p>
          <BulletList
            items={[
              "Violates these Terms;",
              "Engages in fraudulent conduct;",
              "Attempts to compromise the Website;",
              "Misuses our intellectual property;",
              "Harasses or threatens our team;",
              "Shares or distributes paid content without authorisation; or",
              "Engages in unlawful activity.",
            ]}
          />
          <p>
            Where appropriate, access may be suspended or terminated without
            prior notice.
          </p>
          <p>
            Termination does not affect provisions that are intended to survive
            termination, including intellectual-property rights, disclaimers,
            limitations of liability and applicable dispute provisions.
          </p>
        </PolicySection>
      </div>

      {/* Acknowledgement */}
      <div className="mt-10 bg-[#C5A059]/10 border border-[#C5A059]/30 p-8 md:p-10 rounded-[2.5rem]">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#C5A059] mb-4">
          Acknowledgement
        </h3>
        <p className="font-sans text-[#2C1E36] leading-relaxed">
          By accessing www.pragyavijh.com, booking a service, purchasing a
          product, enrolling in a course or otherwise using our services, you
          acknowledge that you have read and understood these Terms &amp;
          Conditions and agree to be bound by them, subject to applicable law.
        </p>
      </div>

      <PolicyFooterDates
        effectiveDate={EFFECTIVE_DATE}
        lastUpdated={LAST_UPDATED}
      />
    </PolicyPageShell>
  )
}
