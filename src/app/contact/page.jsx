import LegalPage, { LegalSection } from "../../components/LegalPage";

export const metadata = { title: "Contact | Pixel Empire" };

export default function ContactPage() {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "";

  return (
    <LegalPage
      eyebrow="Pixel Empire / Support"
      title="Contact"
      intro="Questions about an account, reservation, payment, or territory can be sent to the configured Pixel Empire support address."
    >
      <LegalSection title="Support">
        {supportEmail ? (
          <p className="text-xl md:text-2xl">
            Email{" "}
            <a
              className="text-[#d2ff4d] underline decoration-[#d2ff4d]/40 underline-offset-4 hover:decoration-[#d2ff4d]"
              href={`mailto:${supportEmail}`}
            >
              {supportEmail}
            </a>
          </p>
        ) : (
          <p>Support email has not been configured for this deployment yet.</p>
        )}
        <p>
          For payment questions, include your order ID and payment-provider
          reference. Please do not send passwords or full payment-card details.
        </p>
      </LegalSection>
      <LegalSection title="About Pixel Empire">
        <p>
          Pixel Empire is a pre-launch digital platform for virtual rectangular
          territories on a 1000 x 1000 public canvas. It does not represent
          real-world property or a financial product.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
