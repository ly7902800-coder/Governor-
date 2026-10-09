"use client";

import dynamic from "next/dynamic";
import RuntimePreview from "./components/runtime-preview";
import { useEffect, useMemo, useState } from "react";
import {
  Code2, FolderTree, Smartphone, Sparkles, PackageCheck, Play, Save, ShieldCheck,
  FileCode2, TerminalSquare, ExternalLink, Download, RotateCcw,
  CheckCircle2, FileText, Braces, ChevronRight, Cloud, UserRound, Hammer
} from "lucide-react";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const starterFiles: Record<string, string> = {
  "lib/main.dart": `import 'package:flutter/material.dart';

void main() => runApp(const StudioStarterApp());

class StudioStarterApp extends StatelessWidget {
  const StudioStarterApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'My Flutter App',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF7568E8),
        ),
        useMaterial3: true,
      ),
      home: const StarterHomePage(),
    );
  }
}

class StarterHomePage extends StatelessWidget {
  const StarterHomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Flutter App')),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.rocket_launch, size: 56,
                  color: Color(0xFF7568E8)),
              const SizedBox(height: 16),
              Text('Built in Cloud Flutter Studio',
                  style: Theme.of(context).textTheme.titleLarge,
                  textAlign: TextAlign.center),
              const SizedBox(height: 8),
              const Text('Edit this Dart file, then build an Android APK.'),
            ],
          ),
        ),
      ),
    );
  }
}
`,
  "pubspec.yaml": `name: cloud_flutter_studio_app
description: A Flutter application created in Cloud Flutter Studio.
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.4.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.8

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0

flutter:
  uses-material-design: true
`
};

const loginStarter = `import 'package:flutter/material.dart';

void main() => runApp(const LoginStarterApp());

class LoginStarterApp extends StatelessWidget {
  const LoginStarterApp({super.key});

  @override
  Widget build(BuildContext context) => MaterialApp(
    title: 'My App',
    debugShowCheckedModeBanner: false,
    theme: ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF7568E8)),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: const Color(0xFFF4F2FC),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
      ),
    ),
    home: const LoginPage(),
  );
}

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});
  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _hidePassword = true;
  bool _showWelcome = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _showWelcome = true);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Demo only: connect a real authentication backend before release.')),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_showWelcome) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('My App'),
          actions: [IconButton(tooltip: 'Sign out of demo', onPressed: () => setState(() => _showWelcome = false), icon: const Icon(Icons.logout))],
        ),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(mainAxisSize: MainAxisSize.min, children: [
              const Icon(Icons.check_circle_rounded, size: 72, color: Color(0xFF7568E8)),
              const SizedBox(height: 16),
              Text('Welcome!', style: Theme.of(context).textTheme.headlineMedium),
              const SizedBox(height: 8),
              Text(_emailController.text, textAlign: TextAlign.center),
              const SizedBox(height: 12),
              const Text('This is a local UI prototype. It does not create an account or verify a password online.', textAlign: TextAlign.center),
            ]),
          ),
        ),
      );
    }

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 430),
              child: Form(
                key: _formKey,
                child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
                  const SizedBox(height: 24),
                  Container(
                    width: 76, height: 76, alignment: Alignment.center,
                    decoration: BoxDecoration(color: const Color(0xFF7568E8).withOpacity(0.12), borderRadius: BorderRadius.circular(24)),
                    child: const Icon(Icons.lock_outline_rounded, size: 38, color: Color(0xFF7568E8)),
                  ),
                  const SizedBox(height: 28),
                  Text('Welcome back', style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w800)),
                  const SizedBox(height: 8),
                  Text('Sign in to continue to your app.', style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Colors.black54)),
                  const SizedBox(height: 28),
                  TextFormField(
                    controller: _emailController,
                    keyboardType: TextInputType.emailAddress,
                    autofillHints: const [AutofillHints.username, AutofillHints.email],
                    decoration: const InputDecoration(labelText: 'Email', prefixIcon: Icon(Icons.email_outlined)),
                    validator: (value) {
                      final email = value?.trim() ?? '';
                      if (!email.contains('@') || !email.contains('.')) return 'Enter a valid email address';
                      return null;
                    },
                  ),
                  const SizedBox(height: 14),
                  TextFormField(
                    controller: _passwordController,
                    obscureText: _hidePassword,
                    autofillHints: const [AutofillHints.password],
                    decoration: InputDecoration(
                      labelText: 'Password',
                      prefixIcon: const Icon(Icons.lock_outline),
                      suffixIcon: IconButton(
                        onPressed: () => setState(() => _hidePassword = !_hidePassword),
                        icon: Icon(_hidePassword ? Icons.visibility_outlined : Icons.visibility_off_outlined),
                      ),
                    ),
                    validator: (value) => (value ?? '').length < 6 ? 'Use at least 6 characters for this demo' : null,
                  ),
                  Align(
                    alignment: Alignment.centerRight,
                    child: TextButton(
                      onPressed: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Password recovery needs a real authentication backend.'))),
                      child: const Text('Forgot password?'),
                    ),
                  ),
                  const SizedBox(height: 8),
                  FilledButton(
                    onPressed: _submit,
                    style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(54), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))),
                    child: const Text('Sign in'),
                  ),
                  const SizedBox(height: 18),
                  OutlinedButton.icon(
                    onPressed: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Google sign-in needs OAuth/Firebase project setup.'))),
                    icon: const Icon(Icons.g_mobiledata_rounded, size: 28),
                    label: const Text('Continue with Google'),
                    style: OutlinedButton.styleFrom(minimumSize: const Size.fromHeight(52), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))),
                  ),
                  const SizedBox(height: 20),
                  const Text('Prototype only — no API key is needed to preview this screen. Real sign-in requires a secure authentication provider.', textAlign: TextAlign.center, style: TextStyle(fontSize: 12, color: Colors.black54)),
                ]),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
`;

