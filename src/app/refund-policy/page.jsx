import LegalPage, { LegalSection } from "../../components/LegalPage";

export const metadata = {
  title: "Refund & Cancellation Policy | Pixel Empire",
};

export default function RefundPolicyPage() {
  return (
    <LegalPage
      eyebrow="Pixel Empire / Payments"
      title="Refund & Cancellation Policy"
      intro="This policy explains what happens to a territory reservation and payment during Pixel Empire's pre-launch purchase flow."
    >
      <LegalSection title="1. Reservations expire">
        <p>
          A selected rectangle is reserved for 15 minutes. If payment is not
          completed and confirmed before the reservation expires, the
          reservation and pending order are marked expired and the rectangle
          becomes available again. Starting checkout does not extend the
          reservation.
        </p>
      </LegalSection>
      <LegalSection title="2. Payment processing">
        <p>
          Payment is processed by Dodo Payments. Pixel Empire does not treat a
          payment as a completed purchase merely because a checkout page was
          opened or a payment attempt was started. A purchase becomes final only
          after the payment provider confirms the payment and Pixel Empire
          confirms the order while the reservation is still active.
        </p>
      </LegalSection>
      <LegalSection title="3. When a refund may be requested">
        <p>
          Because this is a new digital product, refund requests are reviewed
          case by case. You may contact support if you were charged but the
          territory was not recorded, if the same order was charged more than
          once, or if a payment-provider or technical error appears to have
          caused an incorrect charge. We do not promise a guaranteed refund
          period or create a refund entitlement beyond rights that apply under
          law.
        </p>
      </LegalSection>
      <LegalSection title="4. Duplicate, failed, or pending payments">
        <p>
          A failed checkout should not create a completed territory. If your
          bank or payment provider shows a pending or reversed authorization,
          allow the provider&apos;s normal processing time before treating it as
          a completed charge. For duplicate or incorrectly completed charges,
          send support the order details and payment references so we can
          investigate with the provider. Do not send full card numbers or
          passwords.
        </p>
      </LegalSection>
      <LegalSection title="5. How to contact support">
        <p>
          Contact us using the support email shown on the{" "}
          <a href="/contact">Contact page</a>. Include your account email, order
          ID, date and amount of the charge, and the relevant payment-provider
          reference. We will review the records and respond with the outcome
          available for that transaction.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
