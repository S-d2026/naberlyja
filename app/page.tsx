"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Listing = {
  id: string;
  title: string;
  parish: string;
  district: string;
  community: string;
  status: string;
  featured: boolean;
};

export default function AdminPage() {
  const [items, setItems] = useState<Listing[]>([]);
  const [msg, setMsg] = useState("");

  async function loadListings() {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      setMsg(error.message);
      return;
    }

    setItems(data || []);
  }

  useEffect(() => {
    loadListings();
  }, []);

  async function approve(id: string) {
    await supabase
      .from("listings")
      .update({ status: "approved" })
      .eq("id", id);

    loadListings();
  }

  async function reject(id: string) {
    await supabase
      .from("listings")
      .update({ status: "rejected" })
      .eq("id", id);

    loadListings();
  }

  async function feature(id: string) {
    await supabase
      .from("listings")
      .update({ featured: true })
      .eq("id", id);

    loadListings();
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 30, fontWeight: 700 }}>Admin Dashboard</h1>
      <p>Pending Listings</p>

      {msg && <div>{msg}</div>}

      <div style={{ display: "grid", gap: 16, marginTop: 20 }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              padding: 18,
              border: "1px solid #ddd",
              borderRadius: 16,
            }}
          >
            <h3>{item.title}</h3>

            <p>
              {item.community}, {item.district}, {item.parish}
            </p>

            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button onClick={() => approve(item.id)}>Approve</button>
              <button onClick={() => reject(item.id)}>Reject</button>
              <button onClick={() => feature(item.id)}>Feature</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}