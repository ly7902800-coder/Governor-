import { NextResponse } from "next/server";
import { db, hashToken } from "../../../../lib/server";
export const runtime = "nodejs";
export async function GET(request: Request) {
  const base = process.env.APP_BASE_URL || new URL(request.url).origin;
  const token = new URL(request.url).searchParams.get("token") || "";
  if (!token || token.length > 200) return NextResponse.redirect(new URL("/account?error=Invalid%20verification%20link",base));
  try {
    const database = await db();
    const result = await database.query("SELECT id,user_id FROM governor_email_tokens WHERE token_hash=$1 AND purpose='verify_email' AND used_at IS NULL AND expires_at>NOW() LIMIT 1",[hashToken(token)]);
    if (!result.rows[0]) return NextResponse.redirect(new URL("/account?error=Verification%20link%20expired%20or%20already%20used",base));
    await database.query("BEGIN");
    try {
      await database.query("UPDATE governor_users SET email_verified=TRUE WHERE id=$1",[result.rows[0].user_id]);
      await database.query("UPDATE governor_email_tokens SET used_at=NOW() WHERE id=$1",[result.rows[0].id]);
      await database.query("COMMIT");
    } catch(error) { await database.query("ROLLBACK"); throw error; }
    return NextResponse.redirect(new URL("/account?verified=1",base));
  } catch {
    return NextResponse.redirect(new URL("/account?error=Could%20not%20verify%20email",base));
  }
}