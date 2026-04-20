export default function FeaturedPage() {
  const tiers = [
    { name: "1 Day Boost", price: "JMD equivalent / custom price", note: "Good for urgent posts" },
    { name: "7 Day Featured", price: "JMD equivalent / custom price", note: "Best for active vendors" },
    { name: "30 Day Pro Placement", price: "JMD equivalent / custom price", note: "Top visibility across area" }
  ];

  return (
    <div className="grid">
      <div className="card pad">
        <div className="section-title">Featured Listing Payments</div>
        <div className="small muted" style={{ marginTop: 8 }}>
          Recommended Jamaica-first options: WiPay for hosted payment links and LynkBiz for simple vendor payment flows.
        </div>
      </div>

      {tiers.map((tier) => (
        <div key={tier.name} className="card pad">
          <div className="flex between center gap-12">
            <div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{tier.name}</div>
              <div className="small muted" style={{ marginTop: 4 }}>{tier.note}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 700 }}>{tier.price}</div>
              <button className="btn" style={{ width: "auto", marginTop: 8 }}>Pay Now</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
