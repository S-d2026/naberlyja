"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Listing = {
  id: string;
  title: string | null;
  parish: string | null;
  district: string | null;
  community: string | null;
  status: string | null;
  featured: boolean | null;
  created_at: string | null;
};

export default function AdminPage() {
  const [rows, setRows] = useState<Listing[]>([]);
  const [msg, setMsg] = useState("Loading...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRows();
  }, []);

  async function loadRows() {
    setLoading(true);

    if (!supabase) {
      setMsg("Supabase is not configured.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      setMsg(`Supabase error: ${error.message}`);
      setRows([]);
      setLoading(false);
      return;
    }

    setRows(data || []);
    setMsg(data && data.length ? "" : "No pending listings found.");
    setLoading(false);
  }

  async function approve(id: string) {
    const { error } = await supabase
      .from("listings")
      .update({ status: "approved" })
      .eq("id", id);

    if (error) {
      setMsg(`Approve error: ${error.message}`);
      return;
    }

    loadRows();
  }

  async function reject(id: string) {
    const { error } = await supabase
      .from("listings")
      .update({ status: "rejected" })
      .eq("id", id);

    if (error) {
      setMsg(`Reject error: ${error.message}`);
      return;
    }

    loadRows();
  }

  async function feature(id: string) {
    const { error } = await supabase
      .from("listings")
      .update({ featured: true })
      .eq("id", id);

    if (error) {
      setMsg(`Feature error: ${error.message}`);
      return;
    }

    loadRows();
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 30, fontWeight: 700 }}>Admin Dashboard</h1>
      <p>Pending Listings</p>

      {loading && <p>Loading...</p>}
      {msg && <p>{msg}</p>}

      <div style={{ display: "grid", gap: 16, marginTop: 20 }}>
        {rows.map((row) => (
          <div
            key={row.id}
            style={{
              border: "1px solid #ddd",
              padding: 16,
              borderRadius: 12,
            }}
          >
            <h3 style={{ margin: 0 }}>{row.title || "Untitled"}</h3>
            <p style={{ margin: "8px 0" }}>
              {row.community}, {row.district}, {row.parish}
            </p>
            <p style={{ margin: "8px 0" }}>
              Status: {row.status} {row.featured ? "• Featured" : ""}
            </p>

            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button onClick={() => approve(row.id)}>Approve</button>
              <button onClick={() => reject(row.id)}>Reject</button>
              <button onClick={() => feature(row.id)}>Feature</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}