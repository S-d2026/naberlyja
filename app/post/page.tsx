"use client";

import { useState } from "react";
import Link from "next/link";
import { parishes, categories, CategoryId } from "@/data/listings";
import { supabase } from "@/lib/supabase";

function isFreePriority(form: {
  category: CategoryId;
  price: string;
  type: string;
  description: string;
}) {
  const text = `${form.type} ${form.description}`.toLowerCase();
  const isFree = form.price.toLowerCase().includes("free");
  const rescueKeywords = ["rescue", "donation", "donate", "meal", "meals", "food", "groceries"];
  const hasRescueWord = rescueKeywords.some((word) => text.includes(word));

  return (
    isFree &&
    (form.category === "need-food" ||
      form.category === "sell-offer" ||
      form.category === "emergency-help" ||
      hasRescueWord)
  );
}

export default function PostPage() {
  const [form, setForm] = useState({
    title: "",
    price: "",
    parish: "Kingston",
    district: "",
    community: "",
    type: "",
    contact_phone: "",
    description: "",
    category: "sell-offer" as CategoryId,
    delivery_options: [] as string[],
  });

  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  function toggleDelivery(option: string) {
    setForm((prev) => ({
      ...prev,
      delivery_options: prev.delivery_options.includes(option)
        ? prev.delivery_options.filter((x) => x !== option)
        : [...prev.delivery_options, option],
    }));
  }

  async function handleImageUpload(file: File) {
    if (!supabase) {
      setMsg("Supabase is not configured.");
      return;
    }

    setUploading(true);
    setMsg("");

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `listing-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("listing-images")
      .upload(filePath, file);

    if (uploadError) {
      setMsg(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("listing-images").getPublicUrl(filePath);
    setImageUrl(data.publicUrl);
    setUploading(false);
    setMsg("Image uploaded.");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.district.trim()) {
      setMsg("District is required.");
      return;
    }

    if (!supabase) {
      setMsg("Supabase is not configured yet.");
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const autoFeatured = isFreePriority(form);

    const { error } = await supabase.from("listings").insert({
      title: form.title,
      price: form.price,
      parish: form.parish,
      district: form.district,
      community: form.community,
      type: form.type,
      contact_phone: form.contact_phone,
      description: form.description,
      category: form.category,
      image_url: imageUrl || null,
      status: "pending",
      availability_status: "available",
      delivery_options: form.delivery_options,
      user_id: session?.user?.id || null,
      featured: autoFeatured,
      featured_expires_at: autoFeatured
        ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        : null,
    });

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg("Listing submitted for approval. Once approved, you can share it with customers from My Listings.");

    setForm({
      title: "",
      price: "",
      parish: "Kingston",
      district: "",
      community: "",
      type: "",
      contact_phone: "",
      description: "",
      category: "sell-offer",
      delivery_options: [],
    });
    setImageUrl("");
  }

  const deliveryOptions = [
    "Pickup",
    "Local delivery",
    "Seller delivery",
    "Buyer arranges",
    "Knutsford Express",
  ];

  return (
    <div style={{ width: "100%", maxWidth: 980, margin: "0 auto", padding: 12 }}>
      <div className="card pad">
        <div className="flex between center gap-12 wrap">
          <div>
            <div style={{ fontWeight: 800, fontSize: 28 }}>Naberly</div>
            <div className="small muted">Jamaica Launch • Naberly JA</div>
            <div className="section-title" style={{ marginTop: 8 }}>
              Sell / Offer Anything
            </div>
          </div>

          <div className="flex gap-8 wrap">
            <Link href="/" className="btn secondary" style={{ width: "auto" }}>
              Home
            </Link>
            <Link href="/my-listings" className="btn secondary" style={{ width: "auto" }}>
              My Listings
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid" style={{ marginTop: 16 }}>
          <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />

          <select className="select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as CategoryId })}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>

          <input className="input" placeholder="Type (eggs, meals, plumbing, taxi, flyer event, tutoring)" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
          <input className="input" placeholder="Price or Free" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />

          <select className="select" value={form.parish} onChange={(e) => setForm({ ...form, parish: e.target.value })}>
            {parishes.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>

          <input className="input" placeholder="District (required)" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
          <input className="input" placeholder="Community" value={form.community} onChange={(e) => setForm({ ...form, community: e.target.value })} />
          <input className="input" placeholder="Phone / WhatsApp" value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} />
          <textarea className="textarea" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

          <div className="card pad" style={{ background: "#f8fafc" }}>
            <div style={{ fontWeight: 700 }}>Delivery / Pickup Options</div>
            <div className="grid" style={{ marginTop: 10 }}>
              {deliveryOptions.map((option) => (
                <label key={option} className="small">
                  <input
                    type="checkbox"
                    checked={form.delivery_options.includes(option)}
                    onChange={() => toggleDelivery(option)}
                    style={{ marginRight: 8 }}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <div className="grid">
            <label style={{ fontWeight: 600 }}>Add picture or flyer</label>

            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              <label className="btn" style={{ textAlign: "center", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                Upload Photo / Flyer
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }} />
              </label>

              <label className="btn secondary" style={{ textAlign: "center", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                Take Picture
                <input type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }} />
              </label>
            </div>

            {uploading && <div className="small muted">Uploading image...</div>}
            {imageUrl && <img src={imageUrl} alt="Listing preview" style={{ width: "100%", maxHeight: 260, objectFit: "cover", borderRadius: 12 }} />}
          </div>

          <button className="btn" disabled={uploading}>
            {uploading ? "Uploading..." : "Publish Listing"}
          </button>

          {msg && <div className="small muted">{msg}</div>}
        </form>
      </div>
    </div>
  );
}