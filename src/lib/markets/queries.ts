import { inferLedgerSide } from "@/lib/markets/probability";
import type {
  LedgerAggregateEntry,
  Market,
  PositionTotals,
  PositionTotalsResult,
} from "@/lib/markets/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getMarkets(): Promise<Market[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("markets")
    .select("*")
    .order("close_date", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch markets: ${error.message}`);
  }

  return data ?? [];
}

export async function getMarketById(id: string): Promise<Market | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("markets")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch market: ${error.message}`);
  }

  return data;
}

function sumPositionTotals(
  rows: Array<{
    yes_shares_cents: number;
    no_shares_cents: number;
  }>,
): PositionTotals {
  return rows.reduce(
    (acc, row) => ({
      yesTotal: acc.yesTotal + row.yes_shares_cents,
      noTotal: acc.noTotal + row.no_shares_cents,
    }),
    { yesTotal: 0, noTotal: 0 },
  );
}

export function evaluateMarketWidePositionTotals(
  rows: Array<{
    yes_shares_cents: number;
    no_shares_cents: number;
  }>,
  options?: { marketWide?: boolean },
): PositionTotalsResult {
  if (rows.length === 0) {
    return { available: false, reason: "empty" };
  }

  if (!options?.marketWide) {
    return { available: false, reason: "rls" };
  }

  const totals = sumPositionTotals(rows);

  if (totals.yesTotal + totals.noTotal <= 0) {
    return { available: false, reason: "empty" };
  }

  return { available: true, totals };
}

export async function getMarketPositionTotals(
  marketId: string,
): Promise<PositionTotalsResult> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("positions")
    .select("yes_shares_cents, no_shares_cents")
    .eq("market_id", marketId);

  if (error) {
    return { available: false, reason: "error" };
  }

  return evaluateMarketWidePositionTotals(data ?? []);
}

export function mapLedgerRowsToAggregates(
  rows: Array<{
    created_at: string;
    amount_cents: number;
    entry_type: string;
    description: string | null;
  }>,
): LedgerAggregateEntry[] {
  const aggregates: LedgerAggregateEntry[] = [];

  for (const row of rows) {
    const side = inferLedgerSide(row.entry_type, row.description);
    if (!side || row.amount_cents <= 0) {
      continue;
    }

    aggregates.push({
      created_at: row.created_at,
      amount_cents: row.amount_cents,
      side,
    });
  }

  return aggregates;
}

export async function getMarketLedgerAggregates(
  marketId: string,
): Promise<LedgerAggregateEntry[] | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("ledger_entries")
    .select("created_at, amount_cents, entry_type, description")
    .eq("market_id", marketId)
    .order("created_at", { ascending: true });

  if (error) {
    return null;
  }

  const aggregates = mapLedgerRowsToAggregates(data ?? []);

  if (aggregates.length === 0) {
    return null;
  }

  // Ledger rows are owner-scoped under current RLS, so they are not market-wide history.
  return null;
}
