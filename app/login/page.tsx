"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

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

    setMsg("Login successful.");
    setLoading(false);

    // Redirect after successful login
    router.push("/");
    router.refresh();
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