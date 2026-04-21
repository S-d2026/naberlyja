"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Listing = {
  id: string;
  title: string;
  parish: string | null;
  district: string | null;
  community: string | null;
  type: string | null;
  price: string | null;
  status: string | null;
  featured: boolean | null;
  created_at: string | null;
};

export default function AdminPage() {
  const [items, setItems] = useState<Listing[]>([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadPending() {
    if (!supabase) {
      setMsg("Supabase is not configured.");
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      setMsg(error.message);
      setItems([]);
      setLoading(false);
      return;
    }

    setItems(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadPending();
  }, []);

  async function updateStatus(id: string, status: "approved" | "rejected") {
    if (!supabase) return;

    const { error } = await supabase
      .from("listings")
      .update({ status })
      .eq("id", id);

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg(`Listing ${status}.`);
    loadPending();
  }

  async function markFeatured(id: string) {
    if (!supabase) return;

    const { error } = await supabase
      .from("listings")
      .update({ featured: true })
      .eq("id", id);

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg("Listing marked as featured.");
    loadPending();
  }

  return (
    <div className="grid">
      <div className="card pad">
        <div className="section-title">Admin Moderation</div>
        <div className="small muted" style={{ marginTop: 8 }}>
          Live pending listings from Supabase
        </div>
      </div>

      {loading && <div className="card pad muted">Loading pending listings...</div>}

      {!loading && items.length === 0 && (
        <div className="card pad muted">No pending listings found.</div>
      )}

      {items.map((item) => (
        <div key={item.id} className="card pad">
          <div style={{ fontSize: 20, fontWeight: 700 }}>{item.title}</div>
          <div className="small muted" style={{ marginTop: 4 }}>
            {item.community}, {item.district}, {item.parish}
          </div>
          <div className="small" style={{ marginTop: 8 }}>
            {item.type} · {item.price}
          </div>
          <div className="small muted" style={{ marginTop: 8 }}>
            Status: {item.status} {item.featured ? "· Featured" : ""}
          </div>

          <div className="flex wrap gap-12" style={{ marginTop: 12 }}>
            <button
              className="btn"
              style={{ width: "auto" }}
              onClick={() => updateStatus(item.id, "approved")}
            >
              Approve
            </button>

            <button
              className="btn secondary"
              style={{ width: "auto" }}
              onClick={() => updateStatus(item.id, "rejected")}
            >
              Reject
            </button>

            <button
              className="btn outline"
              style={{ width: "auto" }}
              onClick={() => markFeatured(item.id)}
            >
              Mark Featured
            </button>
          </div>
        </div>
      ))}

      {msg && <div className="small muted">{msg}</div>}
    </div>
  );
}