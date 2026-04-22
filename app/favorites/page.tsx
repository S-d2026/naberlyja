"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { makeTelLink, makeWhatsAppLink } from "@/lib/links";

type FavoriteRow = {
  id: string;
  listing_id: string;
  listings: {
    id: string;
    title: string | null;
    type: string | null;
    price: string | null;
    parish: string | null;
    district: string | null;
    community: string | null;
    contact_phone: string | null;
    image_url: string | null;
    description: string | null;
  } | null;
};

export default function FavoritesPage() {
  const [rows, setRows] = useState<FavoriteRow[]>([]);
  const [msg, setMsg] = useState("Loading saved items...");

  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites() {
    if (!supabase) {
      setMsg("Supabase is not configured.");
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setMsg("Please log in to see saved items.");
      return;
    }

    const { data, error } = await supabase
      .from("favorite_listings")
      .select("id, listing_id, listings(*)")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      setMsg(error.message);
      return;
    }

    setRows((data as FavoriteRow[]) || []);
    setMsg(data && data.length ? "" : "No saved items yet.");
  }

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: 12 }}>
      <div className="card pad">
        <div className="flex between center gap-12">
          <div>
            <div style={{ fontWeight: 800, fontSize: 28 }}>Saved Items</div>
            <div className="small muted">Listings you want to come back to</div>
          </div>

          <Link href="/" className="btn secondary" style={{ width: "auto" }}>
            Home
          </Link>
        </div>
      </div>

      {msg ? (
        <div className="card pad muted" style={{ marginTop: 14 }}>
          {msg}
        </div>
      ) : null}

      <div className="grid" style={{ marginTop: 14 }}>
        {rows.map((row) => {
          const item = row.listings;
          if (!item) return null;

          return (
            <div key={row.id} className="card pad">
              <div className="flex between gap-12">
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{item.title}</div>
                  <div className="small muted">{item.type}</div>
                </div>

                <div style={{ fontWeight: 700 }}>{item.price || "Contact"}</div>
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
                style={{ gridTemplateColumns: "repeat(2,1fr)", marginTop: 12 }}
              >
                <a
                  className="btn"
                  href={makeWhatsAppLink(
                    item.contact_phone || "",
                    `Hi, I saw ${item.title} on Naberly.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>

                <a
                  className="btn secondary"
                  href={item.contact_phone ? makeTelLink(item.contact_phone) : "#"}
                >
                  Call
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}