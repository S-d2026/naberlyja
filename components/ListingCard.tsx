import { Listing } from "@/data/listings";
import { makeTelLink, makeWhatsAppLink } from "@/lib/links";

export default function ListingCard({ item }: { item: Listing }) {
  return (
    <div className="card pad">
      <div className="flex between gap-12">
        <div>
          <div className="flex wrap gap-8" style={{ marginBottom: 8 }}>
            {item.featured && <span className="badge featured">Featured</span>}
            {item.urgent && <span className="badge urgent">Urgent</span>}
            <span className="badge">{item.type}</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{item.title}</div>
          <div className="small muted" style={{ marginTop: 4 }}>{item.seller}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 700 }}>{item.price}</div>
          <div className="small muted">{item.distance}</div>
        </div>
      </div>

      <div className="small muted" style={{ marginTop: 12 }}>
        📍 {item.community}, {item.district}, {item.parish}
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(2, minmax(0,1fr))", marginTop: 12 }}>
        <a className="btn" href={makeWhatsAppLink(item.whatsappNumber, `Hi ${item.seller}, I am interested in ${item.title}.`)} target="_blank" rel="noreferrer">
          WhatsApp
        </a>
        <a className="btn outline" href={makeTelLink(item.contactPhone)}>
          Call
        </a>
      </div>
    </div>
  );
}
