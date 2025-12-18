export function buildSearchUrl(provider: "Hepsiburada" | "Trendyol", query: string) {
  const q = encodeURIComponent(query); // Encodes query safely for URL
  if (provider === "Trendyol") return `https://www.trendyol.com/sr?q=${q}`; // Trendyol search URL
  return `https://www.hepsiburada.com/ara?q=${q}`; // Hepsiburada search URL
}
