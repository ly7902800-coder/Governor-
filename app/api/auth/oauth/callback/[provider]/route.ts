import { NextResponse } from "next/server";
import { randomUUID, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { db, makeSession, sessionCookie, safeProvider } from "../../../../../../lib/server";
export const runtime = "nodejs";
function same(a: string, b: string) { const x=Buffer.from(a); const y=Buffer.from(b); return x.length===y.length && timingSafeEqual(x,y); }
export async function GET(request: Request, context: { params: Promise<{ provider: string }> }) {
  const base = process.env.APP_BASE_URL || new URL(request.url).origin;
  const fail = (message: string) => NextResponse.redirect(new URL("/account?error=" + encodeURIComponent(message), base));
  try {
    const { provider: raw } = await context.params;
    const provider = safeProvider(raw);
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const jar = await cookies();
    const expectedState = jar.get("governor_oauth_state")?.value || "";
    const expectedProvider = jar.get("governor_oauth_provider")?.value || "";
    if (!code || !state || !expectedState || !same(state,expectedState) || expectedProvider !== provider) return fail("OAuth state validation failed. Please try again.");
    const redirectUri = `${base}/api/auth/oauth/callback/${provider}`;
    let accessToken = "";
    if (provider === "google") {
      const response = await fetch("https://oauth2.googleapis.com/token", { method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({code,client_id:process.env.GOOGLE_CLIENT_ID||"",client_secret:process.env.GOOGLE_CLIENT_SECRET||"",redirect_uri:redirectUri,grant_type:"authorization_code"}) });
      const data = await response.json();
      if (!response.ok || typeof data.access_token !== "string") return fail("Google token exchange failed. Check OAuth settings and callback URL.");
      accessToken = data.access_token;
    } else {
      const response = await fetch("https://github.com/login/oauth/access_token", { method:"POST",headers:{"Accept":"application/json","Content-Type":"application/json"},body:JSON.stringify({code,client_id:process.env.GITHUB_CLIENT_ID||"",client_secret:process.env.GITHUB_CLIENT_SECRET||"",redirect_uri:redirectUri}) });
      const data = await response.json();
      if (!response.ok || typeof data.access_token !== "string") return fail("GitHub token exchange failed. Check OAuth settings and callback URL.");
      accessToken = data.access_token;
    }
    const profileResponse = await fetch(provider === "google" ? "https://www.googleapis.com/oauth2/v3/userinfo" : "https://api.github.com/user", {headers:{Authorization:`Bearer ${accessToken}`,Accept:"application/json","User-Agent":"Governor-Studio"}});
    const profile = await profileResponse.json();
    if (!profileResponse.ok) return fail("Could not read the provider profile.");
    let email = typeof profile.email === "string" ? profile.email.toLowerCase() : "";
    let displayName = typeof profile.name === "string" ? profile.name : typeof profile.login === "string" ? profile.login : "Governor user";
    const providerId = String(provider === "google" ? profile.sub || "" : profile.id || "");
    let verified = provider === "google" ? profile.email_verified === true : false;
    if (provider === "github") {
      const emailsResponse = await fetch("https://api.github.com/user/emails",{headers:{Authorization:`Bearer ${accessToken}`,Accept:"application/vnd.github+json","User-Agent":"Governor-Studio"}});
      const emails = await emailsResponse.json();
      if (emailsResponse.ok && Array.isArray(emails)) {
        const primary = emails.find((item: {primary?:boolean;verified?:boolean;email?:string})=>item.primary && item.verified && typeof item.email==="string");
        if (primary) { email=primary.email.toLowerCase(); verified=true; }
        else { email=""; verified=false; }
      } else { email=""; verified=false; }
    }
    if (!email || !verified || !providerId) return fail("A verified email is required for sign-in.");
    if (!process.env.DATABASE_URL || !process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) return fail("Account database or session secret is not configured.");
    const database = await db();
    const found = await database.query("SELECT id,provider,provider_id,session_version FROM governor_users WHERE email=$1 OR (provider=$2 AND provider_id=$3) LIMIT 1",[email,provider,providerId]);
    let userId: string;
    let sessionVersion = 0;
    if (found.rows[0]) {
      if (found.rows[0].provider !== provider || found.rows[0].provider_id !== providerId) return fail("This email already belongs to another sign-in method. Sign in with that method first.");
      userId = found.rows[0].id;
      sessionVersion = Number(found.rows[0].session_version || 0);
      await database.query("UPDATE governor_users SET display_name=$1,email_verified=TRUE WHERE id=$2",[displayName,userId]);
    } else {
      userId = randomUUID();
      await database.query("INSERT INTO governor_users (id,email,display_name,provider,provider_id,email_verified) VALUES ($1,$2,$3,$4,$5,TRUE)",[userId,email,displayName,provider,providerId]);
    }
    const response = NextResponse.redirect(new URL("/account?connected=" + provider,base));
    response.cookies.set(sessionCookie(makeSession(userId, sessionVersion)));
    response.cookies.set("governor_oauth_state","",{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:0});
    response.cookies.set("governor_oauth_provider","",{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:0});
    return response;
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Sign-in could not be completed.");
  }
}