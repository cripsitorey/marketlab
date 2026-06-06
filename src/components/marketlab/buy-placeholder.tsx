import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isMarketBuyable } from "@/lib/markets/is-market-buyable";
import type { Market } from "@/lib/markets/types";

export function BuyPlaceholder({ market }: { market: Market }) {
  const buyable = isMarketBuyable(market);

  return (
    <Card data-testid="buy-placeholder">
      <CardHeader>
        <CardTitle>Trade</CardTitle>
        <CardDescription>
          {buyable
            ? "Buying and selling will be available in a later workshop step."
            : "Buying is unavailable for this market."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row">
        <Button disabled className="flex-1">
          Buy Yes
        </Button>
        <Button disabled variant="outline" className="flex-1">
          Buy No
        </Button>
      </CardContent>
      {!buyable ? (
        <CardContent className="pt-0 text-sm text-muted-foreground">
          This market is closed, resolved, or past its close date.
        </CardContent>
      ) : null}
    </Card>
  );
}
