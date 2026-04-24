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
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadRows();
  }, []);

  async function loadRows() {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMsg(error.message);
      return;
    }

    setRows(data || []);
    setMsg("");
  }

  async function setStatus(id: string, status: string) {
    const { error } = await supabase
      .from("listings")
      .update({ status })
      .eq("id", id);

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg(`Listing moved to ${status}.`);
    loadRows();
  }

  async function setFeatured(id: string, featured: boolean) {
    const { error } = await supabase
      .from("listings")
      .update({ featured })
      .eq("id", id);

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg(featured ? "Listing featured." : "Listing unfeatured.");
    loadRows();
  }

  async function deleteListing(id: string) {
    const ok = window.confirm("Delete permanently? This cannot be undone.");
    if (!ok) return;

    const { error } = await supabase.from("listings").delete().eq("id", id);

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg("Listing deleted.");
    loadRows();
  }

  const visibleRows =
    filter === "all" ? rows : rows.filter((row) => row.status === filter);

  return (
    <div style={{ width: "100%", maxWidth: 1100, margin: "0 auto", padding: 12 }}>
      <div className="card pad">
        <div className="flex between center gap-12 wrap">
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 700, margin: 0 }}>
              Admin Cleanup
            </h1>
            <p style={{ marginTop: 8 }}>
              Archive old posts instead of deleting them.
            </p>
          </div>

          <Link href="/" className="btn secondary" style={{ width: "auto" }}>
            Home
          </Link>
        </div>
      </div>

      {msg && (
        <div className="card pad muted" style={{ marginTop: 14 }}>
          {msg}
        </div>
      )}

      <div className="card pad" style={{ marginTop: 14 }}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Filter</div>

        <div className="flex gap-8 wrap">
          {["all", "pending", "approved", "hidden", "archived", "rejected"].map(
            (item) => (
              <button
                key={item}
                className={filter === item ? "btn" : "btn secondary"}
                style={{ width: "auto" }}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            )
          )}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          marginTop: 14,
        }}
      >
        {visibleRows.map((row) => (
          <div key={row.id} className="card pad">
            <div style={{ fontSize: 20, fontWeight: 800 }}>
              {row.title || "Untitled"}
            </div>

            <div className="small muted" style={{ marginTop: 6 }}>
              {[row.community, row.district, row.parish].filter(Boolean).join(", ")}
            </div>

            <div className="small" style={{ marginTop: 8 }}>
              {row.type} {row.price ? `• ${row.price}` : ""}
            </div>

            <div className="small muted" style={{ marginTop: 8 }}>
              Status: <strong>{row.status || "none"}</strong>{" "}
              {row.featured ? "• Featured" : ""}
            </div>

            {row.image_url ? (
              <img
                src={row.image_url}
                alt={row.title || "listing image"}
                style={{
                  width: "100%",
                  maxHeight: 220,
                  objectFit: "cover",
                  borderRadius: 12,
                  marginTop: 12,
                }}
              />
            ) : null}

            {row.description ? (
              <p className="small" style={{ marginTop: 10 }}>
                {row.description}
              </p>
            ) : null}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 10,
                marginTop: 14,
              }}
            >
              <button className="btn" onClick={() => setStatus(row.id, "approved")}>
                Approve / Unhide
              </button>

              <button
                className="btn secondary"
                onClick={() => setStatus(row.id, "archived")}
              >
                Archive
              </button>

              <button
                className="btn secondary"
                onClick={() => setStatus(row.id, "hidden")}
              >
                Hide
              </button>

              <button
                className="btn secondary"
                onClick={() => setStatus(row.id, "rejected")}
              >
                Reject
              </button>

              <button
                className="btn secondary"
                onClick={() => setFeatured(row.id, true)}
              >
                Feature
              </button>

              <button
                className="btn secondary"
                onClick={() => setFeatured(row.id, false)}
              >
                Unfeature
              </button>
            </div>

            <button
              className="btn secondary"
              style={{
                marginTop: 10,
                background: "#fee2e2",
                color: "#991b1b",
                width: "100%",
              }}
              onClick={() => deleteListing(row.id)}
            >
              Delete Permanently
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}