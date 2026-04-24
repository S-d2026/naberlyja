"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Listing = {
  id: string;
  title: string | null;
  price: string | null;
  parish: string | null;
  district: string | null;
  community: string | null;
  type: string | null;
  status: string | null;
  availability_status: string | null;
  featured: boolean | null;
  created_at: string | null;
};

function shareText(item: Listing) {
  const url = typeof window !== "undefined" ? window.location.origin : "https://naberlyja.com";
  return `New on Naberly JA: ${item.title || "listing"}${item.price ? ` - ${item.price}` : ""}. See local food, deals, services and help nearby: ${url}`;
}

export default function MyListingsPage() {
  const [rows, setRows] = useState<Listing[]>([]);
  const [msg, setMsg] = useState("Loading your listings...");

  useEffect(() => {
    loadRows();
  }, []);

  async function loadRows() {
    if (!supabase) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setMsg("Please login to manage your listings.");
      return;
    }

    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      setMsg(error.message);
      return;
    }

    setRows(data || []);
    setMsg(data && data.length ? "" : "No listings yet.");
  }

  async function updateListing(id: string, updates: Record<string, unknown>, success: string) {
    if (!supabase) return;

    const { error } = await supabase.from("listings").update(updates).eq("id", id);

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg(success);
    loadRows();
  }

  async function markSold(id: string) {
    updateListing(id, { availability_status: "sold" }, "Marked sold.");
  }

  async function markAvailable(id: string) {
    updateListing(id, { availability_status: "available" }, "Marked available.");
  }

  async function renew(id: string) {
    updateListing(id, { created_at: new Date().toISOString(), status: "pending" }, "Listing renewed and sent for approval.");
  }

  async function copyShare(item: Listing) {
    const text = shareText(item);
    await navigator.clipboard.writeText(text);
    setMsg("Share message copied.");
  }

  function whatsappShare(item: Listing) {
    const text = encodeURIComponent(shareText(item));
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  return (
    <div style={{ width: "100%", maxWidth: 980, margin: "0 auto", padding: 12 }}>
      <div className="card pad">
        <div className="flex between center gap-12 wrap">
          <div>
            <div style={{ fontWeight: 800, fontSize: 28 }}>My Listings</div>
            <div className="small muted">Manage, renew, share, and update your posts</div>
          </div>

          <div className="flex gap-8 wrap">
            <Link href="/" className="btn secondary" style={{ width: "auto" }}>
              Home
            </Link>
            <Link href="/post" className="btn" style={{ width: "auto" }}>
              New Post
            </Link>
          </div>
        </div>
      </div>

      {msg && <div className="card pad muted" style={{ marginTop: 14 }}>{msg}</div>}

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", marginTop: 14 }}>
        {rows.map((item) => (
          <div key={item.id} className="card pad">
            <div style={{ fontSize: 20, fontWeight: 800 }}>{item.title || "Untitled"}</div>
            <div className="small muted" style={{ marginTop: 6 }}>
              {[item.community, item.district, item.parish].filter(Boolean).join(", ")}
            </div>
            <div className="small" style={{ marginTop: 8 }}>
              {item.type} {item.price ? `• ${item.price}` : ""}
            </div>
            <div className="small muted" style={{ marginTop: 8 }}>
              Status: {item.status} • Availability: {item.availability_status || "available"} {item.featured ? "• Featured" : ""}
            </div>

            {item.status === "approved" && (
              <div className="card pad" style={{ background: "#ecfdf5", marginTop: 12 }}>
                <div style={{ fontWeight: 700 }}>Your listing is live.</div>
                <div className="small muted">Share it with customers so they know what you have today.</div>
              </div>
            )}

            <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(2, minmax(0,1fr))", marginTop: 12 }}>
              <button className="btn" onClick={() => whatsappShare(item)}>Share WhatsApp</button>
              <button className="btn secondary" onClick={() => copyShare(item)}>Copy Message</button>
              <button className="btn secondary" onClick={() => markAvailable(item.id)}>Available</button>
              <button className="btn secondary" onClick={() => markSold(item.id)}>Sold</button>
              <button className="btn secondary" onClick={() => renew(item.id)}>Renew</button>
              <Link href="/featured" className="btn secondary">Boost</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}