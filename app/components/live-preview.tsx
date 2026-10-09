"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Smartphone, Tablet, Monitor, RotateCw, Sun, Moon, ZoomIn, ZoomOut, AlertTriangle, Zap, RefreshCw } from "lucide-react";

type Device = "phone" | "tablet" | "web";

function dartStrings(source: string): string[] {
  const values: string[] = [];
  const pattern = /Text\s*\(\s*(?:const\s+)?['"]((?:\\\\.|[^'"])*)['"]/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(source)) !== null && values.length < 24) {
    values.push(match[1].replace(/\\n/g, " ").replace(/\\'/g, "'").replace(/\\"/g, '"'));
  }
  return values;
}

function firstMatch(source: string, patterns: RegExp[], fallback: string): string {
  for (const pattern of patterns) {
    const match = pattern.exec(source);
    if (match?.[1]) return match[1].replace(/\\n/g, " ").replace(/\\'/g, "'").replace(/\\"/g, '"');
  }
  return fallback;
}

export default function LivePreview({ code, fileName }: { code: string; fileName: string }) {
  const [device, setDevice] = useState<Device>("phone");
  const [dark, setDark] = useState(false);
  const [landscape, setLandscape] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [refreshKey, setRefreshKey] = useState(0);

  const parsed = useMemo(() => {
    const title = firstMatch(code, [
      /AppBar\s*\(\s*title\s*:\s*(?:const\s+)?Text\s*\(\s*['"]([^'"]+)/,
      /title\s*:\s*['"]([^'"]+)/,
      /MaterialApp\s*\(\s*title\s*:\s*['"]([^'"]+)/,
    ], "Your Flutter app");
    const strings = dartStrings(code);
    const labels = strings.filter((value) => value.trim() && value !== title);
    const seed = /0xFF([0-9A-Fa-f]{6})/.exec(code)?.[1];
    const accent = seed ? "#" + seed : "#7568e8";
    const isScaffold = /Scaffold\s*\(/.test(code);
    const hasAppBar = /AppBar\s*\(/.test(code);
    const hasColumn = /Column\s*\(/.test(code);
    const hasRow = /Row\s*\(/.test(code);
    const hasList = /ListView\s*\(/.test(code);
    const hasButton = /ElevatedButton\s*\(|FilledButton\s*\(|OutlinedButton\s*\(/.test(code);
    const hasImage = /Image\.(network|asset|memory|file)\s*\(/.test(code);
    const hasInput = /TextField\s*\(/.test(code);
    const hasCard = /Card\s*\(/.test(code);
    const hasError = code.trim().length === 0;
    return { title, labels, accent, isScaffold, hasAppBar, hasColumn, hasRow, hasList, hasButton, hasImage, hasInput, hasCard, hasError };
  }, [code, refreshKey]);

  const darkMode = dark || /brightness\s*:\s*Brightness\.dark/.test(code);
  const background = darkMode ? "#10131b" : "#f6f7fb";
  const surface = darkMode ? "#1a1f2b" : "#ffffff";
  const foreground = darkMode ? "#f4f5fb" : "#202437";
  const muted = darkMode ? "#a7afc3" : "#70778b";
  const deviceClass = device === "phone" ? "live-device phone-device" : device === "tablet" ? "live-device tablet-device" : "live-device web-device";
  const previewStyle = { "--live-accent": parsed.accent, "--live-bg": background, "--live-surface": surface, "--live-text": foreground, "--live-muted": muted, "--live-zoom": zoom / 100 } as CSSProperties;

  return (
    <div className="live-preview-wrap">
      <div className="preview-controls">
        <div className="device-controls" role="group" aria-label="Preview device">
          <button className={device === "phone" ? "preview-control active" : "preview-control"} onClick={() => setDevice("phone")} title="Phone"><Smartphone size={14}/></button>
          <button className={device === "tablet" ? "preview-control active" : "preview-control"} onClick={() => setDevice("tablet")} title="Tablet"><Tablet size={14}/></button>
          <button className={device === "web" ? "preview-control active" : "preview-control"} onClick={() => setDevice("web")} title="Web"><Monitor size={14}/></button>
        </div>
        <div className="device-controls">
          <button className="preview-control" onClick={() => setLandscape((value) => !value)} title="Rotate preview"><RotateCw size={14}/></button>
          <button className="preview-control" onClick={() => setDark((value) => !value)} title="Toggle preview theme">{dark ? <Sun size={14}/> : <Moon size={14}/>}</button>
          <button className="preview-control" onClick={() => setZoom((value) => Math.max(60, value - 10))} title="Zoom out"><ZoomOut size={14}/></button>
          <span className="zoom-value">{zoom}%</span>
          <button className="preview-control" onClick={() => setZoom((value) => Math.min(130, value + 10))} title="Zoom in"><ZoomIn size={14}/></button>
          <button className="preview-control" onClick={() => setRefreshKey((value) => value + 1)} title="Re-parse preview"><RefreshCw size={14}/></button>
        </div>
      </div>
      <div className="live-stage">
        <div key={device + String(landscape)} className={deviceClass + (landscape ? " landscape" : "")} style={previewStyle}>
          {device !== "web" && <div className="live-device-camera"/>}
          <div className="live-status"><span>9:41</span><span>●●● ▰</span></div>
          <div className="live-app" style={{ background }}>
            {parsed.hasAppBar && <div className="live-appbar" style={{ background: surface, color: foreground }}><span className="live-appbar-title">{parsed.title}</span><span>⋮</span></div>}
            <div className="live-content" style={{ color: foreground }}>
              {parsed.hasError ? <div className="live-empty">Start typing Dart code to see your layout.</div> : <>
                {!parsed.isScaffold && <div className="live-notice">Widget preview</div>}
                {parsed.hasCard && <div className="live-render-card" style={{ background: surface, borderColor: darkMode ? "#30384b" : "#e7eaf2" }}><div className="live-card-kicker" style={{ color: parsed.accent }}>CARD</div>{parsed.labels.slice(0, 2).map((label, index) => <div key={index} className="live-text" style={{ color: foreground }}>{label}</div>)}</div>}
                {parsed.hasImage && <div className="live-image-placeholder" style={{ background: surface }}><span>Image widget</span><small>Source image depends on Flutter runtime</small></div>}
                {parsed.hasList && <div className="live-list-indicator" style={{ borderColor: parsed.accent }}>☷  Scrollable list</div>}
                <div className={"live-widget-stack" + (parsed.hasRow ? " row-layout" : "")}>
                  {parsed.labels.slice(parsed.hasCard ? 2 : 0, parsed.hasCard ? 8 : 10).map((label, index) => (
                    <div key={index} className="live-text-row" style={{ background: index === 0 && parsed.hasCard ? "transparent" : surface }}>
                      {index === 0 && /Icon\s*\(/.test(code) && <span className="live-icon" style={{ color: parsed.accent }}>✦</span>}
                      <span className="live-text" style={{ color: foreground }}>{label}</span>
                    </div>
                  ))}
                </div>
                {parsed.hasInput && <div className="live-input" style={{ borderColor: darkMode ? "#394155" : "#dfe3ed", color: muted }}>TextField · enter text</div>}
                {parsed.hasButton && <button className="live-button" style={{ background: parsed.accent }} onClick={() => {}} type="button">Button preview</button>}
                {!parsed.labels.length && <div className="live-empty">No Text widgets found yet. Add Text('Hello') to render a label.</div>}
              </>}
            </div>
            <div className="live-bottom-nav" style={{ borderColor: darkMode ? "#30384b" : "#e7eaf2", background: surface }}><span style={{ color: parsed.accent }}>●</span><span style={{ color: muted }}>⌕</span><span style={{ color: muted }}>◷</span><span style={{ color: muted }}>◉</span></div>
          </div>
          {device !== "web" && <div className="live-home-indicator"/>}
        </div>
      </div>
      <div className="preview-live-status"><span className="preview-live-dot"/><strong>Live draft preview</strong><span>updates as you type</span></div>
      <div className="preview-capability"><Zap size={13}/><span>Recognizes common Flutter widgets: Scaffold, AppBar, Text, Card, Row, Column, buttons, inputs and images.</span></div>
      <div className="preview-disclaimer"><AlertTriangle size={13}/><span>This is an instant visual draft renderer, not the Flutter engine. Complex layouts, state, plugins and Dart expressions require a real Flutter runtime to render exactly.</span></div>
      <div className="preview-source">{fileName} · {code.split("\n").length} lines · {device.toUpperCase()} preview</div>
    </div>
  );
}
