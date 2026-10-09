import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { safeProvider } from "../../../../../lib/server";
export const runtime = "nodejs";
export async function GET(_request: Request, context: { params: Promise<{ provider: string }> }) {
  try {
    const { provider: raw } = await context.params;
    const provider = safeProvider(raw);
    const state = randomBytes(24).toString("hex");
    const redirectUri = `${process.env.APP_BASE_URL || new URL(_request.url).origin}/api/auth/oauth/callback/${provider}`;
    let url: URL;
    if (provider === "google") {
      if (!process.env.GOOGLE_CLIENT_ID) return NextResponse.json({ error: "GOOGLE_CLIENT_ID is not configured." }, { status: 503 });
      url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      url.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID);
      url.searchParams.set("redirect_uri", redirectUri);
      url.searchParams.set("response_type", "code");
      url.searchParams.set("scope", "openid email profile");
      url.searchParams.set("state", state);
      url.searchParams.set("prompt", "select_account");
    } else {
      if (!process.env.GITHUB_CLIENT_ID) return NextResponse.json({ error: "GITHUB_CLIENT_ID is not configured." }, { status: 503 });
      url = new URL("https://github.com/login/oauth/authorize");
      url.searchParams.set("client_id", process.env.GITHUB_CLIENT_ID);
      url.searchParams.set("redirect_uri", redirectUri);
      url.searchParams.set("scope", "read:user user:email");
      url.searchParams.set("state", state);
    }
    const response = NextResponse.redirect(url);
    response.cookies.set("governor_oauth_state", state, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 600 });
    response.cookies.set("governor_oauth_provider", provider, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 600 });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "OAuth provider is invalid." }, { status: 400 });
  }
}