export type Product = {
  id: string;
  title: string;
  price: number;
  currency: "TRY";
  provider: "Hepsiburada" | "Trendyol";
  query: string; // Used to build search link
  tags: string[];
};

const catalog: Product[] = [
  {
    id: "p-001",
    title: "French Press Coffee Maker 600ml",
    price: 499,
    currency: "TRY",
    provider: "Hepsiburada",
    query: "french press",
    tags: ["coffee", "home", "kitchen"],
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
    title: "Scented Candle Set (3 pcs)",
    price: 349,
    currency: "TRY",
    provider: "Hepsiburada",
    query: "scented candle set",
    tags: ["home", "cozy", "relax"],
  },
];

export default catalog;
