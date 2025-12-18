export type Provider = "Hepsiburada" | "Trendyol";
export type Currency = "TRY";

export type Product = {
  id: string;
  title: string;
  price: number;
  currency: Currency;
  provider: Provider;
  query: string;
  tags: string[];
};

const catalog = [
  {
    id: "p-001",
    title: "French Press Coffee Maker 600ml",
    price: 499,
    currency: "TRY",
    provider: "Hepsiburada",
    query: "french press",
    tags: ["coffee", "kitchen", "home"],
  },
  {
    id: "p-002",
    title: "Wireless Earbuds (Bluetooth)",
    price: 1299,
    currency: "TRY",
    provider: "Hepsiburada",
    query: "wireless earbuds bluetooth",
    tags: ["music", "tech", "gym"],
  },
  {
    id: "p-003",
    title: "Insulated Travel Mug",
    price: 599,
    currency: "TRY",
    provider: "Hepsiburada",
    query: "travel mug termos",
    tags: ["coffee", "travel", "work"],
  },
  {
    id: "p-004",
    title: "Dumbbell Set (Adjustable)",
    price: 1499,
    currency: "TRY",
    provider: "Hepsiburada",
    query: "ayarlanabilir dambıl seti",
    tags: ["gym", "fitness", "sport"],
  },
  {
    id: "p-005",
    title: "Hardcover Notebook (A5)",
    price: 249,
    currency: "TRY",
    provider: "Hepsiburada",
    query: "a5 sert kapak defter",
    tags: ["books", "study", "office"],
  },
  {
    id: "p-006",
    title: "LEGO Style Building Set",
    price: 999,
    currency: "TRY",
    provider: "Hepsiburada",
    query: "lego yapım seti",
    tags: ["fun", "creative", "hobby"],
  },
  {
    id: "p-007",
    title: "Skincare Gift Set",
    price: 899,
    currency: "TRY",
    provider: "Hepsiburada",
    query: "cilt bakım seti",
    tags: ["selfcare", "beauty", "home"],
  },
  {
    id: "p-008",
    title: "Scented Candle Set (3 pcs)",
    price: 349,
    currency: "TRY",
    provider: "Hepsiburada",
    query: "kokulu mum seti",
    tags: ["home", "cozy", "relax", "candle"],
  },
] satisfies Product[]; // ✅ Forces every item to match Product type

export default catalog;
