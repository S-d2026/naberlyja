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
  boost_type: string | null;
  boost_payment_status: string | null;
  boost_expires_at: string | null;
  first_boost_used: boolean | null;
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

    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .in("status", ["pending", "approved", "hidden", "archived"])
      .order("created_at", { ascending: false });

    if (error) {
      setMsg(error.message);
      setRows([]);
      setLoading(false);
      return;
    }

    setRows(data || []);
    setMsg(data && data.length ? "" : "No listings found.");
    setLoading(false);
  }

  async function updateRow(id: string, updates: Record<string, unknown>, successText: string) {
    const { error } = await supabase.from("listings").update(updates).eq("id", id);

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg(successText);
    loadRows();
  }

  function addDays(days: number) {
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
  }

  async function activateBoost(id: string, type: string, days: number, firstFree = false) {
    await updateRow(
      id,
      {
        featured: true,
        status: "approved",
        boost_type: type,
        boost_payment_status: firstFree ? "first_boost_free" : "manual_confirmed",
        boost_expires_at: addDays(days),
        first_boost_used: true,
      },
      `${type} boost activated.`
    );
  }

  async function endBoost(id: string) {
    await updateRow(
      id,
      {
        featured: false,
        boost_type: null,
        boost_payment_status: null,
        boost_expires_at: null,
      },
      "Boost ended."
    );
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

  async function deleteListing(id: string) {
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
    <div style={{ width: "100%", maxWidth: 1100, margin: "0 auto", padding: 12 }}>
      <div className="card pad">
        <div className="flex between center gap-12 wrap">
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 700, margin: 0 }}>Admin Dashboard</h1>
            <p style={{ marginTop: 8 }}>Moderate listings and manage boosts</p>
          </div>

          <Link href="/" className="btn secondary" style={{ width: "auto" }}>
            Home
          </Link>
        </div>
      </div>

      {loading && <p style={{ marginTop: 14 }}>Loading...</p>}

      {msg && (
        <div className="card pad muted" style={{ marginTop: 14 }}>
          {msg}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          marginTop: 14,
        }}
      >
        {rows.map((row) => (
          <div key={row.id} className="card pad" style={{ background: "white" }}>
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

            <div className="card pad" style={{ background: "#f8fafc", marginTop: 12 }}>
              <strong>Boost Status</strong>
              <div className="small muted" style={{ marginTop: 6 }}>
                Type: {row.boost_type || "None"}
              </div>
              <div className="small muted">
                Payment: {row.boost_payment_status || "None"}
              </div>
              <div className="small muted">
                Expires:{" "}
                {row.boost_expires_at
                  ? new Date(row.boost_expires_at).toLocaleString()
                  : "Not boosted"}
              </div>
              <div className="small muted">
                First boost used: {row.first_boost_used ? "Yes" : "No"}
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

              <button className="btn secondary" onClick={() => hideListing(row.id)}>
                Hide
              </button>

              <button className="btn secondary" onClick={() => archiveListing(row.id)}>
                Archive
              </button>

              <button className="btn secondary" onClick={() => activateBoost(row.id, "first_free", 1, true)}>
                First Boost Free
              </button>

              <button className="btn secondary" onClick={() => activateBoost(row.id, "daily", 1)}>
                Daily Boost
              </button>

              <button className="btn secondary" onClick={() => activateBoost(row.id, "weekend", 3)}>
                Weekend Boost
              </button>

              <button className="btn secondary" onClick={() => activateBoost(row.id, "weekly", 7)}>
                Weekly Boost
              </button>

              <button className="btn secondary" onClick={() => endBoost(row.id)}>
                End Boost
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