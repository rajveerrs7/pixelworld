import LegalPage, { LegalSection } from "../../components/LegalPage";

export const metadata = { title: "Terms & Conditions | Pixel Empire" };

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Pixel Empire / Terms"
      title="Terms & Conditions"
      intro="These terms describe the rules for using Pixel Empire, a pre-launch digital platform for purchasing virtual rectangular territories on a 1000 x 1000 digital canvas."
    >
      <LegalSection title="1. The service">
        <p>
          Pixel Empire provides an online public canvas containing 1,000,000
          digital pixels. Users may select and purchase available rectangular
          territories displayed on that canvas. A virtual territory is a digital
          record within Pixel Empire only. It is not real-world property, land,
          currency, or a financial asset.
        </p>
      </LegalSection>
      <LegalSection title="2. Accounts and responsibilities">
        <p>
          You must provide accurate account information, keep your login details
          secure, and use only your own account. You are responsible for
          activity performed through your account and for the content, website
          link, or owner name you submit for a territory. You must be old enough
          to enter a binding agreement in your jurisdiction.
        </p>
      </LegalSection>
      <LegalSection title="3. Territory purchase process">
        <p>
          You select an unowned rectangle within the 1000 x 1000 canvas, provide
          the requested territory details, and create a reservation. The
          displayed price is ₹1 per pixel. The total is calculated from the
          rectangle&apos;s width multiplied by its height, and the final amount
          and currency shown at checkout control the transaction.
        </p>
      </LegalSection>
      <LegalSection title="4. Reservation and payment">
        <p>
          A reservation holds a selected rectangle for 15 minutes while payment
          checkout is created. It expires automatically if payment is not
          completed and confirmed in time. Payment is processed by the
          third-party provider shown at checkout. Pixel Empire treats a purchase
          as complete only after successful payment confirmation is received and
          the territory is written to the public record.
        </p>
      </LegalSection>
      <LegalSection title="5. Ownership rules">
        <p>
          A completed purchase gives you the right to have the purchased digital
          territory recorded as yours in Pixel Empire for as long as the service
          maintains that record. This does not transfer real-world property
          rights, intellectual property rights in the platform, or any
          investment interest. Territories cannot overlap, and Pixel Empire does
          not currently provide a resale or transfer marketplace.
        </p>
      </LegalSection>
      <LegalSection title="6. Prohibited use">
        <p>
          You must not use the service for unlawful, fraudulent, abusive,
          defamatory, infringing, hateful, sexually explicit, or harmful
          content; malware, scams, impersonation, spam, or attempts to interfere
          with the canvas, accounts, payment process, or security. You must not
          submit content that you do not have the right to publish.
        </p>
      </LegalSection>
      <LegalSection title="7. Intellectual property">
        <p>
          Pixel Empire, its software, design, branding, and platform content
          belong to their respective owners. You retain rights in content you
          submit, but grant Pixel Empire permission to host, display, reproduce,
          and format that content as needed to operate and promote the platform.
          You are responsible for clearing rights in submitted content.
        </p>
      </LegalSection>
      <LegalSection title="8. Availability">
        <p>
          Pixel Empire is a new service and may be changed, paused, or
          unavailable during maintenance, development, provider outages, or
          events outside our control. We do not promise uninterrupted access or
          that a territory will remain visible forever.
        </p>
      </LegalSection>
      <LegalSection title="9. Limitation of liability">
        <p>
          To the extent permitted by law, Pixel Empire is not liable for
          indirect, incidental, special, consequential, or lost-profit losses
          arising from use of the service, loss of access, submitted content,
          payment-provider issues, or changes to the digital canvas. Nothing in
          these terms excludes liability that cannot legally be excluded.
        </p>
      </LegalSection>
      <LegalSection title="10. Suspension and termination">
        <p>
          We may suspend or terminate access, remove prohibited content, or
          cancel an affected territory where reasonably necessary for security,
          legal compliance, abuse prevention, or a breach of these terms. We may
          also discontinue the service. Any payment consequences will be handled
          under the Refund/Cancellation Policy.
        </p>
      </LegalSection>
      <LegalSection title="11. Changes to the service or terms">
        <p>
          We may update the service, pricing, features, and these terms as Pixel
          Empire develops. Updated terms will be posted on this page. Changes
          apply prospectively unless a different effective date is stated.
        </p>
      </LegalSection>
      <LegalSection title="12. Contact">
        <p>
          For questions about these terms, use the support email on our{" "}
          <a href="/contact">Contact page</a>. If no email is displayed there,
          support contact details have not yet been configured for this
          pre-launch service.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
