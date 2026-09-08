import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword, createSession, setSessionCookie, requireSameOrigin } from "@/lib/auth";
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
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return Response.json(
        { error: "A valid email is required" },
        { status: 400 },
      );
    if (password.length < 12 || password.length > 200)
      return Response.json(
        { error: "Password must be 12-200 characters" },
        { status: 400 },
      );
    if (name.length > 100)
      return Response.json(
        { error: "Name must be 100 characters or fewer" },
        { status: 400 },
      );
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (existing)
      return Response.json(
        { error: "An account with that email already exists" },
        { status: 409 },
      );
    const id = crypto.randomUUID();
    await db
      .insert(users)
      .values({
        id,
        email,
        name: name || null,
        passwordHash: await hashPassword(password),
      });
    return setSessionCookie(
      Response.json({ ok: true }),
      await createSession(id),
    );
  } catch (error) {
    console.error("Signup failed:", error);
    return Response.json(
      { error: "Authentication service is unavailable" },
      { status: 503 },
    );
  }
}
