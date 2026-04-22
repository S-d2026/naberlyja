"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    if (!supabase) {
      setMsg("Supabase is not configured.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    if (error) {
      setMsg(error.message);
      setLoading(false);
      return;
    }

    setMsg("Account created. Please check your email or log in if confirmation is not required.");
    setLoading(false);
  }

  return (
    <div style={{ width: "100%", maxWidth: 760, margin: "0 auto", padding: 12 }}>
      <div className="card pad">
        <div className="flex between center gap-12 wrap">
          <div>
            <div style={{ fontWeight: 800, fontSize: 28 }}>Naberly</div>
            <div className="small muted">Jamaica Launch • Naberly JA</div>
            <div className="section-title" style={{ marginTop: 8 }}>
              Sign Up
            </div>
          </div>

          <Link href="/" className="btn secondary" style={{ width: "auto" }}>
            Home
          </Link>
        </div>

        <form onSubmit={handleSignup} className="grid" style={{ marginTop: 16 }}>
          <input
            className="input"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>

          {msg && <div className="small muted">{msg}</div>}
        </form>

        <div className="small muted" style={{ marginTop: 14 }}>
          Already have an account? <Link href="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}