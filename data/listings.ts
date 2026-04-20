export type CategoryId =
  | "need-food"
  | "sell-offer"
  | "need-work"
  | "hire-worker"
  | "buy-sell"
  | "need-ride"
  | "events"
  | "emergency-help"
  | "services";

export type Listing = {
  id: number;
  title: string;
  category: CategoryId;
  parish: string;
  district: string;
  community: string;
  price: string;
  type: string;
  distance: string;
  contactPhone: string;
  seller: string;
  featured: boolean;
  urgent: boolean;
  whatsappNumber?: string;
};

export const parishes = [
  "Kingston",
  "St Andrew",
  "St Catherine",
  "Clarendon",
  "Manchester",
  "St Elizabeth",
  "Westmoreland",
  "Hanover",
  "St James",
  "Trelawny",
  "St Ann",
  "St Mary",
  "Portland",
  "St Thomas",
];

export const categories = [
  { id: "need-food", label: "Need Food", emoji: "🍲" },
  { id: "sell-offer", label: "Sell / Offer Anything", emoji: "➕" },
  { id: "need-work", label: "Need Work", emoji: "💼" },
  { id: "hire-worker", label: "Hire Worker", emoji: "🛠️" },
  { id: "buy-sell", label: "Buy / Sell", emoji: "🛍️" },
  { id: "need-ride", label: "Need Ride", emoji: "🚗" },
  { id: "events", label: "Events", emoji: "📅" },
  { id: "emergency-help", label: "Emergency Help", emoji: "🚨" },
  { id: "services", label: "Services", emoji: "⭐" },
] as const;

export const listings: Listing[] = [
  {
    id: 1,
    title: "Free bread and soup packs",
    category: "need-food",
    parish: "Kingston",
    district: "Central Kingston",
    community: "Downtown",
    price: "Free",
    type: "Community Help",
    distance: "0.8 km",
    contactPhone: "+18765550101",
    whatsappNumber: "18765550101",
    seller: "Hope Kitchen",
    featured: true,
    urgent: true
  },
  {
    id: 2,
    title: "Fresh callaloo and tomatoes",
    category: "buy-sell",
    parish: "St Andrew",
    district: "North East St Andrew",
    community: "Half Way Tree",
    price: "JMD 500",
    type: "Produce",
    distance: "1.4 km",
    contactPhone: "+18765550102",
    whatsappNumber: "18765550102",
    seller: "Miss Bev Produce",
    featured: true,
    urgent: false
  },
  {
    id: 3,
    title: "Day work available now",
    category: "need-work",
    parish: "St Catherine",
    district: "Portmore",
    community: "Portmore",
    price: "JMD 6,000/day",
    type: "Construction",
    distance: "2.2 km",
    contactPhone: "+18765550103",
    seller: "Carter Builds",
    featured: false,
    urgent: true
  },
  {
    id: 4,
    title: "Need plumber for leaking pipe",
    category: "hire-worker",
    parish: "Kingston",
    district: "East Rural Kingston",
    community: "Papine",
    price: "Budget posted",
    type: "Home Repair",
    distance: "3.1 km",
    contactPhone: "+18765550104",
    whatsappNumber: "18765550104",
    seller: "Resident Request",
    featured: false,
    urgent: true
  },
  {
    id: 5,
    title: "Taxi ride to Coronation Market",
    category: "need-ride",
    parish: "Kingston",
    district: "South St Andrew",
    community: "Cross Roads",
    price: "JMD 700",
    type: "Transport",
    distance: "1.0 km",
    contactPhone: "+18765550105",
    seller: "QuickRide JA",
    featured: false,
    urgent: false
  },
  {
    id: 6,
    title: "Community food fair this Saturday",
    category: "events",
    parish: "St James",
    district: "Montego Bay",
    community: "Montego Bay",
    price: "Free Entry",
    type: "Event",
    distance: "4.0 km",
    contactPhone: "+18765550106",
    whatsappNumber: "18765550106",
    seller: "Mobay Events",
    featured: true,
    urgent: false
  },
  {
    id: 7,
    title: "Hair braiding appointment today",
    category: "services",
    parish: "St Andrew",
    district: "North West St Andrew",
    community: "Constant Spring",
    price: "JMD 3,500",
    type: "Beauty",
    distance: "2.8 km",
    contactPhone: "+18765550107",
    whatsappNumber: "18765550107",
    seller: "Styled by K",
    featured: false,
    urgent: false
  },
  {
    id: 8,
    title: "Family meal boxes ready now",
    category: "sell-offer",
    parish: "St Catherine",
    district: "Spanish Town",
    community: "Spanish Town",
    price: "JMD 1,200",
    type: "Cookshop",
    distance: "1.7 km",
    contactPhone: "+18765550108",
    whatsappNumber: "18765550108",
    seller: "Auntie Pats Kitchen",
    featured: true,
    urgent: false
  }
];
