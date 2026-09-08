import { db } from "@/db";
import { orders, payments, reservations } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { createXflowCheckout } from "@/lib/xflow";
import { CURRENCY } from "@/lib/pricing";
import { requireUser, requireSameOrigin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const originError = requireSameOrigin(request);
    if (originError) return originError;
    const auth = await requireUser(request);
    if (auth.response) return auth.response;
    const user = auth.user;
    const { orderId } = await request.json();
    if (typeof orderId !== "string" || !orderId) {
      return Response.json({ error: "orderId is required" }, { status: 400 });
    }

    const [order] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.userId, user.id)))
      .limit(1);
    if (!order)
      return Response.json({ error: "Order not found" }, { status: 404 });
    if (order.currency !== CURRENCY) {
      return Response.json(
        {
          error:
            "Order currency is no longer supported; create a new reservation",
        },
        { status: 409 },
      );
    }

    const [reservation] = await db
      .select()
      .from(reservations)
      .where(eq(reservations.orderId, orderId))
      .limit(1);
    if (!reservation) {
      return Response.json({ error: "Reservation not found" }, { status: 404 });
    }

    const [expiredReservation] = await db
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
      return Response.json(
        { error: "Reservation has expired" },
        { status: 409 },
      );
    }
    if (!["pending", "payment_pending"].includes(order.status)) {
      return Response.json({ error: "Order is not payable" }, { status: 409 });
    }

    const { paymentId } = await db.transaction(async (tx) => {
      await tx.execute(sql`SELECT pg_advisory_xact_lock(987654321)`);
      const [existingPayment] = await tx
        .select()
        .from(payments)
        .where(eq(payments.orderId, orderId))
        .limit(1);
      if (
        existingPayment?.providerPaymentId ||
        existingPayment?.status === "processing"
      ) {
        throw new Error("CHECKOUT_ALREADY_CREATED");
      }

      const paymentId = existingPayment?.id || crypto.randomUUID();
      if (!existingPayment) {
        await tx.insert(payments).values({
          id: paymentId,
          orderId,
          amount: order.amount,
          currency: order.currency,
          status: "processing",
        });
      } else {
        await tx
          .update(payments)
          .set({ status: "processing", updatedAt: new Date() })
          .where(eq(payments.id, existingPayment.id));
      }
      return { paymentId };
    });
    let checkout;
    try {
      checkout = await createXflowCheckout({
        orderId,
        amount: order.amount,
        currency: order.currency,
      });
    } catch (error) {
      await db
        .update(payments)
        .set({ status: "failed", updatedAt: new Date() })
        .where(eq(payments.id, paymentId));
      throw error;
    }

    await db.transaction(async (tx) => {
      await tx.execute(sql`SELECT pg_advisory_xact_lock(987654321)`);
      await tx
        .update(orders)
        .set({ status: "payment_pending" })
        .where(and(eq(orders.id, orderId), eq(orders.status, "pending")));
      await tx
        .update(payments)
        .set({
          providerPaymentId: checkout.providerPaymentId,
          status: "processing",
          updatedAt: new Date(),
        })
        .where(eq(payments.id, paymentId));
    });

    return Response.json({
      checkoutUrl: checkout.checkoutUrl,
      orderId,
    });
  } catch (error) {
    if (error?.message === "CHECKOUT_ALREADY_CREATED") {
      return Response.json(
        { error: "Checkout has already been created" },
        { status: 409 },
      );
    }
    console.error("Checkout creation failed:", error);
    return Response.json({ error: "Failed to create checkout" }, { status: 503 });
  }
}
