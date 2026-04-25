function getUrgencyBadge(item: LiveListing) {
  const text =
    `${item.title || ""} ${item.type || ""} ${item.description || ""} ${item.price || ""}`.toLowerCase();

  if (
    text.includes("urgent") ||
    text.includes("emergency") ||
    text.includes("need now")
  ) {
    return "Urgent";
  }

  if (
    text.includes("today") ||
    text.includes("ready now") ||
    text.includes("available today")
  ) {
    return "Today";
  }

  if (
    text.includes("free") ||
    text.includes("rescue") ||
    text.includes("donation")
  ) {
    return "Free / Support";
  }

  return "";
}

/* INSIDE ListingCard:
paste directly under:
{item.featured ? <span className="badge featured">Featured</span> : null}
*/

{getUrgencyBadge(item) ? (
  <span className="badge" style={{ marginLeft: 6 }}>
    {getUrgencyBadge(item)}
  </span>
) : null}

/* INSIDE HomePage:
paste after filtered useMemo and before:
const featured = rows.filter((x) => x.featured).slice(0, 10);
*/

useEffect(() => {
  if (!search.trim()) return;

  const timer = setTimeout(() => {
    document.getElementById("results-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 250);

  return () => clearTimeout(timer);
}, [search]);

/* ABOVE:
<div id="results-section"
*/

{filtered.length === 0 && (
  <div
    className="card pad muted"
    style={{ marginTop: 4, gridColumn: "1 / -1" }}
  >
    No results found.
  </div>
)}