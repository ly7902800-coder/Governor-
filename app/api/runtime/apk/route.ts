import { NextResponse } from "next/server";
import { cleanFiles } from "../../../../lib/server";
export const runtime = "nodejs";
export const maxDuration = 600;
export async function POST(request: Request) {
  const base = process.env.FLUTTER_RUNTIME_URL?.replace(/\/$/, "");
  const secret = process.env.RUNTIME_SHARED_SECRET;
  if (!base || !secret || secret.length < 32) return NextResponse.json({ error: "The per-project APK builder is not configured. Deploy the Flutter runtime and set FLUTTER_RUNTIME_URL and RUNTIME_SHARED_SECRET." }, { status: 503 });
  try {
    const body = await request.json();
    const files = cleanFiles(body.files);
    const response = await fetch(base + "/build/apk", { method:"POST",headers:{"Content-Type":"application/json","X-Runtime-Token":secret},body:JSON.stringify({files}),signal:AbortSignal.timeout(590000) });
    if (!response.ok) {
      const text = await response.text();
      let message = text;
      try { const data = JSON.parse(text); message = data.detail || data.error || text; } catch {}
      return NextResponse.json({ error: message.slice(-12000) }, { status: response.status });
    }
    const bytes = await response.arrayBuffer();
    return new Response(bytes, { status:200,headers:{"Content-Type":"application/vnd.android.package-archive","Content-Disposition":'attachment; filename="governor-project-release.apk"',"Cache-Control":"no-store"} });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "APK build failed." }, { status: 503 });
  }
}