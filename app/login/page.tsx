"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function init() {
      if (!supabase) {
        if (mounted) setReady(true);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (session) {
        window.location.replace("/");
        return;
      }

      setReady(true);
    }

    init();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    if (!supabase) {
      setMsg("Supabase is not configured yet.");
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

    window.location.replace("/");
  }

  if (!ready) {
    return (
      <div className="card pad" style={{ maxWidth: 520, margin: "40px auto" }}>
        Checking login...
      </div>
    );
  }

  return (
    <div className="card pad" style={{ maxWidth: 520, margin: "40px auto" }}>
      <div className="flex between center gap-12">
        <div className="section-title">Login</div>
        <Link href="/" className="btn secondary" style={{ width: "auto" }}>
          Home
        </Link>
      </div>

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