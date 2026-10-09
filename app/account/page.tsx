"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, Github, Globe2, LoaderCircle, LogOut, Mail, ShieldCheck, UserRound } from "lucide-react";

type User = { id:string; email:string; display_name:string; provider:string; email_verified:boolean; created_at:string };
export default function AccountPage() {
  const [user,setUser] = useState<User|null>(null);
  const [configured,setConfigured] = useState(false);
  const [mode,setMode] = useState<"login"|"register">("login");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [displayName,setDisplayName] = useState("");
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState("");
  const [notice,setNotice] = useState("");
  useEffect(()=>{ fetch("/api/auth/session").then(r=>r.json()).then(d=>{setConfigured(d.configured===true);setUser(d.user||null)}).catch(()=>setConfigured(false)); },[]);
  useEffect(()=>{ const q=new URLSearchParams(window.location.search); if(q.get("error")) setError(q.get("error")||"Sign-in failed."); if(q.get("connected")) setNotice("Connected with "+q.get("connected")+"."); if(q.get("verified")==="1") setNotice("Email verified. You can now sign in."); },[]);
  async function submit(e:React.FormEvent) {
    e.preventDefault(); setBusy(true);setError("");setNotice("");
    try {
      const response=await fetch(mode==="login"?"/api/auth/login":"/api/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password,displayName})});
      const data=await response.json();
      if(!response.ok) throw new Error(data.error||"Account request failed.");
      if (data.emailVerificationRequired) { setUser(null); setNotice(data.message || "Check your inbox to verify your email before signing in."); }
      else { setUser(data.user); setNotice("Signed in successfully."); }
    } catch(e) { setError(e instanceof Error?e.message:"Account request failed."); }
    finally {setBusy(false);}
  }
  async function requestEmailAction(path:string) {
    setError(""); setNotice("");
    if (!email.trim()) { setError("Enter your email address first."); return; }
    setBusy(true);
    try {
      const response=await fetch(path,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})});
      const data=await response.json();
      if(!response.ok) throw new Error(data.error||"Request failed.");
      setNotice(data.message||"Request accepted. Check your inbox.");
    } catch(e) { setError(e instanceof Error?e.message:"Request failed."); }
    finally {setBusy(false);}
  }
  async function logout(){await fetch("/api/auth/logout",{method:"POST"});setUser(null);setNotice("Signed out.");}
  const card:React.CSSProperties={width:"min(100%,480px)",background:"#11151f",border:"1px solid #293142",borderRadius:22,padding:24,boxShadow:"0 24px 90px #0005"};
  const field:React.CSSProperties={width:"100%",background:"#0a0d14",border:"1px solid #30394c",borderRadius:10,padding:"12px 13px",color:"#f5f7ff",outline:"none",boxSizing:"border-box"};
  const button:React.CSSProperties={width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:9,padding:"12px 14px",borderRadius:10,border:"1px solid #344056",background:"#1a2232",color:"#f5f7ff",fontWeight:650,cursor:"pointer",textDecoration:"none",boxSizing:"border-box"};
  return <main style={{minHeight:"100vh",background:"radial-gradient(ellipse at top,#17213a 0%,#090b11 55%)",color:"#f5f7ff",fontFamily:"Inter,system-ui,sans-serif",display:"flex",flexDirection:"column",alignItems:"center",padding:"28px 16px"}}>
    <div style={{width:"min(100%,980px)",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:34}}><a href="/" style={{color:"#c5d1ea",display:"inline-flex",gap:8,alignItems:"center",textDecoration:"none"}}><ArrowLeft size={17}/> Governor Studio</a><span style={{color:"#9daac2",fontSize:13}}>Account Center</span></div>
    <section style={card}>
      <div style={{display:"flex",alignItems:"center",gap:13,marginBottom:22}}><div style={{width:46,height:46,display:"grid",placeItems:"center",borderRadius:14,background:"#293b65"}}><ShieldCheck size={24}/></div><div><h1 style={{margin:0,fontSize:24}}>Your account</h1><p style={{margin:"5px 0 0",color:"#a8b2c7",fontSize:13}}>One platform account for your workspace and cloud projects.</p></div></div>
      {error&&<p role="alert" style={{background:"#401e29",border:"1px solid #773748",padding:12,borderRadius:9,color:"#ffb8c4",fontSize:13}}>{error}</p>}
      {notice&&<p role="status" style={{background:"#17362f",border:"1px solid #286653",padding:12,borderRadius:9,color:"#b7f5dd",fontSize:13}}>{notice}</p>}
      {!configured&&<p style={{background:"#3c2e18",border:"1px solid #73572c",padding:12,borderRadius:9,color:"#f8d99b",fontSize:13,lineHeight:1.6}}>Account database is not configured yet. Configure DATABASE_URL and SESSION_SECRET on the deployed web server before sign-in can work.</p>}
      {user?<div style={{display:"grid",gap:15}}><div style={{display:"flex",gap:12,alignItems:"center",padding:15,background:"#0b1019",borderRadius:12}}><UserRound/><div><strong>{user.display_name||user.email}</strong><div style={{color:"#a8b2c7",fontSize:13,marginTop:4}}>{user.email}</div><div style={{color:"#8bb9a9",fontSize:12,marginTop:4}}>Sign-in method: {user.provider} · {user.email_verified?"verified":"email not verified"}</div></div></div><button style={button} onClick={logout}><LogOut size={16}/> Sign out</button><a href="/" style={button as React.CSSProperties}>Return to workspace</a></div>
      :<><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:18}}><a href="/api/auth/oauth/google" style={button}><Globe2 size={16}/> Google</a><a href="/api/auth/oauth/github" style={button}><Github size={16}/> GitHub</a></div><div style={{display:"flex",alignItems:"center",gap:12,color:"#77849c",fontSize:12,marginBottom:18}}><span style={{height:1,background:"#30394c",flex:1}}/>OR USE EMAIL<span style={{height:1,background:"#30394c",flex:1}}/></div>
        <div style={{display:"flex",gap:8,marginBottom:17}}><button style={{...button,background:mode==="login"?"#293b65":"#101521"}} onClick={()=>setMode("login")}>Sign in</button><button style={{...button,background:mode==="register"?"#293b65":"#101521"}} onClick={()=>setMode("register")}>Create account</button></div>
        <form onSubmit={submit} style={{display:"grid",gap:13}}>{mode==="register"&&<label style={{display:"grid",gap:7,fontSize:13,color:"#c2cbe0"}}>Display name<input style={field} value={displayName} onChange={e=>setDisplayName(e.target.value)} maxLength={80} autoComplete="name" placeholder="Your name"/></label>}<label style={{display:"grid",gap:7,fontSize:13,color:"#c2cbe0"}}><span style={{display:"flex",gap:7,alignItems:"center"}}><Mail size={14}/> Email address</span><input style={field} type="email" required value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com"/></label><label style={{display:"grid",gap:7,fontSize:13,color:"#c2cbe0"}}>Password<input style={field} type="password" required minLength={mode==="register"?10:1} maxLength={128} value={password} onChange={e=>setPassword(e.target.value)} autoComplete={mode==="login"?"current-password":"new-password"} placeholder={mode==="register"?"At least 10 characters":"Your password"}/></label><button style={{...button,background:"#4265bd",borderColor:"#5579d1"}} disabled={busy||!configured}>{busy?<LoaderCircle size={16} className="spin"/>:null}{mode==="login"?"Sign in":"Create account"}</button></form>
        {mode==="login"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginTop:10}}><button style={{...button,fontSize:12}} onClick={()=>requestEmailAction("/api/auth/password-reset")} disabled={busy}>Forgot password?</button><button style={{...button,fontSize:12}} onClick={()=>requestEmailAction("/api/auth/verify/resend")} disabled={busy}>Resend verification</button></div>}
        <p style={{fontSize:12,lineHeight:1.65,color:"#9ba7bd",margin:"16px 0 0"}}>Email verification and password recovery use the configured email delivery provider. Google and GitHub sign-in require OAuth apps configured by the platform administrator.</p>
      </>}
    </section>
    <footer style={{color:"#68758c",fontSize:12,marginTop:24}}>Governor Studio · Secure server-side sessions · PostgreSQL-backed accounts</footer>
  </main>;
}
