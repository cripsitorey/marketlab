import type { PositionWithMarket } from "@/lib/positions/types";
import { getCurrentUser } from "@/lib/profile/queries";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getUserPositionForMarket(
  marketId: string,
): Promise<{ yes_shares_cents: number; no_shares_cents: number } | null> {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("positions")
    .select("yes_shares_cents, no_shares_cents")
    .eq("market_id", marketId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch position: ${error.message}`);
  }

  if (!data) {
    return { yes_shares_cents: 0, no_shares_cents: 0 };
  }

  return data;
}

export function filterActivePositions(
  positions: PositionWithMarket[],
): PositionWithMarket[] {
  return positions.filter(
    (position) => position.yes_shares_cents + position.no_shares_cents > 0,
  );
}

export async function getUserPositionsWithMarkets(): Promise<
  PositionWithMarket[]
> {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("positions")
    .select(
      "yes_shares_cents, no_shares_cents, market:markets(id, title, status, close_date)",
    );

  if (error) {
    throw new Error(`Failed to fetch positions: ${error.message}`);
  }

  const positions = (data ?? []).flatMap((row) => {
    const market = row.market;
    if (!market || Array.isArray(market)) {
      return [];
    }

    return [
      {
        yes_shares_cents: row.yes_shares_cents,
        no_shares_cents: row.no_shares_cents,
        market,
      },
    ];
  });

  return filterActivePositions(positions).toSorted((left, right) =>
    left.market.close_date.localeCompare(right.market.close_date),
  );
}
