"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ExternalLink, Search, Wrench, Sparkles, Code2, Puzzle,
  Activity, BookOpen, Star, CheckCircle2, Filter, Globe, PackageOpen
} from "lucide-react";

type ToolCategory = "All" | "AI & Agents" | "Flutter & Dart" | "Skills & Plugins" | "Debug & Preview";

type ToolItem = {
  id: string;
  name: string;
  category: Exclude<ToolCategory, "All">;
  description: string;
  status: "Official" | "Community";
  integration: string;
  url: string;
  action: string;
  tags: string[];
};

const tools: ToolItem[] = [
  {
    id: "antigravity",
    name: "Google Antigravity",
    category: "AI & Agents",
    description: "Google's agentic development environment, with coding agents, browser workflows, plans, and reviewable artifacts.",
    status: "Official",
    integration: "External platform link. Governor Studio does not silently install or control the desktop IDE.",
    url: "https://antigravity.google/",
    action: "Open Antigravity",
    tags: ["Google", "AI agent", "IDE", "Browser agent"]
  },
  {
    id: "google-flutter-plugin",
    name: "Dart & Flutter for Antigravity",
    category: "Flutter & Dart",
    description: "Google's curated Dart and Flutter integration for Antigravity, including workflow skills and a Dart MCP server.",
    status: "Official",
    integration: "Enable from Antigravity Settings → Customizations → Build with Google Plugins. This website cannot install it into your desktop environment.",
    url: "https://docs.flutter.dev/ai/get-started",
    action: "Official setup guide",
    tags: ["Flutter", "Dart", "MCP", "Skills"]
  },
  {
    id: "skill-manager",
    name: "Skill Manager for Google Antigravity",
    category: "Skills & Plugins",
    description: "Community VS Code extension for browsing, searching, batch-installing, and managing Antigravity skills from GitHub repositories.",
    status: "Community",
    integration: "Install in a compatible VS Code / Antigravity environment through its publisher listing; not installed into Governor Studio itself.",
    url: "https://marketplace.visualstudio.com/items?itemName=yxshee.skill-manager-antigravity",
    action: "Open Marketplace",
    tags: ["Skills", "Search", "Batch install", "GitHub"]
  },
  {
    id: "antigravity-skill-manager",
    name: "Antigravity Skill Manager",
    category: "Skills & Plugins",
    description: "A separate community extension for managing local Antigravity skills and discovering remote skills from GitHub.",
    status: "Community",
    integration: "Separate extension listing. Review publisher, permissions, and source before installing.",
    url: "https://marketplace.visualstudio.com/items?itemName=ryanhutto.antigravity-skill-manager",
    action: "Open Marketplace",
    tags: ["Skills", "GitHub", "Templates", "VS Code"]
  },
  {
    id: "flutter-devtools",
    name: "Flutter & Dart DevTools",
    category: "Debug & Preview",
    description: "Official suite for widget inspection, performance profiling, CPU and memory analysis, network inspection, and source debugging.",
    status: "Official",
    integration: "Runs with a real Flutter/Dart application and SDK; this catalog links to the official documentation.",
    url: "https://docs.flutter.dev/tools/devtools",
    action: "Open documentation",
    tags: ["Inspector", "Performance", "Memory", "Network"]
  },
  {
    id: "flutter-widget-previewer",
    name: "Flutter Widget Previewer",
    category: "Debug & Preview",
    description: "Official Flutter tooling for previewing individual widgets separately from the full application.",
    status: "Official",
    integration: "Requires the supported Flutter development workflow; not the same as a full-device emulator.",
    url: "https://docs.flutter.dev/tools",
    action: "Explore Flutter tools",
    tags: ["Widgets", "Preview", "Flutter"]
  },
  {
    id: "flutter-editors",
    name: "Flutter Editor Support",
    category: "Flutter & Dart",
    description: "Official guidance for editor integrations, code completion, syntax highlighting, refactoring assists, and debugging.",
    status: "Official",
    integration: "Use the guide to configure a supported editor and Flutter SDK.",
    url: "https://docs.flutter.dev/tools/editors",
    action: "View editor guide",
    tags: ["VS Code", "Android Studio", "Dart"]
  },
  {
    id: "antigravity-plugins",
    name: "Antigravity Plugins & Skills",
    category: "Skills & Plugins",
    description: "Official documentation for plugin bundles that can include skills, rules, MCP servers, and hooks.",
    status: "Official",
    integration: "Documents the actual Antigravity plugin structure and supported installation locations.",
    url: "https://www.antigravity.google/docs/ide-plugins",
    action: "Read plugin docs",
    tags: ["Plugins", "MCP", "Rules", "Hooks"]
  },
  {
    id: "antigravity-build-google",
    name: "Build with Google",
    category: "AI & Agents",
    description: "Official catalog of curated Google technology bundles, including integrations for Flutter, Android, Firebase, and web workflows.",
    status: "Official",
    integration: "Enable available bundles inside Antigravity Customizations; availability can depend on the Antigravity version.",
    url: "https://www.antigravity.google/docs/build-with-google/",
    action: "Browse Google bundles",
    tags: ["Google", "Android", "Firebase", "Flutter"]
  },
  {
    id: "dartpad",
    name: "DartPad",
    category: "Debug & Preview",
    description: "Official online playground for trying Dart and supported single-file Flutter examples without setting up a local SDK.",
    status: "Official",
    integration: "Best for small examples; it is not a replacement for a full Flutter project build or APK pipeline.",
    url: "https://dartpad.dev/",
    action: "Open playground",
    tags: ["Online", "Dart", "Examples"]
  }
];

