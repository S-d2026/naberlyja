export function makeWhatsAppLink(number?: string, text?: string) {
  if (!number) return "#";
  const clean = number.replace(/\D/g, "");
  const message = encodeURIComponent(text || "Hi, I found your listing on Naberly JA.");
  return `https://wa.me/${clean}?text=${message}`;
}

export function makeTelLink(number: string) {
  return `tel:${number.replace(/\s+/g, "")}`;
}
