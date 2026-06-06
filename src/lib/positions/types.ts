import type { MarketStatus } from "@/lib/markets/types";

export type MarketSide = "yes" | "no";

export type UserPositionSummary = {
  yes_shares_cents: number;
  no_shares_cents: number;
};

export type PositionMarketSummary = {
  id: string;
  title: string;
  status: MarketStatus;
  close_date: string;
};

export type PositionWithMarket = UserPositionSummary & {
  market: PositionMarketSummary;
};
