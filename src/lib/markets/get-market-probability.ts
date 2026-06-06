import {
  buildProbabilitySeries,
  resolveYesChance,
} from "@/lib/markets/probability";
import {
  getMarketLedgerAggregates,
  getMarketPositionTotals,
} from "@/lib/markets/queries";
import type {
  Market,
  ProbabilitySeries,
  YesChanceResult,
} from "@/lib/markets/types";

export type MarketProbability = {
  yesChance: YesChanceResult;
  series: ProbabilitySeries;
};

export async function getMarketProbability(
  market: Market,
): Promise<MarketProbability> {
  const [totalsResult, ledgerEntries] = await Promise.all([
    getMarketPositionTotals(market.id),
    getMarketLedgerAggregates(market.id),
  ]);

  const yesChance = resolveYesChance(totalsResult);
  const series = buildProbabilitySeries({
    createdAt: market.created_at,
    yesChance: yesChance.yesChance,
    ledgerEntries: ledgerEntries ?? undefined,
  });

  return { yesChance, series };
}
