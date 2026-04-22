"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { categories, parishes, CategoryId } from "@/data/listings";
import { supabase } from "@/lib/supabase";
import { makeTelLink, makeWhatsAppLink } from "@/lib/links";

type LiveListing = {
  id: string;
  title: string | null;
  category: string | null;
  type: string | null;
  description: string | null;
  price: string | null;
  parish: string | null;
  district: string | null;
  community: string | null;
  contact_phone: string | null;
  image_url: string | null;
  status: string | null;
  featured: boolean | null;
  created_at: string | null;
};

const quickFilters = ["Free", "Newest", "Featured", "Low Cost"] as const;
type QuickFilter = (typeof quickFilters)[number];

function normalizeCategory(value: string | null): CategoryId | "" {
  if (!value) return "";

  const valid: CategoryId[] = [
    "need-food",
    "sell-offer",
    "need-work",
    "hire-worker",
    "buy-sell",
    "need-ride",
    "events",
    "emergency-help",
    "services",
  ];

  return valid.includes(value as CategoryId) ? (value as CategoryId) : "";
}

function SaveButton({
  listingId,
  savedIds,
  onSaved,
}: {
  listingId: string;
  savedIds: Set<string>;
  onSaved: (id: string) => void;
}) {
  const isSaved = savedIds.has(listingId);

  async function handleSave() {
    if (!supabase) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = "/login";
      return;
    }

    const { error } = await supabase.from("favorite_listings").insert({
      user_id: session.user.id,
      listing_id: listingId,
    });

    if (!error) onSaved(listingId);
  }

  return (
    <button
      type="button"
      className={isSaved ? "btn" : "btn secondary"}
      style={{ width: "100%" }}
      onClick={handleSave}
      disabled={isSaved}
    >
      {isSaved ? "Saved" : "Save"}
    </button>
  );
}

function ListingCard({
  item,
  savedIds,
  onSaved,
}: {
  item: LiveListing;
  savedIds: Set<string>;
  onSaved: (id: string) => void;
}) {
  const phone = item.contact_phone || "";

  return (
    <div className="card pad" style={{ minWidth: 280 }}>
      <div className="flex between gap-12">
        <div>
          {item.featured ? <span className="badge featured">Featured</span> : null}
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 8 }}>
            {item.title}
          </div>
          <div className="small muted">{item.type}</div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 700 }}>{item.price || "Contact"}</div>
        </div>
      </div>

      <div className="small muted" style={{ marginTop: 10 }}>
        📍 {[item.community, item.district, item.parish].filter(Boolean).join(", ")}
      </div>

      {item.image_url ? (
        <img
          src={item.image_url}
          alt="listing"
          style={{
            width: "100%",
            height: 180,
            objectFit: "cover",
            borderRadius: 12,
            marginTop: 12,
          }}
        />
      ) : null}

      {item.description ? (
        <div className="small" style={{ marginTop: 10 }}>
          {item.description}
        </div>
      ) : null}

      <div
        className="grid"
        style={{ gridTemplateColumns: "repeat(3,1fr)", marginTop: 12 }}
      >
        <a
          className="btn"
          href={makeWhatsAppLink(phone, `Hi, I saw ${item.title} on Naberly.`)}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp
        </a>

        <a className="btn secondary" href={phone ? makeTelLink(phone) : "#"}>
          Call
        </a>

        <SaveButton listingId={item.id} savedIds={savedIds} onSaved={onSaved} />
      </div>
    </div>
  );
}

