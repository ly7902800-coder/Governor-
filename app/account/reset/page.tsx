"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, LoaderCircle, ShieldCheck } from "lucide-react";
export default function ResetPasswordPage() {
  const [token,setToken]=useState("");
  const [password,setPassword]=useState("");
  const [confirm,setConfirm]=useState("");
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [done,setDone]=useState(false);
  useEffect(()=>{setToken(new URLSearchParams(window.location.search).get("token")||"");},[]);
  async function submit(e:React.FormEvent){e.preventDefault();setError("");if(password!==confirm){setError("Passwords do not match.");return;}setBusy(true);try{const r=await fetch("/api/auth/password-reset/confirm",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token,password})});const d=await r.json();if(!r.ok)throw new Error(d.error||"Password reset failed.");setDone(true);}catch(e){setError(e instanceof Error?e.message:"Password reset failed.");}finally{setBusy(false);}}
  const field:React.CSSProperties={width:"100%",background:"#0a0d14",border:"1px solid #30394c",borderRadius:10,padding:"12px 13px",color:"#f5f7ff",boxSizing:"border-box"};
  const button:React.CSSProperties={width:"100%",padding:12,borderRadius:10,border:"1px solid #5579d1",background:"#4265bd",color:"#fff",fontWeight:650,cursor:"pointer"};
  return <main style={{minHeight:"100vh",background:"radial-gradient(ellipse at top,#17213a 0%,#090b11 55%)",color:"#f5f7ff",fontFamily:"Inter,system-ui,sans-serif",display:"grid",placeItems:"center",padding:16}}>
    <section style={{width:"min(100%,460px)",background:"#11151f",border:"1px solid #293142",borderRadius:22,padding:24}}>
      <a href="/account" style={{color:"#c5d1ea",display:"inline-flex",gap:8,alignItems:"center",textDecoration:"none",marginBottom:20}}><ArrowLeft size={16}/> Back to account</a>
      <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:18}}><ShieldCheck size={28}/><div><h1 style={{margin:0,fontSize:23}}>Reset password</h1><p style={{margin:"5px 0 0",color:"#a8b2c7",fontSize:13}}>Choose a new password for your account.</p></div></div>
      {error&&<p role="alert" style={{background:"#401e29",padding:12,borderRadius:9,color:"#ffb8c4",fontSize:13}}>{error}</p>}
      {done?<div role="status" style={{padding:14,background:"#17362f",borderRadius:10,color:"#b7f5dd"}}>Password changed. <a href="/account" style={{color:"#fff"}}>Sign in again</a>.</div>:<form onSubmit={submit} style={{display:"grid",gap:13}}>
        {!token&&<p style={{color:"#ffc2cc",fontSize:13}}>The reset token is missing. Open the full link from your email.</p>}
        <label style={{display:"grid",gap:7,fontSize:13,color:"#c2cbe0"}}>New password<input style={field} type="password" required minLength={10} maxLength={128} value={password} onChange={e=>setPassword(e.target.value)} autoComplete="new-password"/></label>
        <label style={{display:"grid",gap:7,fontSize:13,color:"#c2cbe0"}}>Confirm new password<input style={field} type="password" required minLength={10} maxLength={128} value={confirm} onChange={e=>setConfirm(e.target.value)} autoComplete="new-password"/></label>
        <button style={button} disabled={busy||!token}>{busy?<LoaderCircle size={16}/>:null} Set new password</button>
      </form>}
    </section>
  </main>;
}
