"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Code2, FolderTree, Smartphone, Sparkles, PackageCheck, Play, Save, FileCode2, TerminalSquare, ExternalLink } from "lucide-react";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const starterCode = `import 'package:flutter/material.dart';

void main() => runApp(const StudioStarterApp());

class StudioStarterApp extends StatelessWidget {
  const StudioStarterApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Studio Starter',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF7568E8)),
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
              const Icon(Icons.rocket_launch, size: 56, color: Color(0xFF7568E8)),
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
`;

export default function HomePage() {
  const [code, setCode] = useState(starterCode);
  const [prompt, setPrompt] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [busy, setBusy] = useState(false);
  const [activeFile, setActiveFile] = useState("main.dart");
  const [status, setStatus] = useState("Local editor ready");

  const lineCount = useMemo(() => code.split("\n").length, [code]);

  async function askAI() {
    if (!prompt.trim()) return;
    setBusy(true);
    setAiResult("");
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, code, provider: "auto" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "AI request failed");
      setAiResult(data.text || "The provider returned an empty response.");
    } catch (error) {
      setAiResult(error instanceof Error ? error.message : "Could not reach the AI endpoint.");
    } finally {
      setBusy(false);
    }
  }

  function saveLocally() {
    try {
      sessionStorage.setItem("cfs-main-dart", code);
      setStatus("Saved in this browser session");
    } catch {
      setStatus("Editor changes are in memory only");
    }
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark"><Code2 size={20} /></span><span>Cloud Flutter Studio</span></div>
        <div className="top-actions">
          <span className="pill"><span className="dot" /> Foundation build</span>
          <a className="btn primary" href="https://github.com/ly7902800-coder/Governor-/actions/workflows/build-apk.yml" target="_blank" rel="noreferrer"><PackageCheck size={15}/> Build APK <ExternalLink size={12}/></a>
        </div>
      </header>

      <section className="workspace">
        <aside className="panel files-panel">
          <div className="panel-head"><span><FolderTree size={15} style={{display:"inline",marginRight:7,verticalAlign:"middle"}}/>Project files</span><span className="panel-sub">starter</span></div>
          <div className="file-list">
            <button className={activeFile === "main.dart" ? "file-item active" : "file-item"} onClick={() => setActiveFile("main.dart")}><FileCode2 size={15}/> lib/main.dart</button>
            <button className={activeFile === "pubspec.yaml" ? "file-item active" : "file-item"} onClick={() => setActiveFile("pubspec.yaml")}><FileCode2 size={15}/> pubspec.yaml</button>
          </div>
          <div className="side-note"><strong>Workspace status</strong><br/>{status}<br/><br/>The editor currently edits the starter source in this browser. Repository-backed saving is the next integration step.</div>
        </aside>

        <section className="panel editor-panel">
          <div className="panel-head"><span><Code2 size={15} style={{display:"inline",marginRight:7,verticalAlign:"middle"}}/>Code editor</span><span className="panel-sub">Dart · {lineCount} lines</span></div>
          <div className="editor-toolbar"><span>{activeFile === "main.dart" ? "lib/main.dart" : "flutter_template/pubspec.yaml"}</span><div style={{display:"flex",gap:7}}><button className="btn" onClick={saveLocally}><Save size={14}/> Save</button></div></div>
          <div className="editor-slot">
            {activeFile === "main.dart" ? <Editor height="100%" defaultLanguage="dart" language="dart" theme="vs-dark" value={code} onChange={(value) => {setCode(value ?? "");setStatus("Unsaved changes");}} options={{fontSize:13,minimap:{enabled:false},wordWrap:"on",scrollBeyondLastLine:false,automaticLayout:true,padding:{top:14},tabSize:2}} /> : <div style={{padding:18,color:"#aab2c6",fontSize:12,lineHeight:1.8}}>pubspec.yaml is included in the Flutter starter project. The repository-backed multi-file editor is not connected yet.</div>}
          </div>
          <div className="editor-toolbar"><span><TerminalSquare size={13} style={{display:"inline",marginRight:6,verticalAlign:"middle"}}/>{status}</span><span>{lineCount} lines</span></div>
        </section>

        <section className="panel preview-panel">
          <div className="panel-head"><span><Smartphone size={15} style={{display:"inline",marginRight:7,verticalAlign:"middle"}}/>Preview</span><span className="panel-sub">runtime pending</span></div>
          <div className="preview-body">
            <div className="phone">
              <div className="phone-status"><span>9:41</span><span>●●● ▰</span></div>
              <div className="phone-screen">
                <span className="demo-label">FLUTTER PROJECT</span>
                <div className="demo-title">Your app<br/>starts here.</div>
                <div className="demo-copy">This is a workspace illustration, not a running Flutter app. Connect the cloud Flutter Web runtime to enable true live preview and hot reload.</div>
                <div className="demo-card"><div style={{fontWeight:800,fontSize:12,marginBottom:5}}>Starter project</div><div style={{fontSize:10,color:"#747b8d"}}>lib/main.dart · Material 3</div></div>
                <div className="demo-button">Preview runtime not connected</div>
              </div>
            </div>
            <div className="warning"><strong><Play size={13} style={{display:"inline",marginRight:5,verticalAlign:"middle"}}/>Live preview setup required</strong>The APK workflow builds the included Flutter project. A persistent Flutter Web runner must be deployed separately for genuine hot reload in this panel.</div>
          </div>
          <div className="ai-box">
            <div style={{fontWeight:700,fontSize:12,display:"flex",alignItems:"center",gap:7}}><Sparkles size={15}/> AI code assistant</div>
            <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask for a Dart change or code explanation…" />
            <button className="btn primary" onClick={askAI} disabled={busy || !prompt.trim()}>{busy ? "Thinking…" : "Ask configured AI"}</button>
            {aiResult && <div className="ai-result">{aiResult}</div>}
          </div>
        </section>
      </section>
      <div className="footer-note">Cloud Flutter Studio · Build runs on GitHub Actions. Do not commit API keys. The current browser editor is a foundation, not yet a repository-synced IDE.</div>
    </main>
  );
}