const fileLanguage: Record<string, string> = {
  "lib/main.dart": "dart",
  "pubspec.yaml": "yaml",
};

export default function HomePage() {
  const [files, setFiles] = useState<Record<string, string>>(starterFiles);
  const [activeFile, setActiveFile] = useState("lib/main.dart");
  const [prompt, setPrompt] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("Ready");
  const [saved, setSaved] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [showNewFile, setShowNewFile] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [provider, setProvider] = useState<"auto" | "openrouter" | "openai" | "gemini" | "anthropic">("auto");
  const [aiMessages, setAiMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [importMessage, setImportMessage] = useState("");
  const [providerAvailability, setProviderAvailability] = useState<Record<string, boolean>>({});
  const [cloudProjectId, setCloudProjectId] = useState("");
  const [cloudStatus, setCloudStatus] = useState("");
  const [buildingApk, setBuildingApk] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("governor-editor-files-v1");
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, string>;
        if (parsed && typeof parsed === "object" && parsed["lib/main.dart"]) {
          setFiles({ ...starterFiles, ...parsed });
          setStatus("Restored saved browser files");
        }
      }
      const storedMessages = localStorage.getItem("governor-ai-messages-v1");
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages);
        if (Array.isArray(parsedMessages)) {
          setAiMessages(parsedMessages.filter((item) =>
            item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string"
          ).slice(-40));
        }
      }
      const storedCloudProject = localStorage.getItem("governor-cloud-project-id-v1");
      if (storedCloudProject) setCloudProjectId(storedCloudProject);
      const storedProvider = localStorage.getItem("governor-ai-provider-v1");
      if (storedProvider === "openrouter" || storedProvider === "openai" || storedProvider === "gemini" || storedProvider === "anthropic" || storedProvider === "auto") {
        setProvider(storedProvider);
      }
    } catch {
      setStatus("Browser storage unavailable; editing in memory");
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("governor-editor-files-v1", JSON.stringify(files));
      localStorage.setItem("governor-ai-messages-v1", JSON.stringify(aiMessages.slice(-40)));
      localStorage.setItem("governor-ai-provider-v1", provider);
      setSaved(true);
      setStatus("Autosaved on this device");
    } catch {
      setStatus("Browser storage is full or unavailable; export your project as a backup");
    }
  }, [files, aiMessages, provider, hydrated]);

  useEffect(() => {
    let active = true;
    fetch("/api/ai")
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Provider status unavailable")))
      .then((data) => {
        if (!active || !Array.isArray(data.providers)) return;
        const statusMap: Record<string, boolean> = {};
        for (const item of data.providers) {
          if (item && typeof item.id === "string") statusMap[item.id] = item.configured === true;
        }
        setProviderAvailability(statusMap);
      })
      .catch(() => {
        if (active) setProviderAvailability({});
      });
    return () => { active = false; };
  }, []);

  const code = files[activeFile] ?? "";
  const lineCount = useMemo(() => code.split("\n").length, [code]);
  const fileCount = Object.keys(files).length;

  function updateCode(value: string) {
    setFiles((current) => ({ ...current, [activeFile]: value }));
    setSaved(false);
    setStatus("Unsaved changes");
  }

  function saveLocally() {
    try {
      localStorage.setItem("governor-editor-files-v1", JSON.stringify(files));
      localStorage.setItem("governor-ai-messages-v1", JSON.stringify(aiMessages.slice(-40)));
      localStorage.setItem("governor-ai-provider-v1", provider);
      setSaved(true);
      setStatus("Project and AI conversation saved on this device");
    } catch {
      setStatus("Could not save; export the project JSON as a backup");
    }
  }

  function importProject(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as { files?: Record<string, unknown>; aiMessages?: Array<{ role: string; content: string }>; provider?: string };
        if (!parsed.files || typeof parsed.files !== "object" || typeof parsed.files["lib/main.dart"] !== "string") {
          throw new Error("This file is not a valid Governor project backup.");
        }
        const nextFiles: Record<string, string> = {};
        for (const [path, value] of Object.entries(parsed.files)) {
          if (typeof value !== "string" || !path || path.startsWith("/") || path.split("/").includes("..")) continue;
          nextFiles[path] = value;
        }
        if (!nextFiles["lib/main.dart"]) throw new Error("The backup does not include lib/main.dart.");
        setFiles({ ...starterFiles, ...nextFiles });
        if (parsed.provider === "auto" || parsed.provider === "openrouter" || parsed.provider === "openai" || parsed.provider === "gemini" || parsed.provider === "anthropic") {
          setProvider(parsed.provider);
        }
        if (Array.isArray(parsed.aiMessages)) {
          setAiMessages(parsed.aiMessages.filter((item) =>
            item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string"
          ).slice(-40).map((item) => ({ role: item.role as "user" | "assistant", content: item.content })));
        }
        setActiveFile("lib/main.dart");
        setSaved(false);
        setImportMessage("Project imported. It will autosave in this browser.");
        setStatus("Project backup imported successfully");
      } catch (error) {
        setImportMessage(error instanceof Error ? error.message : "Could not import project.");
      }
    };
    reader.readAsText(file);
  }

  function createFile() {
    const path = newFileName.trim().replace(/^\/+/, "");
    if (!path || path.includes("..") || path.endsWith("/")) {
      setStatus("Enter a valid file path, for example lib/home.dart");
      return;
    }
    if (files[path] !== undefined) {
      setStatus("A file with that name already exists");
      return;
    }
    setFiles((current) => ({ ...current, [path]: "" }));
    setActiveFile(path);
    setNewFileName("");
    setShowNewFile(false);
    setSaved(false);
    setStatus("New file created locally: " + path);
  }

  function removeActiveFile() {
    if (starterFiles[activeFile]) {
      setStatus("Starter files cannot be removed");
      return;
    }
    setFiles((current) => {
      const next = { ...current };
      delete next[activeFile];
      return next;
    });
    setActiveFile("lib/main.dart");
    setSaved(false);
    setStatus("File removed from local workspace");
  }

  function downloadAllFiles() {
    const bundle = JSON.stringify({
      format: "governor-project",
      version: 1,
      exportedAt: new Date().toISOString(),
      files,
      aiMessages: aiMessages.slice(-40),
      provider,
    }, null, 2);
    const url = URL.createObjectURL(new Blob([bundle], { type: "application/json;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "governor-project.json";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setStatus("Exported complete project backup as JSON");
  }

  function downloadFile() {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = activeFile.split("/").pop() || "source.txt";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setStatus("Downloaded " + activeFile);
  }

  function resetFile() {
    if (!starterFiles[activeFile]) {
      setStatus("Reset is available for the starter files only");
      return;
    }
    setFiles((current) => ({ ...current, [activeFile]: starterFiles[activeFile] }));
    setSaved(false);
    setStatus("Starter content restored; save to keep it");
  }

  function createLoginApp() {
    const currentMain = files["lib/main.dart"] ?? starterFiles["lib/main.dart"];
    const nextFiles = { ...files };
    if (currentMain !== loginStarter && !nextFiles["lib/main.backup.dart"]) {
      nextFiles["lib/main.backup.dart"] = currentMain;
    }
    nextFiles["lib/main.dart"] = loginStarter;
    setFiles(nextFiles);
    setActiveFile("lib/main.dart");
    setSaved(false);
    setStatus("Login UI created. Demo only: connect real auth before release.");
  }

  async function saveCloudProject() {
    setCloudStatus("Saving project to cloud…");
    try {
      const response = await fetch("/api/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cloudProjectId || undefined, name: "Governor Flutter Project", files }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Cloud save failed.");
      setCloudProjectId(data.id);
      localStorage.setItem("governor-cloud-project-id-v1", data.id);
      setCloudStatus("Cloud project saved at " + new Date(data.savedAt || Date.now()).toLocaleTimeString());
    } catch (error) {
      setCloudStatus(error instanceof Error ? error.message : "Cloud save failed.");
    }
  }

  async function loadCloudProject() {
    setCloudStatus("Loading cloud projects…");
    try {
      const response = await fetch("/api/workspace");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load cloud projects.");
      let project = data.projects?.find((item: { id: string }) => item.id === cloudProjectId) || data.projects?.[0];
      if (cloudProjectId && !project) {
        const single = await fetch("/api/workspace/" + encodeURIComponent(cloudProjectId));
        const singleData = await single.json();
        if (single.ok) project = singleData.project;
      }
      if (!project) throw new Error("No cloud projects found. Save this workspace first.");
      const projectFiles = typeof project.files === "string" ? JSON.parse(project.files) : project.files;
      if (!projectFiles || typeof projectFiles !== "object" || typeof projectFiles["lib/main.dart"] !== "string") throw new Error("Cloud project contents are invalid.");
      setFiles({ ...starterFiles, ...projectFiles });
      setActiveFile("lib/main.dart");
      setCloudProjectId(project.id);
      localStorage.setItem("governor-cloud-project-id-v1", project.id);
      setCloudStatus("Loaded cloud project: " + (project.name || "Governor Flutter Project"));
    } catch (error) {
      setCloudStatus(error instanceof Error ? error.message : "Cloud load failed.");
    }
  }

  async function buildWorkspaceApk() {
    setBuildingApk(true);
    setCloudStatus("Building APK from current workspace…");
    try {
      const response = await fetch("/api/runtime/apk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "APK build failed.");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "governor-project-release.apk";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setCloudStatus("APK built from the current workspace and downloaded.");
    } catch (error) {
      setCloudStatus(error instanceof Error ? error.message : "APK build failed.");
    } finally {
      setBuildingApk(false);
    }
  }

  async function askAI() {
    if (!prompt.trim()) return;
    setBusy(true);
    setAiResult("");
    try {
      const userMessage = prompt.trim() + "\nPlease focus on the currently open file: " + activeFile;
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMessage,
          code: JSON.stringify(files),
          provider,
          history: aiMessages.slice(-16),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "AI request failed");
      const rawText = typeof data.text === "string" ? data.text : "";
      let displayMessage = rawText || "The provider returned an empty response.";
      let changedPaths: string[] = [];
      try {
        const normalized = rawText.trim().replace(/^\x60{3}(?:json)?\s*/i, "").replace(/\s*\x60{3}$/, "");
        const parsed = JSON.parse(normalized) as { message?: unknown; files?: Record<string, unknown> };
        if (parsed && typeof parsed === "object") {
          if (typeof parsed.message === "string") displayMessage = parsed.message;
          if (parsed.files && typeof parsed.files === "object" && !Array.isArray(parsed.files)) {
            const accepted: Record<string, string> = {};
            for (const [path, contents] of Object.entries(parsed.files)) {
              const safePath = path.trim().replace(/^\/+/, "");
              if (!safePath || safePath.split("/").includes("..") || safePath.endsWith("/") || typeof contents !== "string") continue;
              if (safePath.length > 180 || contents.length > 50000) continue;
              accepted[safePath] = contents;
            }
            changedPaths = Object.keys(accepted);
            if (changedPaths.length) {
              setFiles((current) => ({ ...current, ...accepted }));
              if (accepted[activeFile] !== undefined) {
                setStatus("AI updated " + changedPaths.length + " project file(s); preview refreshed");
              } else {
                setStatus("AI updated " + changedPaths.length + " project file(s)");
              }
              setSaved(false);
            }
          }
        }
      } catch {
        // Older or non-compliant providers may return plain text; show it without applying edits.
      }
      const answer = "Provider: " + (data.provider || "AI") + "\n\n" + displayMessage +
        (changedPaths.length ? "\n\nUpdated files:\n" + changedPaths.map((path) => "• " + path).join("\n") : "");
      setAiResult(answer);
      setAiMessages((current) => [...current, { role: "user" as const, content: userMessage }, { role: "assistant" as const, content: answer }].slice(-40));
      setPrompt("");
      if (!changedPaths.length) setStatus("AI response received; no files were changed");
    } catch (error) {
      setAiResult(error instanceof Error ? error.message : "Could not reach the AI endpoint.");
      setStatus("AI request failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark"><Code2 size={20} /></span><span>Governor Studio</span></div>
        <div className="top-actions">
          <a className="btn" href="/tools"><Sparkles size={14}/> Tools Marketplace</a>
          <a className="btn" href="/account"><UserRound size={14}/> Account</a>
          <button className="btn" onClick={saveCloudProject}><Cloud size={14}/> Cloud save</button>
          <button className="btn" onClick={loadCloudProject}><Cloud size={14}/> Cloud load</button>
          <span className="pill"><span className="dot" /> {hydrated ? (saved ? "Saved locally" : "Unsaved edits") : "Loading workspace"}</span>
          <button className="btn primary" onClick={buildWorkspaceApk} disabled={buildingApk}><Hammer size={15}/> {buildingApk ? "Building APK…" : "Build this project APK"}</button>
          <a className="btn" href="https://github.com/ly7902800-coder/Governor-/actions/workflows/build-apk.yml" target="_blank" rel="noreferrer"><PackageCheck size={15}/> Starter APK <ExternalLink size={12}/></a>
        </div>
      </header>

      <section className="workspace">
        <aside className="panel files-panel">
          <div className="panel-head"><span><FolderTree size={15} style={{display:"inline",marginRight:7,verticalAlign:"middle"}}/>Explorer</span><span className="panel-sub">{fileCount} files</span></div>
          <div className="explorer-actions">
            <button className="btn primary" onClick={createLoginApp} title="Insert a login UI starter (real providers need app configuration)"><ShieldCheck size={14}/> Login UI starter</button>
            <button className="btn" onClick={() => setShowNewFile((value) => !value)}><FileCode2 size={14}/> New file</button>
            <button className="btn" onClick={downloadAllFiles}><Download size={14}/> Backup project</button>
            <label className="btn import-project-btn"><Download size={14}/> Import backup<input type="file" accept="application/json,.json" onChange={(event) => { importProject(event.target.files?.[0]); event.currentTarget.value = ""; }} /></label>
          </div>
          {showNewFile && <form className="new-file-form" onSubmit={(event) => { event.preventDefault(); createFile(); }}>
            <label htmlFor="new-file-name">File path</label>
            <input id="new-file-name" value={newFileName} onChange={(event) => setNewFileName(event.target.value)} placeholder="lib/home.dart" autoComplete="off" />
            <button className="btn primary" type="submit" disabled={!newFileName.trim()}>Create file</button>
          </form>}
          <div className="tree-root"><ChevronRight size={13}/><span>Workspace files</span></div>
          <div className="file-list">
            {Object.keys(files).map((path) => <button key={path} className={activeFile === path ? "file-item active" : "file-item"} onClick={() => setActiveFile(path)} title={path}>{path.endsWith(".dart") ? <Braces size={15}/> : <FileText size={15}/>} {path.split("/").pop()}</button>)}
          </div>
          <div className="side-note"><strong>Workspace</strong><br/>{status}<br/><br/>Local autosave and JSON backup are available. Use Account to sign in, then Cloud save/load for server-backed projects. The platform administrator must configure the database and auth providers.</div>
          {cloudStatus && <div className="side-note" role="status">{cloudStatus}</div>}
          {importMessage && <div className="side-note" role="status">{importMessage}</div>}
          <div className="explorer-actions">
            <button className="btn" onClick={saveLocally}><Save size={14}/> Save workspace</button>
          </div>
        </aside>

        <section className="panel editor-panel">
          <div className="panel-head"><span><Code2 size={15} style={{display:"inline",marginRight:7,verticalAlign:"middle"}}/>Code editor</span><span className="panel-sub">{fileLanguage[activeFile] || "text"} · {lineCount} lines</span></div>
          <div className="editor-tabs">
            {Object.keys(files).map((path) => (
              <button key={path} className={activeFile === path ? "editor-tab active" : "editor-tab"} onClick={() => setActiveFile(path)}>
                {path.endsWith(".dart") ? <Braces size={13}/> : <FileText size={13}/>}
                {path.split("/").pop()}
                {activeFile === path && !saved && <span className="unsaved-dot"/>}
              </button>
            ))}
          </div>
          <div className="editor-toolbar">
            <span className="path-label">{activeFile}</span>
            <div className="toolbar-buttons">
              <button className="btn" onClick={saveLocally} title="Save on this device"><Save size={14}/> Save</button>
              <button className="btn" onClick={downloadFile} title="Download current file"><Download size={14}/> Export</button>
              {!starterFiles[activeFile] && <button className="btn icon-btn" onClick={removeActiveFile} title="Remove current file"><RotateCcw size={14}/></button>}
              <button className="btn icon-btn" onClick={resetFile} title="Restore starter content"><RotateCcw size={14}/></button>
            </div>
          </div>
          <div className="editor-search">
            <input aria-label="Search current file" value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Search in current file…" />
            {searchText && <span>{code.split(searchText).length - 1} matches</span>}
          </div>
          {searchText && <div className="search-results">{code.split("\n").map((line, index) => ({ line, number: index + 1 })).filter((item) => item.line.toLowerCase().includes(searchText.toLowerCase())).slice(0, 15).map((item) => <button key={item.number} onClick={() => setStatus("Found text on line " + item.number)}><span>{item.number}</span>{item.line || "(empty line)"}</button>)}</div>}
          <div className="editor-slot">
            <Editor
              height="100%"
              language={fileLanguage[activeFile] || "plaintext"}
              theme="vs-dark"
              path={activeFile}
              value={code}
              onChange={(value) => updateCode(value ?? "")}
              options={{
                fontSize: 13,
                minimap: { enabled: true, scale: 1 },
                wordWrap: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 14, bottom: 14 },
                tabSize: 2,
                lineNumbers: "on",
                renderLineHighlight: "all",
                bracketPairColorization: { enabled: true },
                quickSuggestions: true,
                suggestOnTriggerCharacters: true,
                folding: true,
                smoothScrolling: true,
              }}
            />
          </div>
          <div className="statusbar">
            <span><TerminalSquare size={13}/>{status}</span>
            <span>{fileLanguage[activeFile] || "Plain Text"} · UTF-8 · LF</span>
            <span>{lineCount} lines</span>
          </div>
        </section>

        <section className="panel preview-panel">
          <div className="panel-head"><span><Smartphone size={15} style={{display:"inline",marginRight:7,verticalAlign:"middle"}}/>Live app preview</span><span className="panel-sub">Instant draft</span></div>
          <RuntimePreview files={files} code={code} fileName={activeFile} />
          <div className="ai-box">
            <div style={{fontWeight:700,fontSize:12,display:"flex",alignItems:"center",gap:7}}><Sparkles size={15}/> AI code assistant</div>
            <label className="ai-provider-label">AI provider
              <select value={provider} onChange={(event) => setProvider(event.target.value as typeof provider)} aria-label="AI provider">
                <option value="auto">Auto (try configured providers)</option>
                <option value="openrouter">OpenRouter {providerAvailability.openrouter ? "· connected" : "· not configured"}</option>
                <option value="openai">OpenAI {providerAvailability.openai ? "· connected" : "· not configured"}</option>
                <option value="gemini">Google Gemini {providerAvailability.gemini ? "· connected" : "· not configured"}</option>
                <option value="anthropic">Anthropic Claude {providerAvailability.anthropic ? "· connected" : "· not configured"}</option>
              </select>
            </label>
            <p className="ai-context-note">Switching providers keeps your files and conversation. A provider must be configured securely on the server before requests can work.</p>
            <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask AI to explain or improve the open file…" />
            <button className="btn primary" onClick={askAI} disabled={busy || !prompt.trim()}>{busy ? "Thinking…" : "Ask AI about this file"}</button>
            {aiMessages.length > 0 && <div className="ai-history">{aiMessages.slice(-8).map((message, index) => <div key={index} className={"ai-history-message " + message.role}><strong>{message.role === "user" ? "You" : "AI"}</strong><span>{message.content}</span></div>)}</div>}
            {aiResult && <div className="ai-result">{aiResult}</div>}
          </div>
        </section>
      </section>
      <div className="footer-note">Governor Studio · Local autosave and JSON backup · Cloud project APIs · AI code edits · Real Flutter runtime preview and per-project APK build are available when FLUTTER_RUNTIME_URL is deployed. Accounts and OAuth require administrator configuration.</div>
    </main>
  );
}
