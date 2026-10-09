import { NextResponse } from "next/server";
import { cleanFiles, currentUser, claimUsage } from "../../../../lib/server";
export const runtime = "nodejs";
export async function POST(request: Request) {
  let user;
  try { user = await currentUser(); } catch { return NextResponse.json({ error: "Account service is unavailable." }, { status: 503 }); }
  if (!user) return NextResponse.json({ error: "Sign in before compiling a Flutter preview." }, { status: 401 });
  try { await claimUsage(user.id, "flutter-build", 20, 1); } catch (error) { return NextResponse.json({ error: error instanceof Error && error.message === "RATE_LIMITED" ? "Please wait 20 seconds between Flutter builds." : "Build quota check failed." }, { status: error instanceof Error && error.message === "RATE_LIMITED" ? 429 : 503 }); }
  const base = process.env.FLUTTER_RUNTIME_URL?.replace(/\/$/, "");
  const secret = process.env.RUNTIME_SHARED_SECRET;
  if (!base || !secret || secret.length < 32) return NextResponse.json({ error: "Real Flutter runtime is not deployed/configured. Set FLUTTER_RUNTIME_URL and RUNTIME_SHARED_SECRET on the web server." }, { status: 503 });
  try {
    const body = await request.json();
    const files = cleanFiles(body.files);
    const response = await fetch(base + "/build/web", { method:"POST",headers:{"Content-Type":"application/json","X-Runtime-Token":secret},body:JSON.stringify({files}),signal:AbortSignal.timeout(540000) });
    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: data.detail || "Flutter web compilation failed." }, { status: response.status });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not compile Flutter preview." }, { status: 503 });
  }
}