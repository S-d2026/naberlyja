import Link from "next/link";

export default function FeaturedPage() {
  const whatsappNumber = "19174432797";

  const message = encodeURIComponent(
    "Hi Naberly JA, I want to boost my listing. I saw the first boost is free. Please help me activate it."
  );

  return (
    <div style={{ width: "100%", maxWidth: 760, margin: "0 auto", padding: 12 }}>
      <div className="card pad">
        <div style={{ fontWeight: 800, fontSize: 28 }}>Boost Your Listing</div>

        <div className="small muted" style={{ marginTop: 8 }}>
          Get more visibility on Naberly JA.
        </div>

        <div className="card pad" style={{ background: "#ecfdf5", marginTop: 18 }}>
          <strong>First Boost Free</strong>
          <div className="small muted" style={{ marginTop: 6 }}>
            Early vendors can request their first featured boost free.
          </div>
        </div>

        <div className="grid" style={{ marginTop: 18 }}>
          <div className="card pad" style={{ background: "#f8fafc" }}>
            <strong>Daily Boost</strong>
            <div>JMD $300 / 24 hours</div>
          </div>

          <div className="card pad" style={{ background: "#f8fafc" }}>
            <strong>Weekend Boost</strong>
            <div>JMD $700 / Friday–Sunday</div>
          </div>

          <div className="card pad" style={{ background: "#f8fafc" }}>
            <strong>Weekly Boost</strong>
            <div>JMD $1,500 / 7 days</div>
          </div>
        </div>

        <div className="card pad" style={{ background: "#fff7ed", marginTop: 18 }}>
          Pay by cash, transfer, Lynk, or agreed local method. Naberly will manually activate your boost after confirmation.
        </div>

        <div className="grid" style={{ marginTop: 18 }}>
          <a
            className="btn"
            href={`https://wa.me/${whatsappNumber}?text=${message}`}
            target="_blank"
            rel="noreferrer"
          >
            Message Naberly to Boost
          </a>

          <Link href="/my-listings" className="btn secondary">
            Back to My Listings
          </Link>

          <Link href="/" className="btn secondary">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
