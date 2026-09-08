export const PRICE_PER_PIXEL_CENTS = 5;
export const CURRENCY = "USD";

export function calculatePriceCents(width, height) {
  return width * height * PRICE_PER_PIXEL_CENTS;
}

export function centsToMajorUnit(cents) {
  return (cents / 100).toFixed(2);
}

export function majorUnitToCents(amount) {
  const value = String(amount).trim();
  if (!/^\d+(\.\d{1,2})?$/.test(value)) return NaN;

  const [whole, fraction = ""] = value.split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}

export function formatUsd(cents) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: CURRENCY,
  }).format(cents / 100);
}
