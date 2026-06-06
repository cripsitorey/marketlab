import type { Tables } from "@/lib/supabase/database.types";

export type Market = Tables<"markets">;

export type MarketStatus = "open" | "closed" | "resolved";

export type PositionTotals = {
  yesTotal: number;
  noTotal: number;
};

export type PositionTotalsResult =
  | { available: true; totals: PositionTotals }
  | { available: false; reason: "empty" | "error" | "rls" };

export type YesChanceResult =
  | { available: true; yesChance: number }
  | { available: false; yesChance: 50 };

export type ProbabilityPoint = {
  timestamp: string;
  yesChance: number;
};

export type ProbabilitySeries = {
  points: ProbabilityPoint[];
  mode: "history" | "flat";
  label: string;
};

export type LedgerAggregateEntry = {
  created_at: string;
  amount_cents: number;
  side: "yes" | "no";
};
