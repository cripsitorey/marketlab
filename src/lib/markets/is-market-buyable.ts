import type { Market } from "@/lib/markets/types";

type BuyableMarket = Pick<Market, "status" | "close_date">;

export function isMarketBuyable(
  market: BuyableMarket,
  now: Date = new Date(),
): boolean {
  return market.status === "open" && new Date(market.close_date) > now;
}
