export const RESERVATION_DURATION_MINUTES = 15;

export function getExpirationTime() {
  return new Date(Date.now() + RESERVATION_DURATION_MINUTES * 60 * 1000);
}
