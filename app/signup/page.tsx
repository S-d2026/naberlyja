"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) {
      setMsg("Supabase is not configured yet. Add your environment variables first.");
      return;
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, phone } }
    });
    if (error) {
      setMsg(error.message);
      return;
    }
    setMsg("Account created. Check your email confirmation settings in Supabase.");
  }

  return (
    <div className="card pad" style={{ maxWidth: 520, margin: "0 auto" }}>
      <div className="section-title">Create account</div>
      <form onSubmit={handleSubmit} className="grid" style={{ marginTop: 16 }}>
        <input className="input" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" placeholder="Phone / WhatsApp" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn">Create account</button>
        {msg && <div className="small muted">{msg}</div>}
      </form>
    </div>
  );
}
