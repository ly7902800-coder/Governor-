import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { db, hashToken, randomId, sendPlatformEmail } from "../../../../lib/server";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!email) return NextResponse.json({ error: "Enter your email address." }, { status: 400 });
    if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM || !process.env.DATABASE_URL || !process.env.SESSION_SECRET) return NextResponse.json({ error: "Email recovery is not configured by the administrator." }, { status: 503 });
    const database = await db();
    const result = await database.query("SELECT id,email FROM governor_users WHERE email=$1 AND provider='email' AND email_verified=TRUE LIMIT 1",[email]);
    if (result.rows[0]) {
      const token = randomId();
      await database.query("INSERT INTO governor_email_tokens (id,user_id,token_hash,purpose,expires_at) VALUES ($1,$2,$3,'password_reset',NOW()+INTERVAL '30 minutes')",[randomUUID(),result.rows[0].id,hashToken(token)]);
      const base = process.env.APP_BASE_URL || new URL(request.url).origin;
      await sendPlatformEmail(email,"Reset your Governor Studio password",'<p>A password reset was requested for your Governor Studio account.</p><p><a href="' + base + '/account/reset?token=' + encodeURIComponent(token) + '">Reset password</a></p><p>This link expires in 30 minutes. If you did not request this, ignore this email.</p>');
    }
    return NextResponse.json({ message: "If a verified email account exists, a password reset link has been sent." });
  } catch(error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not start password reset." }, { status: 503 });
  }
}