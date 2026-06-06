import type { User } from "@supabase/supabase-js";
import Link from "next/link";

import { BalanceDisplay } from "@/components/marketlab/balance-display";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/actions";
import type { ProfileSummary } from "@/lib/profile/queries";

type HeaderAuthProps = {
  user: User | null;
  profile: ProfileSummary | null;
};

export function HeaderAuth({ user, profile }: HeaderAuthProps) {
  if (!user) {
    return (
      <div className="flex items-center gap-2" data-testid="header-signed-out">
        <Button asChild variant="ghost" size="sm">
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3" data-testid="header-signed-in">
      <BalanceDisplay balanceCents={profile?.balance_cents} />
      <form action={signOut}>
        <Button
          type="submit"
          variant="outline"
          size="sm"
          data-testid="sign-out-button"
        >
          Sign out
        </Button>
      </form>
    </div>
  );
}
