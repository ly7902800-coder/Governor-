import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { db, hashPassword, makeSession, sessionCookie } from "../../../../lib/server";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const displayName = typeof body.displayName === "string" ? body.displayName.trim().slice(0,80) : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    if (password.length < 10 || password.length > 128) return NextResponse.json({ error: "Use a password between 10 and 128 characters." }, { status: 400 });
    if (!process.env.DATABASE_URL || !process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) return NextResponse.json({ error: "Account service is not configured by the administrator." }, { status: 503 });
    const database = await db();
    const id = randomUUID();
    const result = await database.query("INSERT INTO governor_users (id,email,display_name,password_hash,provider,email_verified) VALUES ($1,$2,$3,$4,'email',FALSE) ON CONFLICT (email) DO NOTHING RETURNING id,email,display_name,provider,email_verified,created_at", [id,email,displayName || email.split("@")[0],await hashPassword(password)]);
    if (!result.rows[0]) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    const response = NextResponse.json({ user: result.rows[0], emailVerificationRequired: true });
    response.cookies.set(sessionCookie(makeSession(id)));
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not create account." }, { status: 503 });
  }
}