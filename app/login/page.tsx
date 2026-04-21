"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkExistingSession();
  }, []);

  async function checkExistingSession() {
    if (!supabase) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      window.location.href = "/";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    if (!supabase) {
      setMsg("Supabase is not configured yet. Add your environment variables first.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: loginId,
      password,
    });

    if (error) {
      setMsg(error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/";
  }

  return (
    <div className="card pad" style={{ maxWidth: 520, margin: "0 auto" }}>
      <div className="section-title">Sign in</div>
      <form onSubmit={handleSubmit} className="grid" style={{ marginTop: 16 }}>
        <input
          className="input"
          placeholder="Email"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
        />
        <input
          className="input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
        {msg && <div className="small muted">{msg}</div>}
      </form>
    </div>
  );
}