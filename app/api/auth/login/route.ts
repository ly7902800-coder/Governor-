import { NextResponse } from "next/server";
import { db, makeSession, sessionCookie, verifyPassword } from "../../../../lib/server";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!email || !password) return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    if (!process.env.DATABASE_URL || !process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) return NextResponse.json({ error: "Account service is not configured by the administrator." }, { status: 503 });
    const database = await db();
    const result = await database.query("SELECT id,email,display_name,provider,email_verified,created_at,password_hash FROM governor_users WHERE email=$1 LIMIT 1", [email]);
    const user = result.rows[0];
    if (!user?.password_hash || !(await verifyPassword(password, user.password_hash))) return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
    delete user.password_hash;
    const response = NextResponse.json({ user });
    response.cookies.set(sessionCookie(makeSession(user.id)));
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Sign-in failed." }, { status: 503 });
  }
}