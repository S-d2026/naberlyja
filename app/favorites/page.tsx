import { listings } from "@/data/listings";
import ListingCard from "@/components/ListingCard";

export default function FavoritesPage() {
  return (
    <div className="grid">
      <div className="card pad">
        <div className="section-title">Saved Listings</div>
        <div className="small muted" style={{ marginTop: 8 }}>
          Starter view. Connect Supabase favorites table for per-user saved items.
        </div>
      </div>
      <div className="listings-grid">
        {listings.slice(0, 3).map((item) => <ListingCard key={item.id} item={item} />)}
      </div>
    </div>
  );
}