const categories: ToolCategory[] = ["All", "AI & Agents", "Flutter & Dart", "Skills & Plugins", "Debug & Preview"];

export default function ToolsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ToolCategory>("All");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("governor-tools-favorites-v1");
      if (stored) setFavorites(JSON.parse(stored) as string[]);
    } catch {
      // The catalog remains usable if browser storage is unavailable.
    }
  }, []);

  function toggleFavorite(id: string) {
    setFavorites((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      try {
        localStorage.setItem("governor-tools-favorites-v1", JSON.stringify(next));
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
      const searchable = [tool.name, tool.description, tool.category, ...tool.tags].join(" ").toLowerCase();
      return matchesCategory && matchesSaved && (!needle || searchable.includes(needle));
    });
  }, [query, category, favorites, showSavedOnly]);

  return (
    <main className="tools-shell">
      <header className="tools-topbar">
        <Link href="/" className="tools-back"><ArrowLeft size={16}/> Back to Editor</Link>
        <div className="tools-brand"><span className="tools-brand-icon"><Wrench size={18}/></span> Governor Studio <span className="tools-brand-divider">/</span> Tools</div>
        <span className="tools-count"><PackageOpen size={14}/> {tools.length} verified listings</span>
      </header>

      <section className="tools-hero">
        <div className="tools-eyebrow"><Sparkles size={14}/> EXTENSIONS & DEVELOPER TOOLKIT</div>
        <h1>Tools Marketplace</h1>
        <p>Discover real Flutter, Dart, Google Antigravity, skills, plugins, debugging, and preview tools in one place.</p>
        <div className="tools-trust-note"><CheckCircle2 size={15}/> Official products and community extensions are clearly labeled. External tools open at their source.</div>
      </section>

      <section className="tools-controls">
        <label className="tools-search"><Search size={17}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tools, skills, Flutter, MCP…" /></label>
        <button className={showSavedOnly ? "tools-saved-toggle active" : "tools-saved-toggle"} onClick={() => setShowSavedOnly((value) => !value)}><Star size={15}/> Saved ({favorites.length})</button>
      </section>

      <nav className="tools-categories" aria-label="Tool categories">
        {categories.map((item) => <button key={item} className={category === item ? "tools-category active" : "tools-category"} onClick={() => setCategory(item)}>{item === "All" ? <Filter size={14}/> : item === "AI & Agents" ? <Sparkles size={14}/> : item === "Flutter & Dart" ? <Code2 size={14}/> : item === "Skills & Plugins" ? <Puzzle size={14}/> : <Activity size={14}/>} {item}</button>)}
      </nav>

      <section className="tools-grid">
        {filtered.map((tool) => (
          <article className="tools-card" key={tool.id}>
            <div className="tools-card-top">
              <div className="tools-card-icon">{tool.category === "AI & Agents" ? <Sparkles size={21}/> : tool.category === "Flutter & Dart" ? <Code2 size={21}/> : tool.category === "Skills & Plugins" ? <Puzzle size={21}/> : <Activity size={21}/>}</div>
              <div className="tools-card-title-wrap"><h2>{tool.name}</h2><span className={tool.status === "Official" ? "tools-status official" : "tools-status community"}>{tool.status}</span></div>
              <button className={favorites.includes(tool.id) ? "tools-star active" : "tools-star"} onClick={() => toggleFavorite(tool.id)} aria-label={favorites.includes(tool.id) ? "Remove saved tool" : "Save tool"} title={favorites.includes(tool.id) ? "Remove saved tool" : "Save tool"}><Star size={17} fill={favorites.includes(tool.id) ? "currentColor" : "none"}/></button>
            </div>
            <p className="tools-description">{tool.description}</p>
            <div className="tools-tags">{tool.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <div className="tools-integration"><BookOpen size={14}/><span>{tool.integration}</span></div>
            <a className="tools-open-link" href={tool.url} target="_blank" rel="noreferrer">{tool.action}<ExternalLink size={14}/></a>
          </article>
        ))}
        {!filtered.length && <div className="tools-empty"><Search size={25}/><strong>No tools found</strong><span>Try another search or category.</span><button onClick={() => { setQuery(""); setCategory("All"); setShowSavedOnly(false); }}>Clear filters</button></div>}
      </section>

      <footer className="tools-footer"><Globe size={14}/> Links and descriptions were checked against official documentation or publisher listings. Community tools are not endorsed by Google or Flutter. Favorites are saved only in this browser; the catalog does not install software onto your device.</footer>
    </main>
  );
}
