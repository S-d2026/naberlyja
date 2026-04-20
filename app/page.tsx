"use client";

import { useMemo, useState } from "react";
import ListingCard from "@/components/ListingCard";
import { categories, listings, parishes, CategoryId } from "@/data/listings";

const quickFilters = ["Free", "Nearest", "Featured", "Urgent", "Low Cost"] as const;
type QuickFilter = (typeof quickFilters)[number];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | "">("");
  const [activeTab, setActiveTab] = useState<"browse" | "post" | "saved">("browse");
  const [parish, setParish] = useState("all");
  const [search, setSearch] = useState("");
  const [activeQuickFilter, setActiveQuickFilter] = useState<QuickFilter>("Nearest");
  const [posted, setPosted] = useState(false);

  const filteredListings = useMemo(() => {
    let result = listings.filter((item) => {
      const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
      const matchesParish = parish === "all" ? true : item.parish === parish;
      const hay = `${item.title} ${item.seller} ${item.community} ${item.district} ${item.parish} ${item.type}`.toLowerCase();
      const matchesSearch = search ? hay.includes(search.toLowerCase()) : true;
      return matchesCategory && matchesParish && matchesSearch;
    });

    if (activeQuickFilter === "Free") {
      result = result.filter((item) => item.price.toLowerCase().includes("free"));
    }
    if (activeQuickFilter === "Featured") {
      result = result.filter((item) => item.featured);
    }
    if (activeQuickFilter === "Urgent") {
      result = result.filter((item) => item.urgent);
    }
    if (activeQuickFilter === "Low Cost") {
      result = result.filter((item) => {
        const m = item.price.match(/(\d+[\d,]*)/);
        if (!m) return false;
        const numeric = parseInt(m[1].replace(/,/g, ""), 10);
        return numeric <= 1500;
      });
    }
    return result;
  }, [selectedCategory, parish, search, activeQuickFilter]);

  const featuredListings = filteredListings.filter((item) => item.featured);

  return (
    <div className="grid-main">
      <div className="grid">
        <div className="card hero pad">
          <div className="flex between center gap-12">
            <div>
              <div className="tiny muted" style={{ textTransform: "uppercase", letterSpacing: 1 }}>Naberly JA</div>
              <div className="h1">What yuh need, near yuh.</div>
              <div className="muted">Find food, products, work, services, rides, events, and help in your district or community with one tap.</div>
            </div>
            <button className="btn secondary" style={{ maxWidth: 140 }}>Alerts</button>
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
              {parishes.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <button className="btn">Voice</button>
          </div>

          <div className="actions-grid" style={{ marginTop: 16 }}>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`action-btn ${selectedCategory === category.id ? "active" : ""}`}
                onClick={() => {
                  setSelectedCategory(category.id as CategoryId);
                  setActiveQuickFilter("Nearest");
                  setActiveTab(category.id === "sell-offer" ? "post" : "browse");
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
            <div className="small muted">Paid business pro placements</div>
          </div>
          <div className="featured-scroll" style={{ marginTop: 12 }}>
            {featuredListings.length ? featuredListings.map((item) => (
              <div key={item.id} className="featured-item">
                <ListingCard item={item} />
              </div>
            )) : <div className="small muted">No featured listings in this view yet.</div>}
          </div>
        </div>

        <div className="tabs">
          {["browse", "post", "saved"].map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab as "browse" | "post" | "saved")}
            >
              {tab[0].toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "browse" && (
          <div className="grid">
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
            <div className="listings-grid">
              {filteredListings.length ? filteredListings.map((item) => (
                <ListingCard key={item.id} item={item} />
              )) : (
                <div className="card pad muted">No matching listings yet in this view.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === "post" && (
          <div className="card pad">
            <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Sell / Offer Anything</div>
            <div className="grid">
              <input className="input" placeholder="Title" />
              <input className="input" placeholder="Price or Free" />
              <select className="select" defaultValue="Kingston">
                {parishes.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <input className="input" placeholder="District" />
              <input className="input" placeholder="Community" />
              <input className="input" placeholder="Phone / WhatsApp" />
              <input
                className="input"
                placeholder="What are you offering or needing?"
                defaultValue={
                  selectedCategory
                    ? categories.find((c) => c.id === selectedCategory)?.label || "Sell / Offer Anything"
                    : "Sell / Offer Anything"
                }
              />
              <div className="grid" style={{ gridTemplateColumns: "repeat(2, minmax(0,1fr))" }}>
                <button className="btn" type="button">Upload Photo</button>
                <button className="btn secondary" type="button">Voice Entry</button>
              </div>
              <button className="btn" type="button" onClick={() => setPosted(true)}>Publish Listing</button>
              {posted && <div className="small success">Listing published successfully.</div>}
            </div>
          </div>
        )}

        {activeTab === "saved" && (
          <div className="card pad muted">Saved listings, recent contacts, and favorite vendors will appear here.</div>
        )}
      </div>

      <div className="grid">
        <div className="card pad">
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Launch Control</div>
          <div className="stat-grid">
            <div className="card pad" style={{ background: "#f8fafc" }}>
              <div className="small muted">Active listings</div>
              <div style={{ fontSize: 32, fontWeight: 800 }}>1,284</div>
            </div>
            <div className="card pad" style={{ background: "#f8fafc" }}>
              <div className="small muted">Vendors live</div>
              <div style={{ fontSize: 32, fontWeight: 800 }}>326</div>
            </div>
            <div className="card pad" style={{ background: "#f8fafc" }}>
              <div className="small muted">Food posts today</div>
              <div style={{ fontSize: 32, fontWeight: 800 }}>94</div>
            </div>
            <div className="card pad" style={{ background: "#f8fafc" }}>
              <div className="small muted">Jobs today</div>
              <div style={{ fontSize: 32, fontWeight: 800 }}>41</div>
            </div>
          </div>
          <div className="grid" style={{ marginTop: 12 }}>
            <button className="btn">Open Admin Dashboard</button>
            <button className="btn secondary">Approve New Listings</button>
          </div>
        </div>

        <div className="card pad">
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Vendor onboarding</div>
          <div className="grid small muted">
            <div className="card pad" style={{ background: "#f8fafc" }}>Step 1: Free sign-up with phone number</div>
            <div className="card pad" style={{ background: "#f8fafc" }}>Step 2: Add product, service, food, job, ride, housing or need</div>
            <div className="card pad" style={{ background: "#f8fafc" }}>Step 3: Choose free or Pro featured placement</div>
            <div className="card pad" style={{ background: "#f8fafc" }}>Step 4: Start receiving local messages and calls</div>
          </div>
        </div>

        <div className="card pad">
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Mobile bottom nav</div>
          <div className="mobile-nav">
            {["Home", "Search", "Post", "Saved", "Profile"].map((label) => (
              <div key={label} className="mobile-nav-item small">{label}</div>
            ))}
          </div>
        </div>

        <div className="card pad" style={{ background: "#0f172a", color: "white" }}>
          <div className="tiny" style={{ textTransform: "uppercase", letterSpacing: 1, color: "#cbd5e1" }}>Recommended stack</div>
          <div style={{ fontSize: 24, fontWeight: 700, margin: "8px 0" }}>Launch web-first, mobile-fast.</div>
          <div className="small" style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
            Use Next.js on Vercel, Supabase Auth + Postgres + Storage + Realtime. Add React Native only after core marketplace behavior is proven.
          </div>
        </div>
      </div>
    </div>
  );
}
