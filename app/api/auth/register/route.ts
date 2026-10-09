import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { db, hashPassword, hashToken, randomId, sendPlatformEmail, escapeHtml } from "../../../../lib/server";
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
    if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) return NextResponse.json({ error: "Email verification is not configured. The administrator must configure RESEND_API_KEY and EMAIL_FROM before email registration." }, { status: 503 });
    const database = await db();
    const id = randomUUID();
    const result = await database.query("INSERT INTO governor_users (id,email,display_name,password_hash,provider,email_verified) VALUES ($1,$2,$3,$4,'email',FALSE) ON CONFLICT (email) DO NOTHING RETURNING id,email,display_name,provider,email_verified,created_at", [id,email,displayName || email.split("@")[0],await hashPassword(password)]);
    if (!result.rows[0]) return NextResponse.json({ error: "An account with this email already exists. Sign in or request a verification link." }, { status: 409 });
    const token = randomId();
    await database.query("INSERT INTO governor_email_tokens (id,user_id,token_hash,purpose,expires_at) VALUES ($1,$2,$3,'verify_email',NOW()+INTERVAL '24 hours')", [randomUUID(),id,hashToken(token)]);
    const base = process.env.APP_BASE_URL || new URL(request.url).origin;
    const link = base + "/api/auth/verify?token=" + encodeURIComponent(token);
    try {
      await sendPlatformEmail(email,"Verify your Governor Studio email",'<p>Welcome to Governor Studio.</p><p>Confirm your email address by opening this link (valid for 24 hours):</p><p><a href="' + link + '">Verify email</a></p><p>If you did not request this account, ignore this message.</p>');
    } catch (error) {
      return NextResponse.json({ error: "The account was created but the verification email could not be sent. Use Resend verification after fixing email delivery." }, { status: 503 });
    }
    return NextResponse.json({ emailVerificationRequired: true, message: "Verification email sent. Confirm your email before signing in." });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not create account." }, { status: 503 });
  }
}