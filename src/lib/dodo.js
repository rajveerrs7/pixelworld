import DodoPayments from "dodopayments";
import { Webhook } from "standardwebhooks";

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function getDodoClient() {
  return new DodoPayments({
    bearerToken: getRequiredEnv("DODO_PAYMENTS_API_KEY"),
    environment: process.env.DODO_PAYMENTS_ENVIRONMENT || "test_mode",
  });
}

export async function createDodoCheckout({
  orderId,
  amount,
  currency,
  customerEmail,
}) {
  const client = getDodoClient();
  const productId = process.env.DODO_PRODUCT_ID;
  if (!productId) {
    throw new Error("DODO_PRODUCT_ID is not configured");
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resultUrl = `${appUrl}/payment/result?orderId=${encodeURIComponent(orderId)}`;

  const response = await client.checkoutSessions.create({
    product_cart: [
      {
        product_id: productId,
        quantity: 1,
        amount,
      },
    ],
    currency,
    metadata: {
      orderId,
      amount: String(amount),
      currency,
    },
    return_url: resultUrl,
    cancel_url: resultUrl,
    customer: customerEmail
      ? {
          email: customerEmail,
          name: customerEmail.split("@")[0] || "Pixel Empire Customer",
        }
      : undefined,
  });

  const checkoutUrl = response.checkout_url;
  const providerPaymentId = response.session_id || response.payment_id;

  if (!checkoutUrl || !providerPaymentId) {
    throw new Error("Dodo response is missing checkout URL or session ID");
  }

  return { checkoutUrl, providerPaymentId };
}

export async function getDodoWebhookPayload() {
  return null;
}

export function verifyDodoSignature(rawBody, { id, timestamp, signature }) {
  const secret =
    process.env.DODO_PAYMENTS_WEBHOOK_SECRET || process.env.DODO_WEBHOOK_SECRET;
  if (!secret || !id || !timestamp || !signature) return false;

  const timestampNumber = Number(timestamp);
  if (
    !Number.isFinite(timestampNumber) ||
    Math.abs(Date.now() / 1000 - timestampNumber) > 300
  ) {
    return false;
  }

  try {
    const webhook = new Webhook(secret);
    webhook.verify(rawBody, {
      "webhook-id": String(id),
      "webhook-signature": String(signature),
      "webhook-timestamp": String(timestamp),
    });
    return true;
  } catch {
    return false;
  }
}

export function getDodoEventValue(event, keys) {
  const sources = [
    event,
    event?.data,
    event?.data?.object,
    event?.payload,
    event?.metadata,
    event?.data?.metadata,
    event?.data?.object?.metadata,
  ];

  for (const source of sources) {
    if (!source) continue;
    for (const key of keys) {
      if (source[key] !== undefined && source[key] !== null) return source[key];
      if (key.includes(".")) {
        const value = key.split(".").reduce((accumulator, part) => {
          if (!accumulator || accumulator[part] === undefined) return undefined;
          return accumulator[part];
        }, source);
        if (value !== undefined && value !== null) return value;
      }
    }
  }

  return null;
}
