import { NextResponse } from "next/server";
import { currentUser, db } from "../../../../lib/server";
export const runtime = "nodejs";
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Sign in to access cloud projects." }, { status: 401 });
    const { id } = await context.params;
    const database = await db();
    const result = await database.query("SELECT id,name,files,updated_at FROM governor_projects WHERE id=$1 AND user_id=$2 LIMIT 1", [id,user.id]);
    if (!result.rows[0]) return NextResponse.json({ error: "Project not found." }, { status: 404 });
    return NextResponse.json({ project: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not load project." }, { status: 503 });
  }
}