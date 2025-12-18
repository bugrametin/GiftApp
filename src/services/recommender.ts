import type { Recommendation } from "../components/ProductCard";
import { buildSearchUrl } from "./linkBuilder";
import catalog from "./mockCatalog";

export type GiftFormPayload = {
  name?: string;
  age: number;
  relationship: string;
  occasion: string;
  budget: number;
  interests: string; // comma separated
  avoid: string; // comma separated
  notes: string;
};

type Scored = {
  rec: Recommendation;
  score: number;
  debug: {
    interestHits: string[];
    avoidHits: string[];
    budgetDelta: number;
  };
};

function normalizeTokens(s: string): string[] {
  return (s || "")
    .toLowerCase()
    .split(/[,\n]/g) // split by comma or newline
    .map((x) => x.trim())
    .filter(Boolean);
}

function containsAny(haystack: string, needles: string[]) {
  const h = (haystack || "").toLowerCase();
  return needles.filter((n) => n && h.includes(n.toLowerCase()));
}

// Budget closeness score: 0..1 (1 = perfect)
function budgetCloseness(price: number, budget: number): number {
  if (!budget || budget <= 0) return 0.4; // fallback if budget missing
  const ratio = price / budget;

  // Ideal: price <= budget and close to it
  if (ratio <= 1) {
    // price 0..budget => closeness increases as it approaches budget
    return 0.6 + 0.4 * ratio; // 0.6..1.0
  }

  // Over budget: penalize fast
  const over = ratio - 1; // 0..inf
  const penalty = Math.min(1, over); // cap
  return Math.max(0, 0.6 - 0.6 * penalty); // 0..0.6
}

function buildReason(opts: {
  interestHits: string[];
  avoidHits: string[];
  price: number;
  budget: number;
  provider: string;
}) {
  const parts: string[] = [];

  if (opts.interestHits.length) {
    parts.push(`Matches interests: ${opts.interestHits.slice(0, 3).join(", ")}`);
  } else {
    parts.push("General fit from catalog");
  }

  if (opts.budget) {
    const diff = opts.budget - opts.price;
    if (diff >= 0) parts.push(`Within budget (≈${diff} TRY under)`);
    else parts.push(`Over budget (≈${Math.abs(diff)} TRY)`);
  }

  if (opts.avoidHits.length) {
    parts.push(`⚠️ Avoid keyword hit: ${opts.avoidHits.slice(0, 2).join(", ")}`);
  }

  parts.push(`Provider: ${opts.provider}`);

  return parts.join(" • ");
}

export function recommendLocal(form: GiftFormPayload): { recommendations: Recommendation[] } {
  const interestTokens = normalizeTokens(form.interests);
  const avoidTokens = normalizeTokens(form.avoid);

  // Expand tokens a bit: allow single words
  const interestWords = interestTokens.flatMap((t) => t.split(/\s+/g)).filter(Boolean);
  const avoidWords = avoidTokens.flatMap((t) => t.split(/\s+/g)).filter(Boolean);

  const scored: Scored[] = catalog.map((p) => {
    const title = p.title.toLowerCase();
    const tags = (p.tags || []).map((t) => t.toLowerCase());

    // Interest hits: token appears in tags or title
    const interestHits = Array.from(
      new Set([
        ...interestWords.filter((t) => tags.includes(t)),
        ...containsAny(title, interestWords),
      ])
    );

    // Avoid hits: token appears in title or tags
    const avoidHits = Array.from(
      new Set([
        ...avoidWords.filter((t) => tags.includes(t)),
        ...containsAny(title, avoidWords),
      ])
    );

    // --- Scoring weights (easy to tune) ---
    const interestScore = Math.min(3, interestHits.length) * 18; // 0..54
    const closeness = budgetCloseness(p.price, form.budget); // 0..1
    const budgetScore = Math.round(closeness * 35); // 0..35

    // Avoid penalty
    const avoidPenalty = Math.min(2, avoidHits.length) * 35; // 0..70

    // Small bonus if price is under budget (encourage safe picks)
    const underBonus = form.budget && p.price <= form.budget ? 6 : 0;

    const score = interestScore + budgetScore + underBonus - avoidPenalty;

    const rec: Recommendation = {
      id: p.id,
      title: p.title,
      price: p.price,
      currency: p.currency,
      provider: p.provider,
      productUrl: buildSearchUrl(p.provider, p.query),
      reason: buildReason({
        interestHits,
        avoidHits,
        price: p.price,
        budget: form.budget,
        provider: p.provider,
      }),
    };

    return {
      rec,
      score,
      debug: {
        interestHits,
        avoidHits,
        budgetDelta: form.budget ? form.budget - p.price : 0,
      },
    };
  });

  // Optional hard filter: if avoid hits exist, drop item (stricter)
  // Şimdilik "drop" yerine "ceza" verdik. İstersen burayı açabiliriz.
  // const filtered = scored.filter(x => x.debug.avoidHits.length === 0);

  const sorted = scored
    .sort((a, b) => b.score - a.score)
    .map((x) => x.rec);

  return {
    recommendations: sorted.slice(0, 8),
  };
}
