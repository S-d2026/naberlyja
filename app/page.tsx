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

export default function HomePage() {
  const [rows, setRows] = useState<LiveListing[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | "">("");
  const [search, setSearch] = useState("");
  const [parish, setParish] = useState("all");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadListings();
  }, []);

  async function loadListings() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (!error) setRows(data || []);
  }

  const filtered = useMemo(() => {
    return rows.filter((item) => {
      const text = `${item.title} ${item.type} ${item.description}`.toLowerCase();

      return (
        (!selectedCategory || item.category === selectedCategory) &&
        (parish === "all" || item.parish === parish) &&
        (!search || text.includes(search.toLowerCase()))
      );
    });
  }, [rows, selectedCategory, parish, search]);

  // 🔥 SEARCH JUMP FIX
  useEffect(() => {
    if (!search.trim()) return;

    setTimeout(() => {
      document.getElementById("results-section")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 250);
  }, [search]);

  function handleCategoryTap(id: CategoryId) {
    setSelectedCategory(id);

    setTimeout(() => {
      document.getElementById("results-section")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 120);
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 12 }}>
      <div className="card pad">

        {/* HEADER */}
        <h1>Naberly</h1>
        <div className="small muted">Jamaica Launch</div>

        <h2>How can Naberly help you today?</h2>

        {/* SEARCH + PARISH */}
        <div className="grid" style={{ marginTop: 12 }}>
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

        {/* ✅ NEED HELP BLOCK (RESTORED) */}
        <div className="card pad" style={{ background: "#ecfdf5", marginTop: 14 }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>
            Need help nearby?
          </div>

          <div className="small muted" style={{ marginTop: 6 }}>
            Ask for help or offer help in your Naberhood.
          </div>

          <div className="grid" style={{ marginTop: 12 }}>
            <button
              className="btn"
              onClick={() => {
                setSelectedCategory("emergency-help");
                setTimeout(() => {
                  document.getElementById("results-section")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }, 100);
              }}
            >
              See Help Requests
            </button>

            <Link
              href="/post?category=emergency-help&type=I Need Help"
              className="btn secondary"
            >
              I Need Help
            </Link>

            <Link
              href="/post?category=emergency-help&type=I Can Help"
              className="btn secondary"
            >
              I Can Help
            </Link>
          </div>
        </div>

        {/* CATEGORY BUTTONS */}
        <div className="actions-grid" style={{ marginTop: 14 }}>
          {categories.map((c) => (
            <button
              key={c.id}
              className="action-btn"
              onClick={() => handleCategoryTap(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* NO RESULTS MESSAGE */}
        {filtered.length === 0 && (
          <div className="card pad muted" style={{ marginTop: 12 }}>
            No results found.
          </div>
        )}

        {/* RESULTS */}
        <div
          id="results-section"
          style={{ marginTop: 14, display: "grid", gap: 12 }}
        >
          {filtered.map((item) => (
            <div key={item.id} className="card pad">
              <strong>{item.title}</strong>
              <div>{item.type}</div>
              <div>{item.price}</div>

              <div className="grid">
                <a
                  className="btn"
                  href={makeWhatsAppLink(item.contact_phone || "", "Hi")}
                >
                  WhatsApp
                </a>

                <a
                  className="btn secondary"
                  href={makeTelLink(item.contact_phone || "")}
                >
                  Call
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}