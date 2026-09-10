import LegalPage, { LegalSection } from "../../components/LegalPage";

export const metadata = { title: "Privacy Policy | Pixel Empire" };

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Pixel Empire / Privacy"
      title="Privacy Policy"
      intro="This policy explains what Pixel Empire collects and how it is used while the platform is developed and operated."
    >
      <LegalSection title="1. Information we collect">
        <p>
          We collect the email address, name, and password-related account
          information you provide when you create an account. We collect
          territory selections and submitted owner name, website, and
          description. Passwords are stored as password hashes rather than
          readable passwords.
        </p>
        <p>
          When you reserve or purchase a territory, we collect order, amount,
          currency, reservation status, payment status, provider reference,
          timestamps, and the rectangle coordinates and dimensions. The payment
          provider handles payment details; Pixel Empire does not ask for or
          store full card details.
        </p>
        <p>
          We may receive technical information such as IP address, browser and
          device information, request logs, error logs, and information needed
          to protect the service. Pixel Empire uses authentication cookies for
          signed-in sessions. We do not claim to use advertising cookies.
        </p>
      </LegalSection>
      <LegalSection title="2. How we use information">
        <p>
          We use information to create and secure accounts, authenticate users,
          reserve and record territories, calculate orders, process and
          reconcile payments, prevent fraud and abuse, provide support,
          troubleshoot errors, and operate and improve the service.
        </p>
      </LegalSection>
      <LegalSection title="3. Payment processing and third parties">
        <p>
          Checkout is provided through Dodo Payments, a third-party payment
          service. Payment information is submitted directly to that provider
          under its own terms and privacy policy. We receive payment status,
          transaction references, amount, currency, and other information needed
          to confirm an order. We also use hosting, database, and infrastructure
          providers to run Pixel Empire. Those providers process data only as
          needed to provide their services.
        </p>
      </LegalSection>
      <LegalSection title="4. Retention">
        <p>
          We retain account, order, reservation, payment, and territory records
          for as long as reasonably needed to operate the platform, maintain the
          public digital record, resolve disputes, prevent abuse, and meet
          applicable record-keeping needs. We remove or anonymize information
          when it is no longer needed, subject to backups and operational
          requirements.
        </p>
      </LegalSection>
      <LegalSection title="5. Security">
        <p>
          We use reasonable technical and organizational measures, including
          password hashing, session controls, access controls, and
          payment-provider tokenization. No online service can guarantee
          absolute security.
        </p>
      </LegalSection>
      <LegalSection title="6. Your choices and rights">
        <p>
          Depending on where you live, you may have rights to access, correct,
          delete, or restrict use of personal information, or to object to
          certain processing. Contact us to make a request. We may need to
          verify your identity and may retain information where necessary for
          security, legal, or transaction-record reasons.
        </p>
      </LegalSection>
      <LegalSection title="7. Contact and updates">
        <p>
          For privacy questions or requests, use the email shown on our{" "}
          <a href="/contact">Contact page</a>. We may update this policy as the
          product changes and will post the revised version here. This policy
          does not claim any legal certification or compliance status.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
