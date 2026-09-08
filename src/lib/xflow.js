import crypto from "node:crypto";
import { centsToMajorUnit } from "./pricing";

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

export async function createXflowCheckout({ orderId, amount, currency }) {
  const secretKey = getRequiredEnv("XFLOW_SECRET_KEY");
  const accountId = getRequiredEnv("XFLOW_ACCOUNT_ID");
  const apiBaseUrl =
    process.env.XFLOW_API_BASE_URL || "https://api.xflowpay.com";
  const headers = {
    Authorization: `Bearer ${secretKey}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const receivableResponse = await fetch(`${apiBaseUrl}/v1/receivables`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      account_id: accountId,
      amount_maximum_reconcilable: centsToMajorUnit(amount),
      currency,
      description: `Pixel Empire order ${orderId}`,
      metadata: { orderId },
    }),
  });
  const receivable = await receivableResponse.json().catch(() => null);
  if (!receivableResponse.ok || !receivable?.id) {
    throw new Error(receivable?.error || "Xflow receivable creation failed");
  }

  const paymentLinkResponse = await fetch(`${apiBaseUrl}/v1/payment_links`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      account_id: accountId,
      receivable_ids: [receivable.id],
      type: "receivable",
    }),
  });
  const paymentLink = await paymentLinkResponse.json().catch(() => null);
  if (!paymentLinkResponse.ok) {
    throw new Error(paymentLink?.error || "Xflow payment link creation failed");
  }

  const checkoutUrl = paymentLink?.link || paymentLink?.url;
  const providerPaymentId = paymentLink?.id;

  if (!checkoutUrl || !providerPaymentId) {
    throw new Error("Xflow response is missing checkout URL or session ID");
  }

  return { checkoutUrl, providerPaymentId };
}

export async function getXflowReceivable(receivableId) {
  const secretKey = getRequiredEnv("XFLOW_SECRET_KEY");
  const apiBaseUrl =
    process.env.XFLOW_API_BASE_URL || "https://api.xflowpay.com";
  const response = await fetch(
    `${apiBaseUrl}/v1/receivables/${encodeURIComponent(receivableId)}`,
    {
      headers: {
        Authorization: `Bearer ${secretKey}`,
        Accept: "application/json",
      },
    },
  );
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.id) {
    throw new Error(data?.error || "Xflow receivable lookup failed");
  }
  return data;
}

export function verifyXflowSignature(rawBody, { id, timestamp, signature }) {
  const secret = process.env.XFLOW_WEBHOOK_SECRET;
  if (!secret || !id || !timestamp || !signature) return false;

  const timestampNumber = Number(timestamp);
  if (
    !Number.isFinite(timestampNumber) ||
    Math.abs(Date.now() / 1000 - timestampNumber) > 300
  ) {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${id}.${timestamp}.${rawBody}`)
    .digest("base64");

  return signature.split(" ").some((value) => {
    const provided = value.replace(/^v\d+,/, "");
    const expectedBuffer = Buffer.from(expected, "utf8");
    const providedBuffer = Buffer.from(provided, "utf8");
    return (
      expectedBuffer.length === providedBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, providedBuffer)
    );
  });
}

export function getXflowEventValue(event, keys) {
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
    }
  }
  return null;
}
