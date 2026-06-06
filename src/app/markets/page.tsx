import { MarketCard } from "@/components/marketlab/market-card";
import { MarketEmptyState } from "@/components/marketlab/market-empty-state";
import { getMarkets } from "@/lib/markets/queries";

export default async function MarketsPage() {
  const markets = await getMarkets();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Markets</h1>
        <p className="max-w-2xl text-muted-foreground">
          Browse fictional Yes/No markets using fake money.
        </p>
      </div>

      {markets.length === 0 ? (
        <MarketEmptyState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {markets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      )}
    </div>
  );
}
