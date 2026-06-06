import { MarketBuyForm } from "@/components/marketlab/market-buy-form";
import { isMarketBuyable } from "@/lib/markets/is-market-buyable";
import type { Market } from "@/lib/markets/types";
import { getUserPositionForMarket } from "@/lib/positions/queries";
import { getCurrentProfile, getCurrentUser } from "@/lib/profile/queries";

type MarketBuySectionProps = {
  market: Market;
};

export async function MarketBuySection({ market }: MarketBuySectionProps) {
  const user = await getCurrentUser();
  const canBuy = isMarketBuyable(market);

  const [profile, position] = user
    ? await Promise.all([
        getCurrentProfile(),
        getUserPositionForMarket(market.id),
      ])
    : [null, null];

  return (
    <MarketBuyForm
      marketId={market.id}
      marketTitle={market.title}
      isSignedIn={Boolean(user)}
      canBuy={canBuy}
      balanceCents={profile?.balance_cents ?? null}
      yesSharesCents={position?.yes_shares_cents ?? 0}
      noSharesCents={position?.no_shares_cents ?? 0}
    />
  );
}
