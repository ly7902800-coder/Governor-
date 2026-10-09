"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import {
  Code2, FolderTree, Smartphone, Sparkles, PackageCheck, Play, Save,
  FileCode2, TerminalSquare, ExternalLink, Download, RotateCcw,
  CheckCircle2, FileText, Braces, ChevronRight
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
    } catch {
      setStatus("Browser storage unavailable; editing in memory");
    }
    setHydrated(true);
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
      setSaved(true);
      setStatus("Saved on this device");
    } catch {
      setStatus("Could not save to browser storage");
    }
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

  async function askAI() {
    if (!prompt.trim()) return;
    setBusy(true);
    setAiResult("");
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim() + "\nPlease focus on the currently open file: " + activeFile,
          code,
          provider: "auto",
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "AI request failed");
      setAiResult("Provider: " + (data.provider || "AI") + "\n\n" + (data.text || "The provider returned an empty response."));
      setStatus("AI response received");
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
          <span className="pill"><span className="dot" /> {hydrated ? (saved ? "Saved locally" : "Unsaved edits") : "Loading workspace"}</span>
          <a className="btn primary" href="https://github.com/ly7902800-coder/Governor-/actions/workflows/build-apk.yml" target="_blank" rel="noreferrer"><PackageCheck size={15}/> Build APK <ExternalLink size={12}/></a>
        </div>
      </header>

      <section className="workspace">
        <aside className="panel files-panel">
          <div className="panel-head"><span><FolderTree size={15} style={{display:"inline",marginRight:7,verticalAlign:"middle"}}/>Explorer</span><span className="panel-sub">{fileCount} files</span></div>
          <div className="tree-root"><ChevronRight size={13}/><span>flutter_template</span></div>
          <div className="file-list">
            <button className={activeFile === "lib/main.dart" ? "file-item active" : "file-item"} onClick={() => setActiveFile("lib/main.dart")}><Braces size={15}/> main.dart</button>
            <button className={activeFile === "pubspec.yaml" ? "file-item active" : "file-item"} onClick={() => setActiveFile("pubspec.yaml")}><FileText size={15}/> pubspec.yaml</button>
          </div>
          <div className="side-note"><strong>Workspace</strong><br/>{status}<br/><br/>Files are saved in this browser only. They are not yet synchronized back to GitHub automatically.</div>
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
              <button className="btn icon-btn" onClick={resetFile} title="Restore starter content"><RotateCcw size={14}/></button>
            </div>
          </div>
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
          <div className="panel-head"><span><Smartphone size={15} style={{display:"inline",marginRight:7,verticalAlign:"middle"}}/>App preview</span><span className="panel-sub">Runtime pending</span></div>
          <div className="preview-body">
            <div className="phone">
              <div className="phone-status"><span>9:41</span><span>●●● ▰</span></div>
              <div className="phone-screen">
                <span className="demo-label">FLUTTER PROJECT</span>
                <div className="demo-title">Your app<br/>starts here.</div>
                <div className="demo-copy">Edit Dart code in the editor, save your source, then build an Android APK with the cloud workflow.</div>
                <div className="demo-card"><div style={{fontWeight:800,fontSize:12,marginBottom:5}}>Flutter starter</div><div style={{fontSize:10,color:"#747b8d"}}>{activeFile} · {lineCount} lines</div></div>
                <div className="demo-button"><Play size={12} style={{display:"inline",marginRight:5,verticalAlign:"middle"}}/>APK build workflow</div>
              </div>
            </div>
            <div className="warning"><strong><Play size={13} style={{display:"inline",marginRight:5,verticalAlign:"middle"}}/>Live preview not connected</strong>This phone is a workspace preview, not a running Flutter app. A Flutter Web runtime is still needed for real hot reload.</div>
          </div>
          <div className="ai-box">
            <div style={{fontWeight:700,fontSize:12,display:"flex",alignItems:"center",gap:7}}><Sparkles size={15}/> AI code assistant</div>
            <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask AI to explain or improve the open file…" />
            <button className="btn primary" onClick={askAI} disabled={busy || !prompt.trim()}>{busy ? "Thinking…" : "Ask AI about this file"}</button>
            {aiResult && <div className="ai-result">{aiResult}</div>}
          </div>
        </section>
      </section>
      <div className="footer-note">Governor Studio · Monaco editor · Local browser saving · APK builds run through GitHub Actions. API keys must stay in server-side environment variables.</div>
    </main>
  );
}
