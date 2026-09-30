// TODAY: prices come from this dummy table.
// LATER: replace the body of getProgramPrice with the Sanity query
// (nothing else needs to change). Keep it in sync with the card prices.
const DUMMY_PRICES: Record<string, number> = {
  "salesx-intensive": 9999,
  "salesx-extended": 14999,
  "founders-first-sale": 19999,
  "executive-negotiation": 24999,
};

/** Price in whole rupees, or null if the program has no online price. */
export async function getProgramPrice(slug: string): Promise<number | null> {
  return DUMMY_PRICES[slug] ?? null;
}