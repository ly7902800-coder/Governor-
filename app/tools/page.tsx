"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ExternalLink, Search, Wrench, Sparkles, Code2, Puzzle,
  Activity, BookOpen, Star, CheckCircle2, Filter, Globe, PackageOpen,
  Cloud, KeyRound, PlugZap, Monitor, Rocket, ShieldCheck
} from "lucide-react";

type ToolCategory =
  | "All"
  | "AI & Agents"
  | "Flutter & Dart"
  | "Editors & Extensions"
  | "API & Testing"
  | "Deploy & Cloud"
  | "Debug & Preview";

type ToolItem = {
  id: string;
  name: string;
  category: Exclude<ToolCategory, "All">;
  description: string;
  publisher: "Official" | "Community";
  integration: "Quick launch" | "IDE extension" | "API setup" | "Cloud setup" | "Documentation";
  connection: string;
  requirement: string;
  url: string;
  action: string;
  tags: string[];
};

const tools: ToolItem[] = [
  {
    id: "perplexity",
    name: "Perplexity",
    category: "AI & Agents",
    description: "AI search and research assistant for exploring technical questions and collecting source-backed context.",
    publisher: "Official",
    integration: "Quick launch",
    connection: "Launch link is wired into Governor Studio. A live Perplexity API connection is not configured in this repository.",
    requirement: "Use the website directly; API use requires a Perplexity API key stored server-side.",
    url: "https://www.perplexity.ai/",
    action: "Open Perplexity",
    tags: ["Research", "Web search", "AI"]
  },
  {
    id: "perplexity-api",
    name: "Perplexity API",
    category: "AI & Agents",
    description: "API documentation for adding Perplexity-backed research to a server-side model router.",
    publisher: "Official",
    integration: "API setup",
    connection: "Setup reference is linked. No API key is assumed or stored by this catalog.",
    requirement: "Configure PERPLEXITY_API_KEY as a server-side secret and implement a backend adapter before calling it from the app.",
    url: "https://docs.perplexity.ai/",
    action: "API documentation",
    tags: ["API", "Search", "Server-side secret"]
  },
  {
    id: "google-ai-studio",
    name: "Google AI Studio",
    category: "AI & Agents",
    description: "Build and test Gemini prompts and prototypes, then use Gemini API documentation for production integration.",
    publisher: "Official",
    integration: "API setup",
    connection: "The launch and setup links are connected. Gemini is not live in Governor until a server-side API adapter and secret are configured.",
    requirement: "Create a Gemini API key in Google AI Studio and store it as GEMINI_API_KEY on the server; never put it in browser code.",
    url: "https://aistudio.google.com/",
    action: "Open AI Studio",
    tags: ["Google", "Gemini", "Multimodal", "API"]
  },
  {
    id: "gemini-api-docs",
    name: "Gemini API documentation",
    category: "AI & Agents",
    description: "Official Gemini API reference for model calls, structured output, tools, and multimodal inputs.",
    publisher: "Official",
    integration: "Documentation",
    connection: "Documentation is linked; actual API calls need a backend adapter and configured secret.",
    requirement: "Backend implementation and GEMINI_API_KEY are required for live calls.",
    url: "https://ai.google.dev/gemini-api/docs",
    action: "Read API docs",
    tags: ["Google", "API", "Models"]
  },
  {
    id: "antigravity",
    name: "Google Antigravity",
    category: "AI & Agents",
    description: "Google's agentic development environment for coding agents, browser workflows, plans, and reviewable artifacts.",
    publisher: "Official",
    integration: "Quick launch",
    connection: "Opens the official platform. A browser-based Governor project cannot silently control or install software into the desktop IDE.",
    requirement: "Use Antigravity itself to enable its plugins and skills.",
    url: "https://antigravity.google/",
    action: "Open Antigravity",
    tags: ["Google", "AI agent", "IDE"]
  },
  {
    id: "flutter-google-plugin",
    name: "Dart & Flutter for Antigravity",
    category: "Flutter & Dart",
    description: "Official Flutter guidance for using Flutter/Dart integrations and development workflows with Antigravity.",
    publisher: "Official",
    integration: "Documentation",
    connection: "Official setup guide is linked; installation must be completed in Antigravity.",
    requirement: "Enable the supported Flutter/Dart plugin or bundle in the Antigravity environment.",
    url: "https://docs.flutter.dev/ai/get-started",
    action: "Open setup guide",
    tags: ["Flutter", "Dart", "MCP", "Skills"]
  },
  {
    id: "bruno",
    name: "Bruno API Client",
    category: "API & Testing",
    description: "Git-friendly API client that stores request collections as files, making API tests easier to review and version.",
    publisher: "Official",
    integration: "Quick launch",
    connection: "Official download and documentation are linked; Bruno is not embedded in the browser workspace.",
    requirement: "Install Bruno separately to run API requests locally; import or create a collection for Governor endpoints.",
    url: "https://www.usebruno.com/",
    action: "Open Bruno",
    tags: ["REST", "API testing", "Git"]
  },
  {
    id: "v0",
    name: "v0 by Vercel",
    category: "AI & Agents",
    description: "AI UI and web-app generation, useful for exploring layouts and React/Next.js components.",
    publisher: "Official",
    integration: "Quick launch",
    connection: "Launch link is wired into the catalog. Generated code is not automatically imported into Governor yet.",
    requirement: "Copy/export the generated code and add it to the project, or build a dedicated import integration later.",
    url: "https://v0.app/",
    action: "Open v0",
    tags: ["UI generation", "React", "Next.js"]
  },
  {
    id: "cursor",
    name: "Cursor",
    category: "Editors & Extensions",
    description: "AI-first code editor with codebase-aware chat and agentic editing workflows.",
    publisher: "Official",
    integration: "Quick launch",
    connection: "Official product link is connected; Governor cannot control Cursor or sync files without a separate authorized integration.",
    requirement: "Open the repository in Cursor and sign in there if you want to use its editor/agent.",
    url: "https://cursor.com/",
    action: "Open Cursor",
    tags: ["IDE", "AI coding", "Agent"]
  },
  {
    id: "vscode",
    name: "Visual Studio Code",
    category: "Editors & Extensions",
    description: "Extensible code editor with Dart/Flutter support and a large extension marketplace.",
    publisher: "Official",
    integration: "Quick launch",
    connection: "Official download/docs are linked; this web app does not install VS Code on your device.",
    requirement: "Install VS Code separately on a supported computer and add the needed extensions.",
    url: "https://code.visualstudio.com/",
    action: "Open VS Code",
    tags: ["Editor", "Extensions", "Dart", "Flutter"]
  },
  {
    id: "vercel",
    name: "Vercel",
    category: "Deploy & Cloud",
    description: "Hosting and deployment platform for Next.js and other web projects.",
    publisher: "Official",
    integration: "Cloud setup",
    connection: "Deployment destination is linked. No Vercel project is claimed as connected until the repository is imported and deployment succeeds.",
    requirement: "Import ly7902800-coder/Governor- into Vercel and configure environment variables in Project Settings.",
    url: "https://vercel.com/",
    action: "Open Vercel",
    tags: ["Deploy", "Next.js", "Hosting"]
  },
  {
    id: "vercel-docs",
    name: "Vercel deployment docs",
    category: "Deploy & Cloud",
    description: "Official instructions for importing Git repositories, configuring builds, and managing environment variables.",
    publisher: "Official",
    integration: "Documentation",
    connection: "Setup guide is linked; deployment itself must be completed and verified in the Vercel account.",
    requirement: "Confirm the project root, build command, and server-side environment variables in Vercel.",
    url: "https://vercel.com/docs",
    action: "Read deployment docs",
    tags: ["Deploy", "Build", "Environment"]
  },
  {
    id: "better-google-fonts",
    name: "Better Google Fonts for VS Code",
    category: "Editors & Extensions",
    description: "Marketplace search for the requested font helper extension, so you can check the publisher and compatibility before installing.",
    publisher: "Community",
    integration: "IDE extension",
    connection: "Marketplace listing is linked; extensions run inside VS Code, not inside this browser app.",
    requirement: "Open the listing in VS Code or its marketplace and verify publisher, permissions, and current compatibility.",
    url: "https://marketplace.visualstudio.com/search?term=Better%20Google%20Fonts",
    action: "Find extension",
    tags: ["Fonts", "VS Code", "Marketplace"]
  },
  {
    id: "code-runner",
    name: "Code Runner",
    category: "Editors & Extensions",
    description: "Popular VS Code extension for running supported source files with configured local language runtimes.",
    publisher: "Community",
    integration: "IDE extension",
    connection: "Publisher listing is linked; it runs code in the VS Code environment and is not a remote runner in Governor.",
    requirement: "Install the extension and the relevant language runtime in VS Code. It does not compile Flutter APKs by itself.",
    url: "https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner",
    action: "Open extension",
    tags: ["Run code", "VS Code", "Local runtime"]
  },
  {
    id: "typewriter",
    name: "Typewriter extension",
    category: "Editors & Extensions",
    description: "Marketplace search for Typewriter-named VS Code extensions; check the exact extension and publisher before installing.",
    publisher: "Community",
    integration: "IDE extension",
    connection: "Marketplace search is linked; no extension is installed into Governor Studio.",
    requirement: "Confirm the exact Typewriter extension you mean, because multiple similarly named extensions may exist.",
    url: "https://marketplace.visualstudio.com/search?term=Typewriter",
    action: "Find extension",
    tags: ["VS Code", "Extension", "Typing"]
  },
  {
    id: "skill-manager",
    name: "Skill Manager for Google Antigravity",
    category: "Editors & Extensions",
    description: "Community extension for browsing and managing Antigravity skills from supported repositories.",
    publisher: "Community",
    integration: "IDE extension",
    connection: "Marketplace link is connected; it must be installed in a compatible local IDE to work.",
    requirement: "Review publisher, source, and permissions before installation.",
    url: "https://marketplace.visualstudio.com/items?itemName=yxshee.skill-manager-antigravity",
    action: "Open marketplace",
    tags: ["Skills", "Antigravity", "GitHub"]
  },
  {
    id: "antigravity-skill-manager",
    name: "Antigravity Skill Manager",
    category: "Editors & Extensions",
    description: "Another community extension for managing local Antigravity skills and discovering remote skills.",
    publisher: "Community",
    integration: "IDE extension",
    connection: "Marketplace link is connected; it is not installed or running inside Governor.",
    requirement: "Check publisher and permissions before installing.",
    url: "https://marketplace.visualstudio.com/items?itemName=ryanhutto.antigravity-skill-manager",
    action: "Open marketplace",
    tags: ["Skills", "Antigravity", "VS Code"]
  },
  {
    id: "flutter-devtools",
    name: "Flutter & Dart DevTools",
    category: "Debug & Preview",
    description: "Official tools for widget inspection, performance profiling, memory, network inspection, and debugging.",
    publisher: "Official",
    integration: "Documentation",
    connection: "Documentation is linked. Full DevTools requires a real Flutter app and a supported SDK/debug session.",
    requirement: "Connect DevTools to a running Flutter application from a configured Flutter environment.",
    url: "https://docs.flutter.dev/tools/devtools",
    action: "Open DevTools docs",
    tags: ["Inspector", "Performance", "Debug"]
  },
  {
    id: "widget-previewer",
    name: "Flutter Widget Previewer",
    category: "Debug & Preview",
    description: "Flutter tooling for previewing widgets separately from a complete app.",
    publisher: "Official",
    integration: "Documentation",
    connection: "Official tool docs are linked; this is not the same as a live Flutter engine in the Governor preview pane.",
    requirement: "Use the supported Flutter tooling workflow and SDK version.",
    url: "https://docs.flutter.dev/tools",
    action: "Explore Flutter tools",
    tags: ["Flutter", "Widget", "Preview"]
  },
  {
    id: "dartpad",
    name: "DartPad",
    category: "Debug & Preview",
    description: "Online playground for Dart and supported Flutter examples without a local SDK setup.",
    publisher: "Official",
    integration: "Quick launch",
    connection: "Opens the official playground. It is separate from Governor's editor and does not build a full APK.",
    requirement: "Use for small samples and experiments.",
    url: "https://dartpad.dev/",
    action: "Open DartPad",
    tags: ["Online", "Dart", "Examples"]
  },
  {
    id: "github",
    name: "GitHub repository",
    category: "Deploy & Cloud",
    description: "Source control for Governor Studio, code review, issues, commits, and automation.",
    publisher: "Official",
    integration: "Quick launch",
    connection: "The Governor repository link points to the actual project. Browser-edited workspace files are not auto-synced to GitHub.",
    requirement: "Use GitHub commits or a separately implemented authenticated GitHub sync to update project files.",
    url: "https://github.com/ly7902800-coder/Governor-",
    action: "Open Governor repo",
    tags: ["Git", "Source code", "Issues"]
  },
  {
    id: "github-actions",
    name: "Governor build workflows",
    category: "Deploy & Cloud",
    description: "Open the project's GitHub Actions runs to inspect build status and APK workflow artifacts.",
    publisher: "Official",
    integration: "Quick launch",
    connection: "Directly linked to the real Governor repository's Actions page; the build result must be checked per run.",
    requirement: "A successful workflow run is required before an APK artifact can be claimed as available.",
    url: "https://github.com/ly7902800-coder/Governor-/actions",
    action: "View workflow runs",
    tags: ["CI", "APK", "Build logs"]
  },
  {
    id: "firebase",
    name: "Firebase",
    category: "Deploy & Cloud",
    description: "Google platform for app authentication, databases, hosting, analytics, and other backend services.",
    publisher: "Official",
    integration: "Cloud setup",
    connection: "Official console is linked; no Firebase project is configured in Governor by this catalog.",
    requirement: "Create or select a Firebase project, configure the required services, and add server/client configuration safely.",
    url: "https://console.firebase.google.com/",
    action: "Open Firebase",
    tags: ["Google", "Auth", "Backend"]
  },
  {
    id: "google-search",
    name: "Google Search",
    category: "AI & Agents",
    description: "Quick access to Google's web search for documentation, package versions, error messages, and technical references.",
    publisher: "Official",
    integration: "Quick launch",
    connection: "Search link is wired into Governor's toolbox; this is a browser shortcut, not a Google Search API integration.",
    requirement: "For programmable search inside Governor, choose an appropriate Google API and configure its credentials server-side.",
    url: "https://www.google.com/",
    action: "Search with Google",
    tags: ["Google", "Web search", "Research"]
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    category: "Editors & Extensions",
    description: "AI coding assistant for supported IDEs, with inline suggestions and chat/agent features depending on plan and environment.",
    publisher: "Official",
    integration: "IDE extension",
    connection: "Official product is linked; it is not running inside Governor Studio's Monaco editor.",
    requirement: "Sign in and enable Copilot in a supported editor or GitHub environment; availability depends on account plan and feature access.",
    url: "https://github.com/features/copilot",
    action: "Open GitHub Copilot",
    tags: ["AI coding", "GitHub", "Editor"]
  },
  {
    id: "gemini-code-assist",
    name: "Gemini Code Assist",
    category: "Editors & Extensions",
    description: "Google's coding assistant for supported IDEs, with code completion and chat-based development help.",
    publisher: "Official",
    integration: "IDE extension",
    connection: "Official setup page is linked; it is not installed into Governor Studio or authenticated here.",
    requirement: "Install in a supported IDE and sign in with an eligible Google account.",
    url: "https://codeassist.google/",
    action: "Open Gemini Code Assist",
    tags: ["Google", "Gemini", "IDE"]
  },
  {
    id: "cline",
    name: "Cline",
    category: "Editors & Extensions",
    description: "Open-source coding agent for VS Code that can work through multi-step coding tasks with user approval.",
    publisher: "Community",
    integration: "IDE extension",
    connection: "Official project page is linked; the agent runs in a supported IDE, not in this Governor web app.",
    requirement: "Install the extension and configure a supported model/provider in the IDE before use.",
    url: "https://cline.bot/",
    action: "Open Cline",
    tags: ["Open source", "Coding agent", "VS Code"]
  },
  {
    id: "continue",
    name: "Continue",
    category: "Editors & Extensions",
    description: "Customizable AI coding assistant for supported editors, with provider and model configuration options.",
    publisher: "Community",
    integration: "IDE extension",
    connection: "Project link is wired into the catalog; it is not connected to Governor's model router.",
    requirement: "Install in a supported IDE and configure a provider or local model.",
    url: "https://www.continue.dev/",
    action: "Open Continue",
    tags: ["AI coding", "Models", "Open source"]
  },
  {
    id: "google-fonts",
    name: "Google Fonts",
    category: "Editors & Extensions",
    description: "Official font library for choosing typefaces for the Governor Studio interface and generated apps.",
    publisher: "Official",
    integration: "Quick launch",
    connection: "The font library is linked; no font files or CSS have been automatically added to the project.",
    requirement: "Choose a font and implement its stylesheet or package in the relevant app.",
    url: "https://fonts.google.com/",
    action: "Browse fonts",
    tags: ["Typography", "UI", "Design"]
  },
  {
    id: "postman",
    name: "Postman API Platform",
    category: "API & Testing",
    description: "API client and testing workspace for creating requests, environments, and repeatable API checks.",
    publisher: "Official",
    integration: "Quick launch",
    connection: "Official site is linked; collections and credentials are not synced to Governor automatically.",
    requirement: "Use a Postman workspace or export/import a collection for your API tests.",
    url: "https://www.postman.com/",
    action: "Open Postman",
    tags: ["API", "Collections", "Testing"]
  },
  {
    id: "playwright",
    name: "Playwright",
    category: "API & Testing",
    description: "Browser automation framework for repeatable end-to-end checks of the Governor Studio web interface.",
    publisher: "Official",
    integration: "Documentation",
    connection: "Official docs are linked; automated tests still need to be added to the repository and run in CI.",
    requirement: "Add Playwright dependencies, test cases, and a CI workflow before calling the app tested.",
    url: "https://playwright.dev/",
    action: "Open Playwright",
    tags: ["E2E", "Browser tests", "CI"]
  }
];

  {
    id: "gemini-web",
    name: "Google Gemini (web app)",
    category: "AI & Agents",
    description: "Use Google's consumer Gemini assistant directly in the browser with a Google account, without configuring a Gemini API key in Governor.",
    publisher: "Official",
    integration: "Quick launch",
    connection: "Opens the official Gemini website. This is a browser-based sign-in route, not an API connection or an embedded assistant inside Governor.",
    requirement: "Sign in on Gemini's website. Programmatic requests from Governor still require a supported backend integration and credentials.",
    url: "https://gemini.google.com/",
    action: "Open Gemini",
    tags: ["Google", "Sign-in", "No API key", "Web app"]
  },
  {
    id: "chatgpt-web",
    name: "ChatGPT (web app)",
    category: "AI & Agents",
    description: "Open the official ChatGPT website and use the service through its own sign-in flow rather than configuring an API key in Governor.",
    publisher: "Official",
    integration: "Quick launch",
    connection: "Official web shortcut only. It does not connect ChatGPT's API to the Governor editor or share your project automatically.",
    requirement: "Sign in on ChatGPT's website. Embedding model calls in Governor is a separate integration and may require API credentials.",
    url: "https://chatgpt.com/",
    action: "Open ChatGPT",
    tags: ["OpenAI", "Sign-in", "No API key", "Web app"]
  },
