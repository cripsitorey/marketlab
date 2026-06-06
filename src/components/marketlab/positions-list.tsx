import Link from "next/link";

import { MarketStatusBadge } from "@/components/marketlab/market-status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { computeTotalSharesCents, formatFakeShares } from "@/lib/fake-money";
import { formatCloseDate } from "@/lib/markets/format";
import type { PositionWithMarket } from "@/lib/positions/types";

type PositionsListProps = {
  positions: PositionWithMarket[];
};

export function PositionsList({ positions }: PositionsListProps) {
  if (positions.length === 0) {
    return (
      <Card data-testid="positions-empty-state">
        <CardHeader>
          <CardTitle>No positions yet</CardTitle>
          <CardDescription>
            Buy Yes or No shares in an open market to see your fake-money
            positions here.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild variant="outline">
            <Link href="/markets">Browse markets</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="grid gap-4" data-testid="positions-list">
      {positions.map((position) => {
        const totalSharesCents = computeTotalSharesCents(
          position.yes_shares_cents,
          position.no_shares_cents,
        );

        return (
          <Card key={position.market.id} data-testid="position-card">
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <CardTitle className="text-lg">
                  <Link
                    href={`/markets/${position.market.id}`}
                    className="hover:underline"
                    data-testid="position-market-link"
                  >
                    {position.market.title}
                  </Link>
                </CardTitle>
                <MarketStatusBadge status={position.market.status} />
              </div>
              <CardDescription>
                Closes {formatCloseDate(position.market.close_date)}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm font-medium text-muted-foreground">Yes</p>
                <p
                  className="text-lg font-semibold"
                  data-testid="position-yes-shares"
                >
                  {formatFakeShares(position.yes_shares_cents)}
                </p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm font-medium text-muted-foreground">No</p>
                <p
                  className="text-lg font-semibold"
                  data-testid="position-no-shares"
                >
                  {formatFakeShares(position.no_shares_cents)}
                </p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Total
                </p>
                <p
                  className="text-lg font-semibold"
                  data-testid="position-total-shares"
                >
                  {formatFakeShares(totalSharesCents)}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" size="sm">
                <Link href={`/markets/${position.market.id}`}>View market</Link>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
