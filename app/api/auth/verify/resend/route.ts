import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { db, hashToken, randomId, sendPlatformEmail } from "../../../../../lib/server";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!email || !process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) return NextResponse.json({ error: "Email delivery is not configured or the email is missing." }, { status: 503 });
    const database = await db();
    const result = await database.query("SELECT id,email FROM governor_users WHERE email=$1 AND provider='email' AND email_verified=FALSE LIMIT 1",[email]);
    if (result.rows[0]) {
      const token = randomId();
      await database.query("INSERT INTO governor_email_tokens (id,user_id,token_hash,purpose,expires_at) VALUES ($1,$2,$3,'verify_email',NOW()+INTERVAL '24 hours')",[randomUUID(),result.rows[0].id,hashToken(token)]);
      const base = process.env.APP_BASE_URL || new URL(request.url).origin;
      await sendPlatformEmail(email,"Verify your Governor Studio email",'<p>Open this link to verify your email (valid for 24 hours):</p><p><a href="' + base + '/api/auth/verify?token=' + encodeURIComponent(token) + '">Verify email</a></p>');
    }
    return NextResponse.json({ message: "If an unverified account exists for this email, a verification link has been sent." });
  } catch(error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not resend verification." }, { status: 503 });
  }
}