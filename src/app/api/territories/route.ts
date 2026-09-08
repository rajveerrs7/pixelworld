import { db } from "@/db";
import { territories } from "@/db/schema";
import { asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await db
      .select()
      .from(territories)
      .orderBy(asc(territories.id));

    return Response.json({
      territories: data,
    });
  } catch (error) {
    console.error("Failed to fetch territories:", error);

    return Response.json(
      { error: "Failed to fetch territories" },
      { status: 500 },
    );
  }
}
