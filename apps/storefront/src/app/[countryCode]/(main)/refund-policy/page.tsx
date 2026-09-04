import { Metadata } from "next"
import {
  BulletList,
  ContactDetails,
  CONTACT_EMAIL,
  CONTACT_PHONE,
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
  title: "Refund & Return Policy | Pragya Vijh",
  description:
    "Our Refund & Return Policy covering tarot readings, spiritual consultations, courses, digital products, crystals, damaged shipments and exchanges.",
}

const EFFECTIVE_DATE = "1 January 2026"
const LAST_UPDATED = "1 January 2026"

export default function RefundPolicyPage() {
  return (
    <PolicyPageShell>
      <PolicyHero
        eyebrow="Trust & Transparency"
        title={
          <>
            Refund <span className="italic font-normal">&amp;</span>{" "}
            <br className="hidden md:block" />
            Return <span className="italic font-normal">Policy</span>
          </>
        }
        effectiveDate={EFFECTIVE_DATE}
        lastUpdated={LAST_UPDATED}
      >
        <p>
          At Pragya Vijh, we aim to provide our customers with quality spiritual
          services, products and educational content. Please read this Refund
          &amp; Return Policy carefully before making a purchase or booking a
          service.
        </p>
        <p>
          By making a purchase or booking a service through{" "}
          <span className="text-[#2C1E36] font-medium">www.pragyavijh.com</span>
          , you acknowledge and agree to the terms of this policy, subject to any
          rights available to you under applicable law.
        </p>
      </PolicyHero>

      <div className="space-y-10">
          <PolicySection number="01" title="General Refund Policy">
            <p>
              Unless otherwise required under applicable law, all purchases made
              through Pragya Vijh are{" "}
              <span className="text-[#2C1E36] font-medium">non-refundable</span>.
            </p>
            <p className="pt-2">This includes:</p>
            <PillGrid
              items={[
                "Tarot readings",
                "Tarot consultations",
                "Spiritual consultations",
                "Numerology services",
                "Astrology-related services",
                "Reiki healing",
                "Crystal healing",
                "Tarot courses and classes",
                "Digital products",
                "PDFs, e-books and other downloadable materials",
                "Crystals and other physical spiritual products",
                "Any other service, product or package purchased through our Website",
              ]}
            />
            <p className="pt-2">
              Once payment has been successfully made and the booking, order or
              access has been confirmed, the purchase cannot ordinarily be
              cancelled for a refund.
            </p>
          </PolicySection>

          <PolicySection
            number="02"
            title="Tarot & Spiritual Consultation Bookings"
          >
            <p>
              All bookings for tarot readings, consultations, healing sessions
              and other scheduled services are non-refundable.
            </p>

            <SubHeading>Cancellation</SubHeading>
            <p>
              Customers cannot cancel a confirmed appointment in exchange for a
              refund.
            </p>
            <p>No refund will be provided:</p>
            <BulletList
              items={[
                "Before the scheduled appointment;",
                "After the appointment has started;",
                "After the appointment has been completed; or",
                "If the customer subsequently changes their mind about the service.",
              ]}
            />

            <SubHeading>No-Show</SubHeading>
            <p>
              If a customer fails to attend or join a scheduled consultation, the
              appointment will be treated as a No-Show.
            </p>
            <p>No refund will be provided for a No-Show.</p>
          </PolicySection>

          <PolicySection number="03" title="Rescheduling">
            <p>
              Although appointments are non-refundable, a customer may request to
              reschedule an appointment.
            </p>
            <p>
              A rescheduling request must be made{" "}
              <span className="text-[#2C1E36] font-medium">
                at least 3 hours before
              </span>{" "}
              the scheduled appointment time.
            </p>
            <p>Rescheduling is:</p>
            <BulletList
              items={[
                "Subject to availability;",
                "Subject to the discretion of Pragya Vijh/the Master;",
                "Not guaranteed; and",
                "Not an entitlement to a refund.",
              ]}
            />
            <p>
              Requests made less than 3 hours before the appointment may be
              treated as a cancellation or No-Show.
            </p>
            <p>
              Pragya Vijh may, at its discretion, make exceptions in genuine or
              exceptional circumstances.
            </p>
          </PolicySection>

          <PolicySection number="04" title="Courses & Digital Products">
            <p>
              All purchases of digital products, courses, classes, PDFs, e-books,
              recordings and other downloadable or electronically delivered
              content are non-refundable once access or delivery has been
              provided.
            </p>
            <p>This includes situations where a customer:</p>
            <BulletList
              items={[
                "Changes their mind;",
                "Does not complete the course;",
                "Does not use the purchased material;",
                "Does not attend a class;",
                "Decides that the course is not suitable for them; or",
                "No longer wishes to access the material.",
              ]}
            />
            <p>
              Course and digital-product access is personal to the purchaser and
              cannot be transferred, sold or shared with another person.
            </p>
            <p className="text-sm italic">
              Nothing in this section limits any mandatory rights available under
              applicable law.
            </p>
          </PolicySection>

          <PolicySection number="05" title="Crystal & Physical Product Returns">
            <p>
              Crystals and other physical spiritual products purchased from
              Pragya Vijh are not eligible for ordinary customer-initiated
              returns.
            </p>
            <p>We do not accept returns simply because:</p>
            <BulletList
              items={[
                "You changed your mind;",
                "You no longer want the product;",
                "The product is not what you expected spiritually;",
                "You selected the wrong product; or",
                "You no longer require the product.",
              ]}
            />
            <p>
              However, if a product arrives damaged during transit, an
              exchange/replacement may be considered in accordance with the
              procedure below.
            </p>
          </PolicySection>

          <PolicySection number="06" title="Damaged Products">
            <p>
              If your crystal or physical product arrives damaged, you must
              contact us as soon as reasonably possible after delivery.
            </p>
            <p>
              To be eligible for an exchange/replacement, you are required to
              provide a{" "}
              <span className="text-[#2C1E36] font-medium">
                clear and continuous unboxing video
              </span>{" "}
              showing:
            </p>
            <NumberedList
              items={[
                "The package before it is opened;",
                "The condition of the external packaging;",
                "The opening of the package; and",
                "The condition of the product immediately after opening.",
              ]}
            />
            <p>
              The unboxing video may be required to establish whether the damage
              occurred during transit.
            </p>
            <p>
              If the damage is verified and the claim is approved by Pragya Vijh,
              we may provide an exchange/replacement of the same or an equivalent
              product, subject to availability.
            </p>
            <p>
              Pragya Vijh reserves the right to reject a damage claim where
              sufficient evidence is not provided.
            </p>
          </PolicySection>

          <PolicySection number="07" title="Lost Shipments">
            <p>
              If an order is confirmed as lost during transit, Pragya Vijh will
              make reasonable efforts to investigate the shipment with the
              relevant logistics provider.
            </p>
            <p>
              Where a shipment is confirmed as lost, Pragya Vijh will generally
              resend the order at no additional product cost to the customer,
              subject to product availability.
            </p>
            <p>
              Customers may be required to provide information reasonably
              necessary for us to investigate the shipment.
            </p>
          </PolicySection>

        <DarkPolicySection number="08" title="Exchange Procedure">
          <p className="mb-8">
            If you believe that your product qualifies for an exchange because it
            arrived damaged:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                text: (
                  <>
                    Contact us at{" "}
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="text-white font-medium hover:underline"
                    >
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </>
                ),
              },
              {
                step: "2",
                text: <>Provide your order details/proof of purchase.</>,
              },
              {
                step: "3",
                text: (
                  <>
                    Provide the required unboxing video and photographs/videos of
                    the damaged product where requested.
                  </>
                ),
              },
              { step: "4", text: <>Our team will review the claim.</> },
              {
                step: "5",
                text: (
                  <>
                    If the claim is approved, we will communicate the
                    exchange/replacement process to you.
                  </>
                ),
              },
            ].map((item) => (
              <div
                key={item.step}
                className="p-6 bg-white/5 rounded-2xl border border-white/10"
              >
                <span className="text-[#C5A059] font-serif italic mb-4 block">
                  Step {item.step}
                </span>
                <p className="text-sm leading-relaxed text-white/80">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-8 pt-6 border-t border-white/10 text-sm">
            <span className="text-white font-medium">
              Do not send any product back to us
            </span>{" "}
            unless you have received instructions from Pragya Vijh.
          </p>
        </DarkPolicySection>

          <PolicySection number="09" title="Proof of Purchase">
            <p>
              For any order-related refund, return, replacement or exchange
              enquiry, we may require reasonable proof of purchase, such as:
            </p>
            <BulletList
              items={[
                "Order number;",
                "Payment confirmation;",
                "Invoice;",
                "Email confirmation;",
                "WhatsApp booking/order confirmation; or",
                "Other information reasonably establishing the purchase.",
              ]}
            />
          </PolicySection>

          <PolicySection number="10" title="Sale & Discounted Products">
            <p>
              Products or services purchased as part of a sale, promotional
              campaign, discount, special offer or other promotional pricing
              remain subject to this Refund &amp; Return Policy.
            </p>
            <p>
              Unless otherwise expressly stated in the relevant offer, sale and
              discounted purchases are non-refundable.
            </p>
            <p>
              Where an exchange is legally required or approved due to verified
              damage, the exchange will be handled in accordance with the
              applicable policy.
            </p>
          </PolicySection>

          <PolicySection number="11" title="Shipping Costs for Exchanges">
            <p>
              Where Pragya Vijh approves an exchange because a product was
              damaged during transit, we will communicate the applicable
              return/replacement shipping process to the customer.
            </p>
            <p>
              Customers should not independently ship products back to Pragya
              Vijh without prior instructions.
            </p>
            <p>
              For ordinary customer-requested returns, no return shipping
              arrangement will be provided because ordinary returns are not
              accepted.
            </p>
          </PolicySection>

          <PolicySection number="12" title="Refund Processing">
            <p>
              Where a refund is required or specifically approved by Pragya Vijh,
              it will generally be processed using the original payment method or
              another appropriate method available to us.
            </p>
            <p>
              The time taken for the refund to appear in the customer&rsquo;s
              account may depend on:
            </p>
            <BulletList
              items={[
                "The payment gateway;",
                "Bank processing times;",
                "Card issuer;",
                "UPI provider; or",
                "Other financial institution involved in the transaction.",
              ]}
            />
            <p>
              Pragya Vijh is not responsible for delays caused solely by a bank,
              payment gateway or financial institution after the refund has been
              initiated.
            </p>
          </PolicySection>

          <PolicySection number="13" title="Late or Missing Refunds">
            <p>
              If you have been specifically informed that a refund has been
              approved but have not received it, please:
            </p>
            <NumberedList
              items={[
                "Check your bank/payment account;",
                "Check with your card issuer or payment provider;",
                "Check with your bank or UPI provider; and",
                "Contact us if the refund still cannot be located.",
              ]}
            />
            <div className="pt-2 space-y-1 text-sm">
              <p>You may contact us at:</p>
              <p>
                Email:{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-[#C5A059] font-bold hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
              </p>
              <p>
                Phone/WhatsApp:{" "}
                <a
                  href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}
                  className="text-[#C5A059] font-bold hover:underline"
                >
                  {CONTACT_PHONE}
                </a>
              </p>
            </div>
            <p>
              Please provide your order/payment details so that we can
              investigate the matter.
            </p>
          </PolicySection>

          <PolicySection number="14" title="Gifts">
            <p>
              Where products are purchased as gifts, the same Refund &amp; Return
              Policy applies.
            </p>
            <p>
              A gift recipient does not automatically acquire a separate right to
              return or refund a product.
            </p>
            <p>
              Where an exchange is approved because of verified transit damage,
              the replacement process may be coordinated with the original
              purchaser or recipient as appropriate.
            </p>
          </PolicySection>

          <PolicySection
            number="15"
            title="Services Not Matching Personal Expectations"
          >
            <p>
              Because tarot, numerology, astrology, Reiki, crystal healing and
              spiritual consultations involve subjective interpretation and
              personal experience, dissatisfaction with an interpretation,
              prediction, guidance or perceived outcome does not ordinarily
              qualify for a refund.
            </p>
            <p>Examples include:</p>
            <BulletList
              items={[
                "A reading not providing the answer a customer expected;",
                "A prediction not occurring;",
                "A relationship outcome being different from a reading;",
                "A customer disagreeing with an interpretation;",
                "A spiritual experience being different from what the customer expected; or",
                "A customer not feeling that a session produced the desired result.",
              ]}
            />
            <p className="text-[#2C1E36] font-medium">
              No particular result is guaranteed from any Pragya Vijh service.
            </p>
          </PolicySection>

          <PolicySection
            number="16"
            title="Medical, Financial or Other Professional Outcomes"
          >
            <p>
              Refunds will not ordinarily be provided on the basis that a
              customer expected a tarot, spiritual, healing, numerology,
              astrology or crystal service to produce a specific medical,
              financial, legal, relationship or other professional outcome.
            </p>
            <p>
              Our services are intended for spiritual guidance, personal
              reflection and/or entertainment and are not substitutes for
              qualified professional advice.
            </p>
          </PolicySection>

          <PolicySection
            number="17"
            title="Fraudulent or Unauthorised Transactions"
          >
            <p>
              If you believe that a transaction was made without your
              authorisation, please contact us immediately.
            </p>
            <p>
              We may request information necessary to investigate the transaction
              and may cooperate with the relevant payment provider or financial
              institution.
            </p>
          </PolicySection>

        <OutlinedPolicySection number="18" title="Consumer Rights">
          <p>
            Nothing in this Refund &amp; Return Policy is intended to exclude,
            restrict or waive any consumer right, refund, replacement,
            cancellation remedy or other protection that cannot legally be
            excluded under applicable Indian law.
          </p>
          <p className="text-[#2C1E36] font-medium">
            Where applicable law provides a mandatory remedy that conflicts with
            this policy, the mandatory legal requirement will prevail.
          </p>
        </OutlinedPolicySection>

          <PolicySection number="19" title="Changes to This Policy">
            <p>
              Pragya Vijh may update this Refund &amp; Return Policy from time to
              time.
            </p>
            <p>
              The updated version will be published on www.pragyavijh.com and the
              &ldquo;Last Updated&rdquo; date will be amended accordingly.
            </p>
            <p>
              The policy applicable to a purchase will generally be the policy in
              effect at the time of that purchase, subject to applicable law.
            </p>
          </PolicySection>

        <DarkPolicySection number="20" title="Contact Us">
          <p className="mb-8">
            If you have questions regarding refunds, exchanges, damaged
            products, lost shipments or this policy, please contact:
          </p>
          <ContactDetails dark />
        </DarkPolicySection>
        </div>

        {/* Important notice */}
        <div className="mt-10 bg-[#C5A059]/10 border border-[#C5A059]/30 p-8 md:p-10 rounded-[2.5rem]">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#C5A059] mb-4">
            Important
          </h3>
          <p className="font-sans text-[#2C1E36] leading-relaxed">
            Please do not ship any product back to us without receiving prior
            instructions from Pragya Vijh.
          </p>
        </div>

      <PolicyFooterDates
        effectiveDate={EFFECTIVE_DATE}
        lastUpdated={LAST_UPDATED}
      />
    </PolicyPageShell>
  )
}
