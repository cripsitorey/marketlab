import Link from "next/link";

import { PositionsList } from "@/components/marketlab/positions-list";
import { Button } from "@/components/ui/button";
import { getUserPositionsWithMarkets } from "@/lib/positions/queries";
import { getCurrentUser } from "@/lib/profile/queries";

export default async function PositionsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div
          className="rounded-xl border bg-card p-8 text-center"
          data-testid="positions-signed-out"
        >
          <h1 className="text-2xl font-semibold">My Positions</h1>
          <p className="mt-3 text-muted-foreground">
            Sign in to see the markets where you hold fake-money Yes or No
            shares.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const positions = await getUserPositionsWithMarkets();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">My Positions</h1>
        <p className="mt-2 text-muted-foreground">
          Markets where you hold fake-money shares. Amounts are workshop-only
          and not real money.
        </p>
      </div>

      <PositionsList positions={positions} />
    </div>
  );
}
