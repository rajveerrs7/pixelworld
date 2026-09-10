import { db } from "@/db";
import { orders, payments, reservations, territories } from "@/db/schema";
import { and, eq, or, sql } from "drizzle-orm";
import { getDodoEventValue, verifyDodoSignature } from "@/lib/dodo";
import { deleteTerritoriesCache } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const rawBody = await request.text();
  const signature = request.headers.get("webhook-signature");
  if (
    !verifyDodoSignature(rawBody, {
      id: request.headers.get("webhook-id"),
      timestamp: request.headers.get("webhook-timestamp"),
      signature,
    })
  ) {
    return Response.json(
      { error: "Invalid webhook signature" },
      { status: 401 },
    );
  }

  try {
    const event = JSON.parse(rawBody);
    const eventType = String(
      getDodoEventValue(event, ["type"]) || "",
    ).toLowerCase();
    if (eventType !== "payment.succeeded") {
      return Response.json(
        { error: "Unsupported payment event" },
        { status: 400 },
      );
    }

    const paymentId = getDodoEventValue(event, [
      "payment_id",
      "paymentId",
      "checkout_session_id",
      "checkoutSessionId",
      "id",
    ]);
    const orderId =
      getDodoEventValue(event, [
        "orderId",
        "order_id",
        "metadata.orderId",
        "metadata.order_id",
      ]) || null;
    const amount = getDodoEventValue(event, [
      "total_amount",
      "amount",
      "value",
    ]);
    const currency = String(
      getDodoEventValue(event, ["currency", "currency_code"]) || "",
    ).toUpperCase();

    if (!orderId && !paymentId) {
      return Response.json(
        { error: "Unsupported payment event" },
        { status: 400 },
      );
    }

    const result = await db.transaction(async (tx) => {
      await tx.execute(sql`SELECT pg_advisory_xact_lock(987654321)`);

      let paymentQuery = tx
        .select()
        .from(payments)
        .where(eq(payments.provider, "dodo"));

      if (orderId) {
        paymentQuery = paymentQuery.where(
          or(
            eq(payments.orderId, orderId),
            eq(payments.providerPaymentId, paymentId || ""),
          ),
        );
      } else {
        paymentQuery = paymentQuery.where(
          eq(payments.providerPaymentId, paymentId),
        );
      }

      const [payment] = await paymentQuery.limit(1);
      if (!payment) throw new Error("PAYMENT_RECORD_NOT_FOUND");

      const [order] = await tx
        .select()
        .from(orders)
        .where(eq(orders.id, payment.orderId))
        .limit(1);
      if (!order) throw new Error("ORDER_NOT_FOUND");
      if (order.status === "paid") return { alreadyProcessed: true };
      if (!order.userId) throw new Error("ORDER_OWNER_MISSING");

      const normalizedAmount = Number(amount);
      const directPaymentMatches =
        Number.isFinite(normalizedAmount) &&
        normalizedAmount === order.amount &&
        currency === order.currency;
      const paymentMismatch = !directPaymentMatches;
      if (paymentMismatch) {
        throw new Error("PAYMENT_MISMATCH");
      }

      const [reservation] = await tx
        .select()
        .from(reservations)
        .where(eq(reservations.orderId, order.id))
        .limit(1);
      if (!reservation) throw new Error("PAYMENT_RECORD_NOT_FOUND");
      if (payment.status !== "processing")
        throw new Error("PAYMENT_NOT_PENDING");

      const [expiredReservation] = await tx
        .select({ id: reservations.id })
        .from(reservations)
        .where(
          and(
            eq(reservations.id, reservation.id),
            sql`${reservations.expiresAt} <= now()`,
          ),
        )
        .limit(1);
      if (reservation.status !== "active" || expiredReservation) {
        await tx
          .update(reservations)
          .set({ status: "expired" })
          .where(eq(reservations.id, reservation.id));
        await tx
          .update(orders)
          .set({ status: "expired" })
          .where(eq(orders.id, order.id));
        throw new Error("RESERVATION_EXPIRED");
      }

      const conflict = await tx
        .select({ id: territories.id })
        .from(territories)
        .where(
          and(
            sql`${territories.x} < ${reservation.x + reservation.width}`,
            sql`${territories.x} + ${territories.width} > ${reservation.x}`,
            sql`${territories.y} < ${reservation.y + reservation.height}`,
            sql`${territories.y} + ${territories.height} > ${reservation.y}`,
          ),
        )
        .limit(1);
      if (conflict.length) throw new Error("TERRITORY_OCCUPIED");

      await tx.insert(territories).values({
        id: `territory-${order.id}`,
        ownerId: order.userId,
        owner: reservation.owner || "Pixel Empire User",
        website: reservation.website,
        description: reservation.description || "Purchased territory",
        x: reservation.x,
        y: reservation.y,
        width: reservation.width,
        height: reservation.height,
        purchasedAt: new Date(),
      });
      await tx
        .update(payments)
        .set({
          providerPaymentId: paymentId || payment.providerPaymentId,
          status: "succeeded",
          updatedAt: new Date(),
        })
        .where(eq(payments.id, payment.id));
      await tx
        .update(orders)
        .set({ status: "paid", paidAt: new Date() })
        .where(eq(orders.id, order.id));
      await tx
        .update(reservations)
        .set({ status: "completed" })
        .where(eq(reservations.id, reservation.id));
      return { alreadyProcessed: false };
    });

    if (!result.alreadyProcessed) {
      await deleteTerritoriesCache();
    }

    return Response.json({ received: true, ...result });
  } catch (error) {
    const messages = {
      ORDER_NOT_FOUND: ["Order not found", 404],
      PAYMENT_MISMATCH: ["Payment does not match order", 400],
      PAYMENT_RECORD_NOT_FOUND: ["Payment record not found", 404],
      PAYMENT_NOT_PENDING: ["Payment is not pending", 409],
      ORDER_OWNER_MISSING: ["Order owner is missing", 409],
      RESERVATION_EXPIRED: ["Reservation has expired", 409],
      TERRITORY_OCCUPIED: ["Territory is already owned", 409],
    };
    const [message, status] = messages[error?.message] || [
      "Webhook processing failed",
      500,
    ];
    if (status === 500) console.error("Dodo webhook failed:", error);
    return Response.json({ error: message }, { status });
  }
}