const categories: ToolCategory[] = [
  "All",
  "AI & Agents",
  "Flutter & Dart",
  "Editors & Extensions",
  "API & Testing",
  "Deploy & Cloud",
  "Debug & Preview"
];

export default function ToolsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ToolCategory>("All");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [showNeedsSetup, setShowNeedsSetup] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("governor-tools-favorites-v2");
      if (stored) setFavorites(JSON.parse(stored) as string[]);
    } catch {
      // The catalog remains usable if browser storage is unavailable.
    }
  }, []);

  function toggleFavorite(id: string) {
    setFavorites((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      try {
        localStorage.setItem("governor-tools-favorites-v2", JSON.stringify(next));
      } catch {
        // Favorites remain in memory for this session.
      }
      return next;
    });
  }

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return tools.filter((tool) => {
      const matchesCategory = category === "All" || tool.category === category;
      const matchesSaved = !showSavedOnly || favorites.includes(tool.id);
      const matchesSetup = !showNeedsSetup || ["API setup", "Cloud setup", "IDE extension"].includes(tool.integration);
      const searchable = [tool.name, tool.description, tool.category, tool.integration, ...tool.tags].join(" ").toLowerCase();
      return matchesCategory && matchesSaved && matchesSetup && (!needle || searchable.includes(needle));
    });
  }, [query, category, favorites, showSavedOnly, showNeedsSetup]);

  const officialCount = tools.filter((tool) => tool.publisher === "Official").length;
  const setupCount = tools.filter((tool) => ["API setup", "Cloud setup", "IDE extension"].includes(tool.integration)).length;

  return (
    <main className="tools-shell">
      <header className="tools-topbar">
        <Link href="/" className="tools-back"><ArrowLeft size={16}/> Back to Editor</Link>
        <div className="tools-brand"><span className="tools-brand-icon"><Wrench size={18}/></span> Governor Studio <span className="tools-brand-divider">/</span> Tools</div>
        <span className="tools-count"><PackageOpen size={14}/> {tools.length} tools</span>
      </header>

      <section className="tools-hero">
        <div className="tools-eyebrow"><Sparkles size={14}/> EXTENSIONS, AI & DEVELOPER TOOLKIT</div>
        <h1>Tools Marketplace</h1>
        <p>One searchable toolbox for AI assistants, editors, Flutter, API testing, and deployment.</p>
        <div className="tools-trust-note"><CheckCircle2 size={15}/> Official products and community extensions are labeled separately. Each card explains what is linked and what still needs setup.</div>
      </section>

      <section className="tools-connection-summary" aria-label="Integration status summary">
        <div className="tools-connection-stat"><PlugZap size={18}/><strong>{tools.length}</strong><span>launch and setup links wired into this catalog</span></div>
        <div className="tools-connection-stat"><ShieldCheck size={18}/><strong>{officialCount}</strong><span>official product/documentation listings</span></div>
        <div className="tools-connection-stat"><KeyRound size={18}/><strong>{setupCount}</strong><span>items that need account, key, or IDE setup</span></div>
      </section>

      <div className="tools-honest-note"><strong>Important — real connection status:</strong> These tools are connected to Governor Studio's toolbox through working launch/setup links. To use a provider without an API key, open its official web app and sign in there (for example, Gemini or ChatGPT). This does not embed that provider inside Governor. Live programmatic API calls need a backend adapter and the provider's supported credentials or OAuth flow; desktop extensions must be installed in their own IDE.</div>

      <section className="tools-controls">
        <label className="tools-search"><Search size={17}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Perplexity, Google, Cursor, fonts, API, Flutter…"/></label>
        <button className={showSavedOnly ? "tools-saved-toggle active" : "tools-saved-toggle"} onClick={() => setShowSavedOnly((value) => !value)}><Star size={15}/> Saved ({favorites.length})</button>
        <button className={showNeedsSetup ? "tools-saved-toggle active" : "tools-saved-toggle"} onClick={() => setShowNeedsSetup((value) => !value)}><KeyRound size={15}/> Needs setup</button>
      </section>

      <nav className="tools-categories" aria-label="Tool categories">
        {categories.map((item) => <button key={item} className={category === item ? "tools-category active" : "tools-category"} onClick={() => setCategory(item)}>{item === "All" ? <Filter size={14}/> : item === "AI & Agents" ? <Sparkles size={14}/> : item === "Flutter & Dart" ? <Code2 size={14}/> : item === "Editors & Extensions" ? <Puzzle size={14}/> : item === "API & Testing" ? <Activity size={14}/> : item === "Deploy & Cloud" ? <Cloud size={14}/> : <Monitor size={14}/>} {item}</button>)}
      </nav>

      <section className="tools-grid">
        {filtered.map((tool) => (
          <article className="tools-card" key={tool.id}>
            <div className="tools-card-top">
              <div className="tools-card-icon">{tool.category === "AI & Agents" ? <Sparkles size={21}/> : tool.category === "Flutter & Dart" ? <Code2 size={21}/> : tool.category === "Editors & Extensions" ? <Puzzle size={21}/> : tool.category === "API & Testing" ? <Activity size={21}/> : tool.category === "Deploy & Cloud" ? <Rocket size={21}/> : <Monitor size={21}/>}</div>
              <div className="tools-card-title-wrap"><h2>{tool.name}</h2><span className={tool.publisher === "Official" ? "tools-status official" : "tools-status community"}>{tool.publisher}</span></div>
              <button className={favorites.includes(tool.id) ? "tools-star active" : "tools-star"} onClick={() => toggleFavorite(tool.id)} aria-label={favorites.includes(tool.id) ? "Remove saved tool" : "Save tool"} title={favorites.includes(tool.id) ? "Remove saved tool" : "Save tool"}><Star size={17} fill={favorites.includes(tool.id) ? "currentColor" : "none"}/></button>
            </div>
            <p className="tools-description">{tool.description}</p>
            <div className="tools-tags">{tool.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <div className="tools-integration"><BookOpen size={14}/><span><strong>{tool.integration}:</strong> {tool.connection}</span></div>
            <div className="tools-requirement"><KeyRound size={14}/><span>{tool.requirement}</span></div>
            <a className="tools-open-link" href={tool.url} target="_blank" rel="noreferrer">{tool.action}<ExternalLink size={14}/></a>
          </article>
        ))}
        {!filtered.length && <div className="tools-empty"><Search size={25}/><strong>No tools found</strong><span>Try another search or category.</span><button onClick={() => { setQuery(""); setCategory("All"); setShowSavedOnly(false); setShowNeedsSetup(false); }}>Clear filters</button></div>}
      </section>

      <footer className="tools-footer"><Globe size={14}/> Tool descriptions and official destinations are linked from their respective product or publisher sites. Community extensions are not endorsed by Google, Microsoft, or Flutter. Favorites are saved in this browser only.</footer>
    </main>
  );
}
