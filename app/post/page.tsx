"use client";

import { useState } from "react";
import { parishes } from "@/data/listings";
import { supabase } from "@/lib/supabase";

export default function PostPage() {
  const [form, setForm] = useState({
    title: "",
    price: "",
    parish: "Kingston",
    district: "",
    community: "",
    type: "",
    contact_phone: "",
    description: ""
  });
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.district.trim()) {
      setMsg("District is required.");
      return;
    }
    if (!supabase) {
      setMsg("Supabase is not configured yet. This form is ready but needs environment variables.");
      return;
    }
    const { error } = await supabase.from("listings").insert({
      title: form.title,
      price: form.price,
      parish: form.parish,
      district: form.district,
      community: form.community,
      type: form.type,
      contact_phone: form.contact_phone,
      description: form.description,
      category: "sell-offer",
      status: "pending"
    });
    if (error) {
      setMsg(error.message);
      return;
    }
    setMsg("Listing submitted for approval.");
  }

  return (
    <div className="card pad" style={{ maxWidth: 700, margin: "0 auto" }}>
      <div className="section-title">Sell / Offer Anything</div>
      <form onSubmit={handleSubmit} className="grid" style={{ marginTop: 16 }}>
        <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="input" placeholder="Price or Free" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <select className="select" value={form.parish} onChange={(e) => setForm({ ...form, parish: e.target.value })}>
          {parishes.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <input className="input" placeholder="District (required)" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
        <input className="input" placeholder="Community" value={form.community} onChange={(e) => setForm({ ...form, community: e.target.value })} />
        <input className="input" placeholder="Type (food, product, service, ride, event, help)" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
        <input className="input" placeholder="Phone / WhatsApp" value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} />
        <textarea className="textarea" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button className="btn">Publish Listing</button>
        {msg && <div className="small muted">{msg}</div>}
      </form>
    </div>
  );
}
