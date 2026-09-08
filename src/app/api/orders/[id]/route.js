import { db } from "@/db";
import { orders, reservations } from "@/db/schema";
import { and, eq, or, sql } from "drizzle-orm";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const auth = await requireUser(request);
  if (auth.response) return auth.response;
  const { id } = await params;
  if (!id) return Response.json({ error: "Order not found" }, { status: 404 });

  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, id), eq(orders.userId, auth.user.id)))
    .limit(1);
  if (!order)
    return Response.json({ error: "Order not found" }, { status: 404 });

  const [expiredOrder] = await db
    .select({ id: orders.id })
    .from(orders)
    .where(
      and(
        eq(orders.id, id),
        sql`${orders.expiresAt} IS NOT NULL AND ${orders.expiresAt} <= now()`,
      ),
    )
    .limit(1);

  if (["pending", "payment_pending"].includes(order.status) && expiredOrder) {
    await db.transaction(async (tx) => {
      await tx.execute(sql`SELECT pg_advisory_xact_lock(987654321)`);
      await tx
        .update(reservations)
        .set({ status: "expired" })
        .where(
          and(eq(reservations.orderId, id), eq(reservations.status, "active")),
        );
      await tx
        .update(orders)
        .set({ status: "expired" })
        .where(
          and(
            eq(orders.id, id),
            or(
              eq(orders.status, "pending"),
              eq(orders.status, "payment_pending"),
            ),
          ),
        );
    });
    return Response.json({ orderId: id, status: "expired" });
  }

  return Response.json({
    orderId: order.id,
    status: order.status,
    amount: order.amount,
    currency: order.currency,
    expiresAt: order.expiresAt,
    paidAt: order.paidAt,
  });
}
