import Link from "next/link";
import { notFound } from "next/navigation";

import { MarketBuySection } from "@/components/marketlab/market-buy-section";
import { MarketStatusBadge } from "@/components/marketlab/market-status-badge";
import { ProbabilityChart } from "@/components/marketlab/probability-chart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCloseDate, formatYesChance } from "@/lib/markets/format";
import { getMarketProbability } from "@/lib/markets/get-market-probability";
import { getMarketById } from "@/lib/markets/queries";

type MarketDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function MarketDetailPage({
  params,
}: MarketDetailPageProps) {
  const { id } = await params;
  const market = await getMarketById(id);

  if (!market) {
    notFound();
  }

  const { yesChance, series } = await getMarketProbability(market);
  const noChance = 100 - yesChance.yesChance;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/markets">← Back to markets</Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <CardTitle className="text-2xl">{market.title}</CardTitle>
                <MarketStatusBadge status={market.status} />
              </div>
              <CardDescription className="text-base">
                {market.description || "No description provided."}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                Closes{" "}
                <span data-testid="market-detail-close-date">
                  {formatCloseDate(market.close_date)}
                </span>
              </p>
            </CardContent>
          </Card>

          <ProbabilityChart
            series={series}
            currentYesChance={yesChance.yesChance}
          />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Outcomes</CardTitle>
              <CardDescription>
                Current Yes/No balance for this market.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm font-medium text-muted-foreground">Yes</p>
                <p className="text-2xl font-semibold">
                  {formatYesChance(yesChance.yesChance)}
                </p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm font-medium text-muted-foreground">No</p>
                <p className="text-2xl font-semibold">
                  {formatYesChance(noChance)}
                </p>
              </div>
              {!yesChance.available ? (
                <p className="text-sm text-muted-foreground">
                  Using a neutral 50% baseline because market-wide position
                  totals are not available yet.
                </p>
              ) : null}
            </CardContent>
          </Card>

          <MarketBuySection market={market} />
        </div>
      </div>
    </div>
  );
}
