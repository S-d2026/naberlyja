"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [msg, setMsg] = useState("Loading...");

  useEffect(() => {
    loadRows();
  }, []);

  async function loadRows() {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      setMsg(error.message);
      return;
    }

    setRows(data || []);
    setMsg("");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      {msg && <p>{msg}</p>}

      {rows.map((row) => (
        <div
          key={row.id}
          style={{
            border: "1px solid #ddd",
            padding: 12,
            marginBottom: 10,
            borderRadius: 8,
          }}
        >
          <h3>{row.title}</h3>
          <p>{row.parish}</p>
          <p>{row.status}</p>
        </div>
      ))}
    </div>
  );
}