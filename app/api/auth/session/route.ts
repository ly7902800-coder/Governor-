import { NextResponse } from "next/server";
import { currentUser, databaseReady } from "../../../../lib/server";
export const runtime = "nodejs";
export async function GET() {
  if (!databaseReady()) return NextResponse.json({ configured: false, user: null });
  try { return NextResponse.json({ configured: true, user: await currentUser() }); }
  catch { return NextResponse.json({ configured: false, user: null }); }
}