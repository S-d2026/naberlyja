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
  if (value === "sell") return "sell-offer";
  if (value === "offer") return "sell-offer";
  if (value === "buy") return "buy-sell";
  if (value === "worker") return "hire-worker";
  if (value === "ride") return "need-ride";
  if (value === "help") return "emergency-help";

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

function ListingCard({ item }: { item: LiveListing }) {
  const phone = item.contact_phone || "";
  const sellerLabel = item.type || "Community Listing";

  return (
    <div className="card pad">
      <div className="flex between gap-12">
        <div>
          <div className="flex wrap gap-8" style={{ marginBottom: 8 }}>
            {item.featured ? <span className="badge featured">Featured</span> : null}
            {item.type ? <span className="badge">{item.type}</span> : null}
          </div>

          <div style={{ fontSize: 20, fontWeight: 700 }}>
            {item.title || "Untitled Listing"}
          </div>

          <div className="small muted" style={{ marginTop: 4 }}>
            {sellerLabel}
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 700 }}>{item.price || "Contact seller"}</div>
          <div className="small muted">
            {item.created_at
              ? new Date(item.created_at).toLocaleDateString()
              : "Posted recently"}
          </div>
        </div>
      </div>

      <div className="small muted" style={{ marginTop: 12 }}>
        📍 {[item.community, item.district, item.parish].filter(Boolean).join(", ")}
      </div>

      {item.description ? (
        <div className="small" style={{ marginTop: 10 }}>
          {item.description}
        </div>
      ) : null}

      <div
        className="grid"
        style={{ gridTemplateColumns: "repeat(2, minmax(0,1fr))", marginTop: 12 }}
      >
        <a
          className="btn"
          href={makeWhatsAppLink(
            phone,
            `Hi, I found your listing on Naberly JA and I am interested in ${item.title || "your post"}.`
          )}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp
        </a>

        <a className="btn outline" href={makeTelLink(phone || "")}>
          Call
        </a>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | "">("");
  const [parish, setParish] = useState("all");
  const [search, setSearch] = useState("");
  const [activeQuickFilter, setActiveQuickFilter] = useState<QuickFilter>("Newest");
  const [rows, setRows] = useState<LiveListing[]>([]);
  const [msg, setMsg] = useState("Loading approved listings...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApprovedListings();
  }, []);

  async function loadApprovedListings() {
    setLoading(true);

    if (!supabase) {
      setMsg("Supabase is not configured.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      setMsg(`Supabase error: ${error.message}`);
      setRows([]);
      setLoading(false);
      return;
    }

    setRows(data || []);
    setMsg(data && data.length ? "" : "No approved listings live yet.");
    setLoading(false);
  }

  const filteredRows = useMemo(() => {
    let result = rows.filter((item) => {
      const normalized = normalizeCategory(item.category);
      const matchesCategory = selectedCategory ? normalized === selectedCategory : true;
      const matchesParish = parish === "all" ? true : item.parish === parish;

      const hay = [
        item.title,
        item.type,
        item.description,
        item.community,
        item.district,
        item.parish,
        item.price,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = search ? hay.includes(search.toLowerCase()) : true;

      return matchesCategory && matchesParish && matchesSearch;
    });

    if (activeQuickFilter === "Free") {
      result = result.filter((item) => (item.price || "").toLowerCase().includes("free"));
    }

    if (activeQuickFilter === "Featured") {
      result = result.filter((item) => item.featured);
    }

    if (activeQuickFilter === "Low Cost") {
      result = result.filter((item) => {
        const raw = item.price || "";
        const match = raw.match(/(\d+[\d,]*)/);
        if (!match) return false;
        const value = parseInt(match[1].replace(/,/g, ""), 10);
        return value <= 1500;
      });
    }

    if (activeQuickFilter === "Newest") {
      result = [...result].sort((a, b) => {
        const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
        return bTime - aTime;
      });
    }

    return result;
  }, [rows, selectedCategory, parish, search, activeQuickFilter]);

  const featuredRows = filteredRows.filter((item) => item.featured);

  return (
    <div className="grid-main">
      <div className="grid">
        <div className="card hero pad">
          <div className="flex between center gap-12">
            <div>
              <div className="tiny muted" style={{ textTransform: "uppercase", letterSpacing: 1 }}>
                Naberly JA
              </div>
              <div className="h1">What yuh need, near yuh.</div>
              <div className="muted">
                Find approved live food, products, work, services, rides, events, and help in your
                district or community with one tap.
              </div>
            </div>

            <Link href="/login" className="btn secondary" style={{ maxWidth: 160 }}>
              Sign In
            </Link>
          </div>

          <div className="topbar-grid" style={{ marginTop: 16 }}>
            <input
              className="input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search food, workers, rides, events"
            />

            <select className="select" value={parish} onChange={(e) => setParish(e.target.value)}>
              <option value="all">All parishes</option>
              {parishes.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <Link href="/post" className="btn">
              Sell / Offer Anything
            </Link>
          </div>

          <div className="actions-grid" style={{ marginTop: 16 }}>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`action-btn ${selectedCategory === category.id ? "active" : ""}`}
                onClick={() => {
                  if (category.id === "sell-offer") {
                    window.location.href = "/post";
                    return;
                  }

                  setSelectedCategory(category.id as CategoryId);
                  setActiveQuickFilter("Newest");
                }}
              >
                <div style={{ fontSize: 26, marginBottom: 10 }}>{category.emoji}</div>
                <div style={{ fontWeight: 700 }}>{category.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="card pad" style={{ background: "#fef3c7" }}>
          <div className="flex between center gap-12">
            <div style={{ fontSize: 22, fontWeight: 700 }}>Featured in your area</div>
            <div className="small muted">Approved featured listings</div>
          </div>

          <div className="featured-scroll" style={{ marginTop: 12 }}>
            {featuredRows.length ? (
              featuredRows.map((item) => (
                <div key={item.id} className="featured-item">
                  <ListingCard item={item} />
                </div>
              ))
            ) : (
              <div className="small muted">No featured approved listings in this view yet.</div>
            )}
          </div>
        </div>

        <div className="quick-filters">
          {quickFilters.map((item) => (
            <button
              key={item}
              className={activeQuickFilter === item ? "btn" : "btn secondary"}
              style={{ width: "auto", minHeight: 40, padding: "8px 14px" }}
              onClick={() => setActiveQuickFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {loading && <div className="card pad muted">Loading approved listings...</div>}
        {!loading && msg && <div className="card pad muted">{msg}</div>}

        <div className="listings-grid">
          {filteredRows.map((item) => (
            <ListingCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div className="grid">
        <div className="card pad">
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Launch Control</div>

          <div className="stat-grid">
            <div className="card pad" style={{ background: "#f8fafc" }}>
              <div className="small muted">Approved live listings</div>
              <div style={{ fontSize: 32, fontWeight: 800 }}>{rows.length}</div>
            </div>

            <div className="card pad" style={{ background: "#f8fafc" }}>
              <div className="small muted">Featured live listings</div>
              <div style={{ fontSize: 32, fontWeight: 800 }}>
                {rows.filter((item) => item.featured).length}
              </div>
            </div>
          </div>

          <div className="grid" style={{ marginTop: 12 }}>
            <Link href="/admin" className="btn">
              Open Admin Dashboard
            </Link>
            <Link href="/post" className="btn secondary">
              Create New Listing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}