"use client";

import { useState } from "react";
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

  const eligibleCategory =
    form.category === "need-food" ||
    form.category === "sell-offer" ||
    form.category === "emergency-help";

  return isFree && (eligibleCategory || hasRescueWord);
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
  });

  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

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
      featured: autoFeatured,
      featured_expires_at: autoFeatured
        ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        : null,
    });

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg(
      autoFeatured
        ? "Listing submitted for approval. Free priority item marked for featured placement."
        : "Listing submitted for approval."
    );

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
    });
    setImageUrl("");
  }

  return (
    <div className="card pad" style={{ maxWidth: 700, margin: "0 auto" }}>
      <div className="section-title">Sell / Offer Anything</div>

      <form onSubmit={handleSubmit} className="grid" style={{ marginTop: 16 }}>
        <input
          className="input"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <select
          className="select"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value as CategoryId })}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>

        <input
          className="input"
          placeholder="Type (eggs, meals, plumbing, taxi, flyer event, tutoring)"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        />

        <input
          className="input"
          placeholder="Price or Free"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <select
          className="select"
          value={form.parish}
          onChange={(e) => setForm({ ...form, parish: e.target.value })}
        >
          {parishes.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <input
          className="input"
          placeholder="District (required)"
          value={form.district}
          onChange={(e) => setForm({ ...form, district: e.target.value })}
        />

        <input
          className="input"
          placeholder="Community"
          value={form.community}
          onChange={(e) => setForm({ ...form, community: e.target.value })}
        />

        <input
          className="input"
          placeholder="Phone / WhatsApp"
          value={form.contact_phone}
          onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
        />

        <textarea
          className="textarea"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <div className="grid">
          <label style={{ fontWeight: 600 }}>Add picture or flyer</label>
          <input
            className="input"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
          />
          {uploading && <div className="small muted">Uploading image...</div>}
          {imageUrl && (
            <div>
              <img
                src={imageUrl}
                alt="Listing preview"
                style={{ width: "100%", maxHeight: 260, objectFit: "cover", borderRadius: 12 }}
              />
            </div>
          )}
        </div>

        <button className="btn" disabled={uploading}>
          {uploading ? "Uploading..." : "Publish Listing"}
        </button>

        {msg && <div className="small muted">{msg}</div>}
      </form>
    </div>
  );
}