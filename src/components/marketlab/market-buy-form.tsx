"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatFakeShares } from "@/lib/fake-money";
import { type BuyMarketState, buyMarketShares } from "@/lib/markets/actions";
import type { MarketSide } from "@/lib/positions/types";

type MarketBuyFormProps = {
  marketId: string;
  marketTitle: string;
  isSignedIn: boolean;
  canBuy: boolean;
  balanceCents: number | null;
  yesSharesCents: number;
  noSharesCents: number;
};

const initialState: BuyMarketState = { status: "idle" };

export function MarketBuyForm({
  marketId,
  marketTitle,
  isSignedIn,
  canBuy,
  balanceCents,
  yesSharesCents,
  noSharesCents,
}: MarketBuyFormProps) {
  const router = useRouter();
  const [side, setSide] = useState<MarketSide>("yes");
  const [state, formAction, isPending] = useActionState(
    buyMarketShares,
    initialState,
  );

  const displayedBalanceCents =
    state.status === "success" ? state.balanceCents : balanceCents;
  const displayedYesSharesCents =
    state.status === "success" ? state.yesSharesCents : yesSharesCents;
  const displayedNoSharesCents =
    state.status === "success" ? state.noSharesCents : noSharesCents;

  useEffect(() => {
    if (state.status === "success") {
      router.refresh();
    }
  }, [router, state.status]);

  if (!isSignedIn) {
    return (
      <Card data-testid="market-buy-form">
        <CardHeader>
          <CardTitle>Buy shares</CardTitle>
          <CardDescription>
            Sign in to buy Yes or No shares with fake money in this workshop
            market.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!canBuy) {
    return (
      <Card data-testid="market-buy-form">
        <CardHeader>
          <CardTitle>Buy shares</CardTitle>
          <CardDescription>
            Buying is unavailable for this market.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          This market is closed, resolved, or past its close date.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="market-buy-form">
      <CardHeader>
        <CardTitle>Buy shares</CardTitle>
        <CardDescription>
          Spend fake money on Yes or No shares in {marketTitle}. This workshop
          app does not use real money.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border bg-muted/30 p-4 text-sm">
          <p>
            Available fake balance:{" "}
            <span className="font-medium" data-testid="buy-available-balance">
              {displayedBalanceCents == null
                ? "Balance unavailable"
                : formatFakeShares(displayedBalanceCents)}
            </span>
          </p>
          <p className="mt-2">
            Your position:{" "}
            <span data-testid="buy-yes-position">
              Yes {formatFakeShares(displayedYesSharesCents)}
            </span>
            {" · "}
            <span data-testid="buy-no-position">
              No {formatFakeShares(displayedNoSharesCents)}
            </span>
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="market_id" value={marketId} />
          <input type="hidden" name="side" value={side} />

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Choose a side</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              <Button
                type="button"
                variant={side === "yes" ? "default" : "outline"}
                className="w-full"
                disabled={isPending}
                onClick={() => setSide("yes")}
                data-testid="buy-side-yes"
              >
                Buy Yes
              </Button>
              <Button
                type="button"
                variant={side === "no" ? "default" : "outline"}
                className="w-full"
                disabled={isPending}
                onClick={() => setSide("no")}
                data-testid="buy-side-no"
              >
                Buy No
              </Button>
            </div>
          </fieldset>

          <div className="space-y-2">
            <Label htmlFor="buy-amount">Fake dollar amount</Label>
            <Input
              id="buy-amount"
              name="amount"
              type="text"
              inputMode="decimal"
              placeholder="10.00"
              required
              disabled={isPending}
              aria-invalid={state.status === "error"}
              data-testid="buy-amount-input"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
            data-testid="buy-submit-button"
          >
            {isPending ? "Buying..." : `Buy ${side === "yes" ? "Yes" : "No"}`}
          </Button>
        </form>

        <div aria-live="polite" className="min-h-5 text-sm">
          {state.status === "error" ? (
            <p className="text-destructive" data-testid="buy-error-message">
              {state.message}
            </p>
          ) : null}
          {state.status === "success" ? (
            <p className="text-foreground" data-testid="buy-success-message">
              Purchase complete. Your fake balance and position are updated.
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
