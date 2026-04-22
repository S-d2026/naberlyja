"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Listing = {
  id: string;
  title: string | null;
  parish: string | null;
  district: string | null;
  community: string | null;
  type: string | null;
  price: string | null;
  status: string | null;
  featured: boolean | null;
  image_url: string | null;
  description: string | null;
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
      .in("status", ["pending", "approved", "hidden", "archived"])
      .order("created_at", { ascending: false });

    if (error) {
      setMsg(`Supabase error: ${error.message}`);
      setRows([]);
      setLoading(false);
      return;
    }

    setRows(data || []);
    setMsg(data && data.length ? "" : "No listings found.");
    setLoading(false);
  }

  async function updateRow(id: string, updates: Record<string, unknown>, successText: string) {
    if (!supabase) return;

    const { error } = await supabase.from("listings").update(updates).eq("id", id);

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg(successText);
    loadRows();
  }

  async function approve(id: string) {
    updateRow(id, { status: "approved" }, "Listing approved.");
  }

  async function reject(id: string) {
    updateRow(id, { status: "rejected" }, "Listing rejected.");
  }

  async function hideListing(id: string) {
    updateRow(id, { status: "hidden" }, "Listing hidden.");
  }

  async function archiveListing(id: string) {
    updateRow(id, { status: "archived" }, "Listing archived.");
  }

  async function feature(id: string) {
    updateRow(id, { featured: true }, "Listing featured.");
  }

  async function unfeature(id: string) {
    updateRow(id, { featured: false }, "Listing unfeatured.");
  }

  async function deleteListing(id: string) {
    if (!supabase) return;

    const ok = window.confirm("Delete this listing permanently?");
    if (!ok) return;

    const { error } = await supabase.from("listings").delete().eq("id", id);

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg("Listing deleted.");
    loadRows();
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <div className="flex between center gap-12">
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 700, margin: 0 }}>Admin Dashboard</h1>
          <p style={{ marginTop: 8 }}>Moderate listings</p>
        </div>

        <Link href="/" className="btn secondary" style={{ width: "auto" }}>
          Home
        </Link>
      </div>

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
              background: "white",
            }}
          >
            <div className="flex between gap-12">
              <div>
                <h3 style={{ margin: 0 }}>{row.title || "Untitled"}</h3>
                <p style={{ margin: "8px 0" }}>
                  {[row.community, row.district, row.parish].filter(Boolean).join(", ")}
                </p>
                <p style={{ margin: "8px 0" }}>
                  {row.type} {row.price ? `• ${row.price}` : ""}
                </p>
                <p style={{ margin: "8px 0" }}>
                  Status: {row.status || "unknown"} {row.featured ? "• Featured" : ""}
                </p>
              </div>
            </div>

            {row.image_url ? (
              <img
                src={row.image_url}
                alt={row.title || "listing image"}
                style={{
                  width: "100%",
                  maxHeight: 240,
                  objectFit: "cover",
                  borderRadius: 12,
                  marginTop: 12,
                }}
              />
            ) : null}

            {row.description ? <p style={{ marginTop: 12 }}>{row.description}</p> : null}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0,1fr))",
                gap: 10,
                marginTop: 14,
              }}
            >
              <button className="btn" onClick={() => approve(row.id)}>
                Approve
              </button>
              <button className="btn secondary" onClick={() => reject(row.id)}>
                Reject
              </button>
              <button className="btn secondary" onClick={() => feature(row.id)}>
                Feature
              </button>

              <button className="btn secondary" onClick={() => unfeature(row.id)}>
                Unfeature
              </button>
              <button className="btn secondary" onClick={() => hideListing(row.id)}>
                Hide
              </button>
              <button className="btn secondary" onClick={() => archiveListing(row.id)}>
                Archive
              </button>
            </div>

            <div style={{ marginTop: 10 }}>
              <button
                className="btn secondary"
                style={{ background: "#fee2e2", color: "#991b1b", width: "100%" }}
                onClick={() => deleteListing(row.id)}
              >
                Delete Permanently
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}