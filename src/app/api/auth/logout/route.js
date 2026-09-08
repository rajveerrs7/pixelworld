import { clearSessionCookie, revokeSession, requireSameOrigin } from "@/lib/auth";
export async function POST(request) { const originError = requireSameOrigin(request); if (originError) return originError; await revokeSession(request); return clearSessionCookie(Response.json({ ok: true })); }
