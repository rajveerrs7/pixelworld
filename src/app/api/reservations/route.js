import { db } from "@/db";
import { orders, reservations, territories } from "@/db/schema";
import { and, eq, or, sql } from "drizzle-orm";
import { getExpirationTime } from "@/lib/reservations";
import { calculatePriceCents } from "@/lib/pricing";
import { requireUser, requireSameOrigin } from "@/lib/auth";

const WORLD_SIZE = 1000;
const CURRENCY = "USD";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const originError = requireSameOrigin(request);
    if (originError) return originError;
    const auth = await requireUser(request);
    if (auth.response) return auth.response;
    const user = auth.user;
    const body = await request.json();

    const { x, y, width, height } = body;
    const owner = typeof body.owner === "string" ? body.owner.trim() : "";
    const website = typeof body.website === "string" ? body.website.trim() : "";
    const description =
      typeof body.description === "string" ? body.description.trim() : "";

    if (
      !Number.isInteger(x) ||
      !Number.isInteger(y) ||
      !Number.isInteger(width) ||
      !Number.isInteger(height)
    ) {
      return Response.json({ error: "Invalid rectangle" }, { status: 400 });
    }

    if (width <= 0 || height <= 0) {
      return Response.json({ error: "Invalid dimensions" }, { status: 400 });
    }

    if (!owner || owner.length > 100) {
      return Response.json(
        { error: "Owner name is required and must be 100 characters or fewer" },
        { status: 400 },
      );
    }
    if (website.length > 500 || description.length > 500) {
      return Response.json(
        { error: "Website and description must be 500 characters or fewer" },
        { status: 400 },
      );
    }

    if (x < 0 || y < 0 || x + width > WORLD_SIZE || y + height > WORLD_SIZE) {
      return Response.json(
        { error: "Rectangle is outside the world" },
        { status: 400 },
      );
    }

    const amount = calculatePriceCents(width, height);
    const expiresAt = getExpirationTime();

    const result = await db.transaction(async (tx) => {
      /*
       * Lock the reservation operation so two users cannot
       * reserve overlapping territory simultaneously.
       */
      await tx.execute(sql`SELECT pg_advisory_xact_lock(987654321)`);

      // Remove expired reservations.
      await tx
        .update(reservations)
        .set({ status: "expired" })
        .where(
          and(
            eq(reservations.status, "active"),
            sql`${reservations.expiresAt} <= now()`,
          ),
        );

      await tx
        .update(orders)
        .set({ status: "expired" })
        .where(
          and(
            or(
              eq(orders.status, "pending"),
              eq(orders.status, "payment_pending"),
            ),
            sql`${orders.expiresAt} <= now()`,
          ),
        );

      // Check overlap with owned territories.
      const ownedOverlap = await tx
        .select({ id: territories.id })
        .from(territories)
        .where(
          and(
            sql`${territories.x} < ${x + width}`,
            sql`${territories.x} + ${territories.width} > ${x}`,
            sql`${territories.y} < ${y + height}`,
            sql`${territories.y} + ${territories.height} > ${y}`,
          ),
        )
        .limit(1);

      if (ownedOverlap.length > 0) {
        throw new Error("TERRITORY_OCCUPIED");
      }

      // Check overlap with active reservations.
      const reservationOverlap = await tx
        .select({ id: reservations.id })
        .from(reservations)
        .where(
          and(
            eq(reservations.status, "active"),
            sql`${reservations.expiresAt} > now()`,
            sql`${reservations.x} < ${x + width}`,
            sql`${reservations.x} + ${reservations.width} > ${x}`,
            sql`${reservations.y} < ${y + height}`,
            sql`${reservations.y} + ${reservations.height} > ${y}`,
          ),
        )
        .limit(1);

      if (reservationOverlap.length > 0) {
        throw new Error("TERRITORY_RESERVED");
      }

      const orderId = crypto.randomUUID();
      const reservationId = crypto.randomUUID();

      await tx.insert(orders).values({
        id: orderId,
        status: "pending",
        userId: user.id,
        amount,
        currency: CURRENCY,
        expiresAt,
      });

      await tx.insert(reservations).values({
        id: reservationId,
        orderId,
        userId: user.id,
        x,
        y,
        width,
        height,
        amount,
        owner,
        website: website || null,
        description: description || null,
        status: "active",
        expiresAt,
      });

      return {
        orderId,
        reservationId,
        amount,
        expiresAt,
      };
    });

    return Response.json({
      success: true,
      ...result,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "TERRITORY_OCCUPIED") {
        return Response.json(
          { error: "Your selection overlaps an owned territory" },
          { status: 409 },
        );
      }

      if (error.message === "TERRITORY_RESERVED") {
        return Response.json(
          { error: "This territory is currently reserved" },
          { status: 409 },
        );
      }
    }

    console.error("Reservation failed:", error);

    return Response.json(
      { error: "Failed to create reservation" },
      { status: 500 },
    );
  }
}
