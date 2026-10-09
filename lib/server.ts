import { Pool } from "pg";
import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";

const scrypt = promisify(scryptCallback);
const globalForGovernor = globalThis as unknown as { governorPool?: Pool; governorSchema?: Promise<void> };
const pool = globalForGovernor.governorPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "disable" ? false : { rejectUnauthorized: false },
  max: Number(process.env.DATABASE_POOL_SIZE || 5),
  connectionTimeoutMillis: 8000,
});
if (process.env.NODE_ENV !== "production") globalForGovernor.governorPool = pool;

export function databaseReady() {
  return Boolean(process.env.DATABASE_URL);
}

export async function db() {
  if (!databaseReady()) throw new Error("DATABASE_URL is not configured. Configure PostgreSQL for accounts and cloud projects.");
  if (!globalForGovernor.governorSchema) {
    globalForGovernor.governorSchema = pool.query(`
      CREATE TABLE IF NOT EXISTS governor_users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        display_name TEXT NOT NULL DEFAULT '',
        password_hash TEXT,
        provider TEXT NOT NULL DEFAULT 'email',
        provider_id TEXT,
        email_verified BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(provider, provider_id)
      );
      CREATE TABLE IF NOT EXISTS governor_projects (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES governor_users(id) ON DELETE CASCADE,
        name TEXT NOT NULL DEFAULT 'My Flutter Project',
        files JSONB NOT NULL DEFAULT '{}'::jsonb,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS governor_projects_user_updated ON governor_projects(user_id, updated_at DESC);
      CREATE TABLE IF NOT EXISTS governor_email_tokens (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES governor_users(id) ON DELETE CASCADE,
        token_hash TEXT UNIQUE NOT NULL,
        purpose TEXT NOT NULL CHECK (purpose IN ('verify_email', 'password_reset')),
        expires_at TIMESTAMPTZ NOT NULL,
        used_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS governor_email_tokens_user_purpose ON governor_email_tokens(user_id, purpose, expires_at DESC);
      CREATE TABLE IF NOT EXISTS governor_usage_limits (
        user_id TEXT NOT NULL REFERENCES governor_users(id) ON DELETE CASCADE,
        action TEXT NOT NULL,
        window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        count INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (user_id, action)
      );
    `).then(() => undefined).catch((error) => { globalForGovernor.governorSchema = undefined; throw error; });
  }
  await globalForGovernor.governorSchema;
  return pool;
}

const sessionSecret = () => process.env.SESSION_SECRET || "";
export function requireSessionSecret() {
  if (sessionSecret().length < 32) throw new Error("SESSION_SECRET must be configured with at least 32 random characters.");
  return sessionSecret();
}
export function hashToken(value: string) {
  return createHmac("sha256", requireSessionSecret()).update(value).digest("hex");
}
export function safeEqual(a: string, b: string) {
  const aa = Buffer.from(a); const bb = Buffer.from(b);
  return aa.length === bb.length && timingSafeEqual(aa, bb);
}
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const key = await scrypt(password, salt, 64) as Buffer;
  return `scrypt:${salt}:${key.toString("hex")}`;
}
export async function verifyPassword(password: string, stored: string) {
  const [scheme, salt, expectedHex] = stored.split(":");
  if (scheme !== "scrypt" || !salt || !expectedHex) return false;
  const expected = Buffer.from(expectedHex, "hex");
  const actual = await scrypt(password, salt, expected.length) as Buffer;
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
export function makeSession(userId: string) {
  const secret = requireSessionSecret();
  const payload = Buffer.from(JSON.stringify({ sub: userId, exp: Date.now() + 1000 * 60 * 60 * 24 * 14 })).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}
export function readSession(token: string | undefined) {
  if (!token) return null;
  try {
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return null;
    const expected = createHmac("sha256", requireSessionSecret()).update(payload).digest("base64url");
    if (!safeEqual(signature, expected)) return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { sub?: string; exp?: number };
    if (!data.sub || !data.exp || data.exp < Date.now()) return null;
    return { userId: data.sub };
  } catch { return null; }
}
export async function currentUser() {
  const jar = await cookies();
  const session = readSession(jar.get("governor_session")?.value);
  if (!session) return null;
  const database = await db();
  const result = await database.query(
    "SELECT id, email, display_name, provider, email_verified, created_at FROM governor_users WHERE id = $1",
    [session.userId],
  );
  return result.rows[0] ?? null;
}
export function sessionCookie(token: string) {
  return { name: "governor_session", value: token, httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: 60 * 60 * 24 * 14 };
}
export function clearSessionCookie() {
  return { name: "governor_session", value: "", httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: 0 };
}
export function cleanFiles(input: unknown) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("files must be an object of relative paths to text contents");
  const entries = Object.entries(input as Record<string, unknown>);
  if (entries.length > 300) throw new Error("A project can contain at most 300 files.");
  const result: Record<string, string> = {};
  let total = 0;
  for (const [rawPath, value] of entries) {
    const path = rawPath.trim().replace(/^\/+/, "");
    if (!path || path.length > 180 || path.split("/").some(part => !part || part === "." || part === "..") || path.includes("\\") || path.startsWith(".git/")) continue;
    if (typeof value !== "string") continue;
    if (value.length > 200_000) throw new Error(`File ${path} exceeds 200 KB.`);
    total += Buffer.byteLength(value, "utf8");
    if (total > 2_000_000) throw new Error("Project exceeds the 2 MB cloud workspace limit.");
    result[path] = value;
  }
  if (typeof result["lib/main.dart"] !== "string") throw new Error("The project must include lib/main.dart.");
  return result;
}
export function safeProvider(provider: string) {
  if (!["google", "github"].includes(provider)) throw new Error("Unsupported sign-in provider.");
  return provider as "google" | "github";
}
export function randomId() { return randomBytes(18).toString("base64url"); }

export async function claimUsage(userId: string, action: "ai" | "flutter-build", windowSeconds: number, maxCount: number) {
  const database = await db();
  const result = await database.query(
    `INSERT INTO governor_usage_limits (user_id,action,window_start,count)
     VALUES ($1,$2,NOW(),1)
     ON CONFLICT (user_id,action) DO UPDATE SET
       count = CASE WHEN governor_usage_limits.window_start < NOW() - ($3 * INTERVAL '1 second') THEN 1 ELSE governor_usage_limits.count + 1 END,
       window_start = CASE WHEN governor_usage_limits.window_start < NOW() - ($3 * INTERVAL '1 second') THEN NOW() ELSE governor_usage_limits.window_start END
     WHERE governor_usage_limits.window_start < NOW() - ($3 * INTERVAL '1 second') OR governor_usage_limits.count < $4
     RETURNING count`,
    [userId, action, windowSeconds, maxCount],
  );
  if (!result.rows[0]) throw new Error("RATE_LIMITED");
}

export async function sendPlatformEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) throw new Error("Email delivery is not configured. Set RESEND_API_KEY and EMAIL_FROM on the web server.");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: "Bearer " + apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({})) as { message?: string };
    throw new Error(data.message || "Email delivery provider rejected the message.");
  }
}
export function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/\x27/g, "&#39;");
}
