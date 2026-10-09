"use client";
import { useState } from "react";
import { AlertTriangle, ExternalLink, LoaderCircle, MonitorSmartphone, RefreshCw, TerminalSquare } from "lucide-react";
import LivePreview from "./live-preview";

export default function RuntimePreview({files,code,fileName}:{files:Record<string,string>;code:string;fileName:string}) {
  const [previewUrl,setPreviewUrl]=useState("");
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [engine,setEngine]=useState("");
  async function compile() {
    setBusy(true);setError("");
    try {
      const response=await fetch("/api/runtime/web",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({files})});
      const data=await response.json();
      if(!response.ok) throw new Error(data.error||"Flutter compilation failed.");
      setPreviewUrl(data.previewUrl);setEngine(data.engine||"Flutter Web");
    } catch(e) {setError(e instanceof Error?e.message:"Flutter runtime is unavailable.");}
    finally {setBusy(false);}
  }
  return <div style={{display:"flex",flexDirection:"column",height:"100%",minHeight:360,gap:10}}>
    <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
      <button className="btn primary" onClick={compile} disabled={busy}><MonitorSmartphone size={14}/>{busy?"Compiling Flutter…":"Compile real Flutter preview"}</button>
      {previewUrl&&<button className="btn" onClick={compile} disabled={busy}><RefreshCw size={14}/> Rebuild</button>}
      {previewUrl&&<a className="btn" href={previewUrl} target="_blank" rel="noreferrer"><ExternalLink size={13}/> Open preview</a>}
    </div>
    {error&&<div role="alert" style={{whiteSpace:"pre-wrap",maxHeight:180,overflow:"auto",padding:11,borderRadius:9,border:"1px solid #71404b",background:"#301a21",color:"#ffc2cc",fontSize:12}}>{error}</div>}
    {previewUrl?<><div style={{flex:1,minHeight:420,border:"1px solid #30394c",borderRadius:12,overflow:"hidden",background:"#fff"}}><iframe title="Real Flutter Web runtime preview" src={previewUrl} style={{width:"100%",height:"100%",minHeight:420,border:0,background:"white"}} sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock"/></div><div style={{fontSize:11,color:"#9ba7bd",display:"flex",gap:7,alignItems:"center"}}><TerminalSquare size={13}/>{engine} · compiled from the current workspace</div></>
    :<><LivePreview code={code} fileName={fileName}/><div style={{fontSize:12,color:"#9ba7bd",display:"flex",gap:7,alignItems:"center"}}><AlertTriangle size={14}/>The draft preview remains available. A real Flutter engine preview requires the separately deployed runtime service.</div></>}
  </div>;
}
