import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { verifyPassword, createSession, setSessionCookie, requireSameOrigin } from "@/lib/auth";
export async function POST(request) {
  const originError = requireSameOrigin(request);
  if (originError) return originError;
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (!user || !(await verifyPassword(password, user.passwordHash)))
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    return setSessionCookie(
      Response.json({ ok: true }),
      await createSession(user.id),
    );
  } catch (error) {
    console.error("Login failed:", error);
    return Response.json(
      { error: "Authentication service is unavailable" },
      { status: 503 },
    );
  }
}
