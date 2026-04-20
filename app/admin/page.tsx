"use client";

import { useState } from "react";
import { listings } from "@/data/listings";

export default function AdminPage() {
  const [statusMsg, setStatusMsg] = useState("");

  return (
    <div className="grid">
      <div className="card pad">
        <div className="section-title">Admin Moderation</div>
        <div className="small muted" style={{ marginTop: 8 }}>
          This page is a launch starter. Connect Supabase queries here for real moderation.
        </div>
      </div>

      {listings.map((item) => (
        <div key={item.id} className="card pad">
          <div style={{ fontSize: 20, fontWeight: 700 }}>{item.title}</div>
          <div className="small muted" style={{ marginTop: 4 }}>
            {item.community}, {item.district}, {item.parish}
          </div>
          <div className="small" style={{ marginTop: 8 }}>{item.type} · {item.price}</div>
          <div className="flex wrap gap-12" style={{ marginTop: 12 }}>
            <button className="btn" style={{ width: "auto" }} onClick={() => setStatusMsg(`Approved ${item.title}`)}>Approve</button>
            <button className="btn secondary" style={{ width: "auto" }} onClick={() => setStatusMsg(`Rejected ${item.title}`)}>Reject</button>
            <button className="btn outline" style={{ width: "auto" }} onClick={() => setStatusMsg(`Marked ${item.title} as featured`)}>Mark Featured</button>
          </div>
        </div>
      ))}

      {statusMsg && <div className="small muted">{statusMsg}</div>}
    </div>
  );
}
