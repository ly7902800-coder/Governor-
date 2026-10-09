import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { currentUser, db, cleanFiles } from "../../../lib/server";
export const runtime = "nodejs";
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Sign in to access cloud projects." }, { status: 401 });
    const database = await db();
    const result = await database.query("SELECT id,name,files,updated_at FROM governor_projects WHERE user_id=$1 ORDER BY updated_at DESC LIMIT 50", [user.id]);
    return NextResponse.json({ projects: result.rows });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Cloud projects unavailable." }, { status: 503 });
  }
}
export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Sign in to save to cloud." }, { status: 401 });
    const body = await request.json();
    const files = cleanFiles(body.files);
    const id = typeof body.id === "string" && /^[a-zA-Z0-9_-]{8,80}$/.test(body.id) ? body.id : randomUUID();
    const name = typeof body.name === "string" ? body.name.trim().slice(0,100) || "My Flutter Project" : "My Flutter Project";
    const database = await db();
    const existing = await database.query("SELECT id FROM governor_projects WHERE id=$1 AND user_id=$2", [id,user.id]);
    if (existing.rows[0]) await database.query("UPDATE governor_projects SET name=$1,files=$2::jsonb,updated_at=NOW() WHERE id=$3 AND user_id=$4", [name,JSON.stringify(files),id,user.id]);
    else await database.query("INSERT INTO governor_projects (id,user_id,name,files) VALUES ($1,$2,$3,$4::jsonb)", [id,user.id,name,JSON.stringify(files)]);
    return NextResponse.json({ id,name,files,savedAt:new Date().toISOString() });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not save cloud project." }, { status: 400 });
  }
}