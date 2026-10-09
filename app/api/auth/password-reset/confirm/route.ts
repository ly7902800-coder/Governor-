import { NextResponse } from "next/server";
import { db, hashPassword, hashToken } from "../../../../../lib/server";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = typeof body.token === "string" ? body.token : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!token || token.length > 200) return NextResponse.json({ error: "Reset token is invalid." }, { status: 400 });
    if (password.length < 10 || password.length > 128) return NextResponse.json({ error: "Use a password between 10 and 128 characters." }, { status: 400 });
    const database = await db();
    const result = await database.query("SELECT id,user_id FROM governor_email_tokens WHERE token_hash=$1 AND purpose='password_reset' AND used_at IS NULL AND expires_at>NOW() LIMIT 1",[hashToken(token)]);
    if (!result.rows[0]) return NextResponse.json({ error: "Reset link expired or already used." }, { status: 400 });
    await database.query("BEGIN");
    try {
      await database.query("UPDATE governor_users SET password_hash=$1,session_version=session_version+1 WHERE id=$2",[await hashPassword(password),result.rows[0].user_id]);
      await database.query("UPDATE governor_email_tokens SET used_at=NOW() WHERE id=$1",[result.rows[0].id]);
      await database.query("UPDATE governor_email_tokens SET used_at=NOW() WHERE user_id=$1 AND purpose='password_reset' AND used_at IS NULL",[result.rows[0].user_id]);
      await database.query("COMMIT");
    } catch(error) { await database.query("ROLLBACK"); throw error; }
    return NextResponse.json({ ok: true, message: "Password changed. Sign in again with the new password." });
  } catch(error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not reset password." }, { status: 503 });
  }
}