export default function HomePage() {
  const [rows, setRows] = useState<LiveListing[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | "">("");
  const [search, setSearch] = useState("");
  const [parish, setParish] = useState("all");
  const [quick, setQuick] = useState<QuickFilter>("Newest");
  const [msg, setMsg] = useState("");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadListings();
    loadSaved();

    const timer = setInterval(() => {
      loadListings();
    }, 15000);

    return () => clearInterval(timer);
  }, []);

  async function loadListings() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      setMsg(error.message);
      return;
    }

    setRows(data || []);
    setMsg("");
  }

  async function loadSaved() {
    if (!supabase) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return;

    const { data, error } = await supabase
      .from("favorite_listings")
      .select("listing_id")
      .eq("user_id", session.user.id);

    if (!error && data) {
      setSavedIds(new Set(data.map((x: { listing_id: string }) => x.listing_id)));
    }
  }

  function handleSaved(id: string) {
    setSavedIds((prev) => new Set(prev).add(id));
  }

  const filtered = useMemo(() => {
    let result = rows.filter((item) => {
      const matchesCategory = selectedCategory
        ? normalizeCategory(item.category) === selectedCategory
        : true;

      const matchesParish = parish === "all" ? true : item.parish === parish;

      const text = `${item.title} ${item.type} ${item.description}`.toLowerCase();

      const matchesSearch = search ? text.includes(search.toLowerCase()) : true;

      return matchesCategory && matchesParish && matchesSearch;
    });

    if (quick === "Free") {
      result = result.filter((x) =>
        (x.price || "").toLowerCase().includes("free")
      );
    }

    if (quick === "Featured") {
      result = result.filter((x) => x.featured);
    }

    return result;
  }, [rows, selectedCategory, parish, search, quick]);

  const featured = rows.filter((x) => x.featured).slice(0, 10);

  function handleCategoryTap(id: CategoryId) {
    if (id === "sell-offer") {
      window.location.href = "/post";
      return;
    }

    setSelectedCategory(id);

    setTimeout(() => {
      const el = document.getElementById("results-section");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  }

  return (
    <div
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: 12,
        overflowX: "hidden",
        paddingBottom: 90,
      }}
    >
      <div className="card pad">
        <div className="flex between center gap-12">
          <div>
            <div style={{ fontWeight: 800, fontSize: 28 }}>Naberly</div>
            <div className="small muted">Jamaica Launch • Naberly JA</div>

            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 10 }}>
              How can Naberly help you today?
            </div>

            <div className="small muted" style={{ marginTop: 8 }}>
              Your Naberhood at your fingertips.
            </div>
          </div>

          <div className="flex gap-8 wrap">
            <Link href="/login" className="btn secondary" style={{ width: "auto" }}>
              Login
            </Link>

            <Link href="/signup" className="btn secondary" style={{ width: "auto" }}>
              Sign Up
            </Link>
          </div>
        </div>

        <div className="grid" style={{ marginTop: 14 }}>
          <input
            className="input"
            placeholder="Search listings"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="select"
            value={parish}
            onChange={(e) => setParish(e.target.value)}
          >
            <option value="all">All parishes</option>

            {parishes.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="actions-grid" style={{ marginTop: 14 }}>
          {categories.map((c) => (
            <button
              key={c.id}
              className={`action-btn ${selectedCategory === c.id ? "active" : ""}`}
              onClick={() => handleCategoryTap(c.id as CategoryId)}
            >
              <div style={{ fontSize: 24 }}>{c.emoji}</div>
              <div>{c.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card pad" style={{ marginTop: 14 }}>
        <div className="flex between center">
          <div style={{ fontSize: 22, fontWeight: 700 }}>
            Featured Nearby
          </div>

          <div className="small muted">Swipe sideways</div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            overflowX: "auto",
            paddingTop: 12,
            paddingBottom: 6,
          }}
        >
          {featured.map((item) => (
            <ListingCard
              key={item.id}
              item={item}
              savedIds={savedIds}
              onSaved={handleSaved}
            />
          ))}
        </div>
      </div>

      <div className="quick-filters" style={{ marginTop: 14 }}>
        {quickFilters.map((q) => (
          <button
            key={q}
            className={quick === q ? "btn" : "btn secondary"}
            style={{ width: "auto" }}
            onClick={() => setQuick(q)}
          >
            {q}
          </button>
        ))}
      </div>

      {msg ? (
        <div className="card pad muted" style={{ marginTop: 14 }}>
          {msg}
        </div>
      ) : null}

      <div id="results-section" className="grid" style={{ marginTop: 14 }}>
        {filtered.map((item) => (
          <ListingCard
            key={item.id}
            item={item}
            savedIds={savedIds}
            onSaved={handleSaved}
          />
        ))}
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "white",
          borderTop: "1px solid #ddd",
          padding: 10,
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 8,
          zIndex: 50,
        }}
      >
        <Link href="/" className="btn secondary" style={{ width: "100%" }}>
          Home
        </Link>

        <Link href="/post" className="btn" style={{ width: "100%" }}>
          Post
        </Link>

        <Link href="/favorites" className="btn secondary" style={{ width: "100%" }}>
          Saved
        </Link>

        <Link href="/login" className="btn secondary" style={{ width: "100%" }}>
          Login
        </Link>
      </div>
    </div>
  );
}