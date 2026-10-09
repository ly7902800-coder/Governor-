"use client";

import dynamic from "next/dynamic";
import LivePreview from "./components/live-preview";
import { useEffect, useMemo, useState } from "react";
import {
  Code2, FolderTree, Smartphone, Sparkles, PackageCheck, Play, Save, ShieldCheck,
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
    const bundle = Object.entries(files).map(([path, value]) => "// ===== " + path + " =====\n" + value).join("\n\n");
    const url = URL.createObjectURL(new Blob([bundle], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "governor-workspace.txt";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setStatus("Exported all workspace files into one text file");
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
          <a className="btn" href="/tools"><Sparkles size={14}/> Tools Marketplace</a>
          <span className="pill"><span className="dot" /> {hydrated ? (saved ? "Saved locally" : "Unsaved edits") : "Loading workspace"}</span>
          <a className="btn primary" href="https://github.com/ly7902800-coder/Governor-/actions/workflows/build-apk.yml" target="_blank" rel="noreferrer"><PackageCheck size={15}/> Build APK <ExternalLink size={12}/></a>
        </div>
      </header>

      <section className="workspace">
        <aside className="panel files-panel">
          <div className="panel-head"><span><FolderTree size={15} style={{display:"inline",marginRight:7,verticalAlign:"middle"}}/>Explorer</span><span className="panel-sub">{fileCount} files</span></div>
"use client";

import dynamic from "next/dynamic";
import LivePreview from "./components/live-preview";
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

const loginStarter = "import 'package:flutter/material.dart';\n\nvoid main() => runApp(const LoginStarterApp());\n\nclass LoginStarterApp extends StatelessWidget {\n  const LoginStarterApp({super.key});\n\n  @override\n  Widget build(BuildContext context) => MaterialApp(\n    title: 'My App',\n    debugShowCheckedModeBanner: false,\n    theme: ThemeData(\n      useMaterial3: true,\n      colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF7568E8)),\n      inputDecorationTheme: InputDecorationTheme(\n        filled: true,\n        fillColor: const Color(0xFFF4F2FC),\n        border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),\n      ),\n    ),\n    home: const LoginPage(),\n  );\n}\n\nclass LoginPage extends StatefulWidget {\n  const LoginPage({super.key});\n  @override\n  State<LoginPage> createState() => _LoginPageState();\n}\n\nclass _LoginPageState extends State<LoginPage> {\n  final _formKey = GlobalKey<FormState>();\n  final _emailController = TextEditingController();\n  final _passwordController = TextEditingController();\n  bool _hidePassword = true;\n  bool _showWelcome = false;\n\n  @override\n  void dispose() {\n    _emailController.dispose();\n    _passwordController.dispose();\n    super.dispose();\n  }\n\n  void _submit() {\n    if (!_formKey.currentState!.validate()) return;\n    setState(() => _showWelcome = true);\n    ScaffoldMessenger.of(context).showSnackBar(\n      const SnackBar(content: Text('Demo only: connect a real authentication backend before release.')),\n    );\n  }\n\n  @override\n  Widget build(BuildContext context) {\n    if (_showWelcome) {\n      return Scaffold(\n        appBar: AppBar(\n          title: const Text('My App'),\n          actions: [IconButton(tooltip: 'Sign out of demo', onPressed: () => setState(() => _showWelcome = false), icon: const Icon(Icons.logout))],\n        ),\n        body: Center(\n          child: Padding(\n            padding: const EdgeInsets.all(24),\n            child: Column(mainAxisSize: MainAxisSize.min, children: [\n              const Icon(Icons.check_circle_rounded, size: 72, color: Color(0xFF7568E8)),\n              const SizedBox(height: 16),\n              Text('Welcome!', style: Theme.of(context).textTheme.headlineMedium),\n              const SizedBox(height: 8),\n              Text(_emailController.text, textAlign: TextAlign.center),\n              const SizedBox(height: 12),\n              const Text('This is a local UI prototype. It does not create an account or verify a password online.', textAlign: TextAlign.center),\n            ]),\n          ),\n        ),\n      );\n    }\n\n    return Scaffold(\n      body: SafeArea(\n        child: Center(\n          child: SingleChildScrollView(\n            padding: const EdgeInsets.all(24),\n            child: ConstrainedBox(\n              constraints: const BoxConstraints(maxWidth: 430),\n              child: Form(\n                key: _formKey,\n                child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [\n                  const SizedBox(height: 24),\n                  Container(\n                    width: 76, height: 76, alignment: Alignment.center,\n                    decoration: BoxDecoration(color: const Color(0xFF7568E8).withOpacity(0.12), borderRadius: BorderRadius.circular(24)),\n                    child: const Icon(Icons.lock_outline_rounded, size: 38, color: Color(0xFF7568E8)),\n                  ),\n                  const SizedBox(height: 28),\n                  Text('Welcome back', style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w800)),\n                  const SizedBox(height: 8),\n                  Text('Sign in to continue to your app.', style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Colors.black54)),\n                  const SizedBox(height: 28),\n                  TextFormField(\n                    controller: _emailController,\n                    keyboardType: TextInputType.emailAddress,\n                    autofillHints: const [AutofillHints.username, AutofillHints.email],\n                    decoration: const InputDecoration(labelText: 'Email', prefixIcon: Icon(Icons.email_outlined)),\n                    validator: (value) {\n                      final email = value?.trim() ?? '';\n                      if (!email.contains('@') || !email.contains('.')) return 'Enter a valid email address';\n                      return null;\n                    },\n                  ),\n                  const SizedBox(height: 14),\n                  TextFormField(\n                    controller: _passwordController,\n                    obscureText: _hidePassword,\n                    autofillHints: const [AutofillHints.password],\n                    decoration: InputDecoration(\n                      labelText: 'Password',\n                      prefixIcon: const Icon(Icons.lock_outline),\n                      suffixIcon: IconButton(\n                        onPressed: () => setState(() => _hidePassword = !_hidePassword),\n                        icon: Icon(_hidePassword ? Icons.visibility_outlined : Icons.visibility_off_outlined),\n                      ),\n                    ),\n                    validator: (value) => (value ?? '').length < 6 ? 'Use at least 6 characters for this demo' : null,\n                  ),\n                  Align(\n                    alignment: Alignment.centerRight,\n                    child: TextButton(\n                      onPressed: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Password recovery needs a real authentication backend.'))),\n                      child: const Text('Forgot password?'),\n                    ),\n                  ),\n                  const SizedBox(height: 8),\n                  FilledButton(\n                    onPressed: _submit,\n                    style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(54), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))),\n                    child: const Text('Sign in'),\n                  ),\n                  const SizedBox(height: 18),\n                  OutlinedButton.icon(\n                    onPressed: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Google sign-in needs OAuth/Firebase project setup.'))),\n                    icon: const Icon(Icons.g_mobiledata_rounded, size: 28),\n                    label: const Text('Continue with Google'),\n                    style: OutlinedButton.styleFrom(minimumSize: const Size.fromHeight(52), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))),\n                  ),\n                  const SizedBox(height: 20),\n                  const Text('Prototype only — no API key is needed to preview this screen. Real sign-in requires a secure authentication provider.', textAlign: TextAlign.center, style: TextStyle(fontSize: 12, color: Colors.black54)),\n                ]),\n              ),\n            ),\n          ),\n        ),\n      ),\n    );\n  }\n}\n";

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
    const bundle = Object.entries(files).map(([path, value]) => "// ===== " + path + " =====\n" + value).join("\n\n");
    const url = URL.createObjectURL(new Blob([bundle], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "governor-workspace.txt";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setStatus("Exported all workspace files into one text file");
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
          <a className="btn" href="/tools"><Sparkles size={14}/> Tools Marketplace</a>
          <span className="pill"><span className="dot" /> {hydrated ? (saved ? "Saved locally" : "Unsaved edits") : "Loading workspace"}</span>
          <a className="btn primary" href="https://github.com/ly7902800-coder/Governor-/actions/workflows/build-apk.yml" target="_blank" rel="noreferrer"><PackageCheck size={15}/> Build APK <ExternalLink size={12}/></a>
        </div>
      </header>

      <section className="workspace">
        <aside className="panel files-panel">
          <div className="panel-head"><span><FolderTree size={15} style={{display:"inline",marginRight:7,verticalAlign:"middle"}}/>Explorer</span><span className="panel-sub">{fileCount} files</span></div>
          <div className="explorer-actions">
            <button className="btn primary" onClick={createLoginApp} title="Create a no-key login UI prototype"><ShieldCheck size={14}/> Login starter</button>
            <button className="btn" onClick={() => setShowNewFile((value) => !value)}><FileCode2 size={14}/> New file</button>
            <button className="btn" onClick={downloadAllFiles}><Download size={14}/> Export all</button>
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
          <div className="side-note"><strong>Workspace</strong><br/>{status}<br/><br/>Files are saved in this browser only. They are not yet synchronized back to GitHub automatically. Login starter creates a preview-only form; it does not authenticate real accounts.</div>
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
          <LivePreview code={code} fileName={activeFile} />
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
