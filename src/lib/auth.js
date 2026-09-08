import crypto from "node:crypto";
import { promisify } from "node:util";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";
const scrypt = promisify(crypto.scrypt);
const COOKIE = "pixel_empire_session";
const MAX_AGE = 60 * 60 * 24 * 30;
const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");
export async function hashPassword(password) { const salt = crypto.randomBytes(16).toString("hex"); const value = await scrypt(password, salt, 64); return ["scrypt", salt, Buffer.from(value).toString("hex")].join(":"); }
export async function verifyPassword(password, stored) { const [scheme, salt, expectedHex] = String(stored || "").split(":"); if (scheme !== "scrypt" || !salt || !expectedHex) return false; const value = await scrypt(password, salt, 64); const expected = Buffer.from(expectedHex, "hex"); return expected.length === value.length && crypto.timingSafeEqual(expected, value); }
export async function createSession(userId) { const token = crypto.randomBytes(32).toString("base64url"); await db.insert(sessions).values({ id: crypto.randomUUID(), userId, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + MAX_AGE * 1000) }); return token; }
export function setSessionCookie(response, token) { const secure = process.env.NODE_ENV === "production" ? "; Secure" : ""; response.headers.append("Set-Cookie", COOKIE + "=" + encodeURIComponent(token) + "; Path=/; HttpOnly; SameSite=Lax; Max-Age=" + MAX_AGE + secure); return response; }
export function clearSessionCookie(response) { const secure = process.env.NODE_ENV === "production" ? "; Secure" : ""; response.headers.append("Set-Cookie", COOKIE + "=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0" + secure); return response; }
export async function getAuthenticatedUser(request) { const token = Object.fromEntries((request.headers.get("cookie") || "").split(";").map((x) => x.trim().split("=")).filter(([k, v]) => k && v))[COOKIE]; if (!token) return null; const [row] = await db.select({ user: users }).from(sessions).innerJoin(users, eq(sessions.userId, users.id)).where(and(eq(sessions.tokenHash, hashToken(token)), gt(sessions.expiresAt, new Date()))).limit(1); return row?.user || null; }
export async function revokeSession(request) { const token = Object.fromEntries((request.headers.get("cookie") || "").split(";").map((x) => x.trim().split("=")).filter(([k, v]) => k && v))[COOKIE]; if (token) await db.delete(sessions).where(eq(sessions.tokenHash, hashToken(token))); }

export function requireSameOrigin(request) { const origin = request.headers.get("origin"); if (!origin) return null; try { const configured = process.env.NEXT_PUBLIC_APP_URL; const expected = configured && !configured.includes("your-domain.example") ? new URL(configured).origin : ((process.env.NODE_ENV === "production" ? "https" : "http") + "://" + request.headers.get("host")); if (origin !== expected) return Response.json({ error: "Invalid request origin" }, { status: 403 }); } catch { return Response.json({ error: "Invalid request origin" }, { status: 403 }); } return null; }

export async function requireUser(request) { const user = await getAuthenticatedUser(request); return user ? { user, response: null } : { user: null, response: Response.json({ error: "Authentication required" }, { status: 401 }) }; }
