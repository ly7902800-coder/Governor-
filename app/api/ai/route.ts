import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Provider = "openrouter" | "openai" | "gemini" | "anthropic";

const systemPrompt = "You are a careful Flutter and Dart coding assistant. Explain changes clearly. Do not claim to have edited files; return suggested code or steps only.";

async function callOpenRouter(prompt: string, code: string) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY is not configured in the deployment environment.");
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "https://github.com/ly7902800-coder/Governor-",
      "X-Title": process.env.OPENROUTER_APP_NAME || "Cloud Flutter Studio",
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || "openrouter/free",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Request:\n${prompt}\n\nCurrent Dart source:\n${code}` },
      ],
      temperature: 0.2,
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || `OpenRouter request failed (HTTP ${response.status}).`);
  return data.choices?.[0]?.message?.content || "";
}

async function callOpenAI(prompt: string, code: string) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not configured on the server.");
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Request:\n${prompt}\n\nCurrent Dart source:\n${code}` }
      ],
      temperature: 0.2
    })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "OpenAI request failed.");
  return data.choices?.[0]?.message?.content || "";
}

async function callGemini(prompt: string, code: string) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not configured on the server.");
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: `You are a careful Flutter/Dart coding assistant.\nRequest: ${prompt}\n\nCurrent Dart source:\n${code}` }] }] })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Gemini request failed.");
  return data.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || "").join("\n") || "";
}

async function callAnthropic(prompt: string, code: string) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY is not configured on the server.");
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest",
      max_tokens: 1800,
      messages: [{ role: "user", content: `You are a careful Flutter/Dart coding assistant.\nRequest: ${prompt}\n\nCurrent Dart source:\n${code}` }]
    })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Anthropic request failed.");
  return data.content?.map((part: { text?: string }) => part.text || "").join("\n") || "";
}

const providerStatus = {
  openrouter: Boolean(process.env.OPENROUTER_API_KEY),
  openai: Boolean(process.env.OPENAI_API_KEY),
  gemini: Boolean(process.env.GEMINI_API_KEY),
  anthropic: Boolean(process.env.ANTHROPIC_API_KEY),
};

export async function GET() {
  return NextResponse.json({
    providers: [
      { id: "openrouter", name: "OpenRouter", configured: providerStatus.openrouter, model: process.env.OPENROUTER_MODEL || "openrouter/free" },
      { id: "openai", name: "OpenAI", configured: providerStatus.openai, model: process.env.OPENAI_MODEL || "gpt-4o-mini" },
      { id: "gemini", name: "Google Gemini", configured: providerStatus.gemini, model: process.env.GEMINI_MODEL || "gemini-2.0-flash" },
      { id: "anthropic", name: "Anthropic Claude", configured: providerStatus.anthropic, model: process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest" },
    ],
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = typeof body.prompt === "string" ? body.prompt.trim().slice(0, 6000) : "";
    const code = typeof body.code === "string" ? body.code.slice(0, 30000) : "";
    const requested = body.provider as Provider | "auto";
    const history: Array<{ role: "user" | "assistant"; content: string }> = Array.isArray(body.history)
      ? body.history
          .filter((item: unknown) => {
            if (!item || typeof item !== "object") return false;
            const message = item as { role?: unknown; content?: unknown };
            return (message.role === "user" || message.role === "assistant") && typeof message.content === "string";
          })
          .slice(-16)
          .map((item: { role: "user" | "assistant"; content: string }) => ({
            role: item.role,
            content: item.content.slice(0, 6000),
          }))
      : [];
    if (!prompt) return NextResponse.json({ error: "Enter a prompt first." }, { status: 400 });
    const conversationPrompt = history.length
      ? "Recent conversation (preserve its context when answering):\\n" +
        history.map((item) => `${item.role.toUpperCase()}: ${item.content}`).join("\\n\\n") +
        "\\n\\nCurrent request:\\n" + prompt
      : prompt;

    const providers: Provider[] = requested === "openrouter" || requested === "openai" || requested === "gemini" || requested === "anthropic"
      ? [requested]
      : ["openrouter", "openai", "gemini", "anthropic"];

    const failures: string[] = [];
    for (const provider of providers) {
      try {
        const text = provider === "openrouter" ? await callOpenRouter(conversationPrompt, code)
          : provider === "openai" ? await callOpenAI(conversationPrompt, code)
          : provider === "gemini" ? await callGemini(conversationPrompt, code)
          : await callAnthropic(conversationPrompt, code);
        return NextResponse.json({ provider, text });
      } catch (error) {
        failures.push(error instanceof Error ? error.message : String(error));
      }
    }
    return NextResponse.json({ error: failures.join(" | ") || "No AI provider is configured." }, { status: 503 });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
