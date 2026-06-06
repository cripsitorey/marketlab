import { formatFakeBalance } from "@/lib/profile/format";

type BalanceDisplayProps = {
  balanceCents: number | null | undefined;
};

export function BalanceDisplay({ balanceCents }: BalanceDisplayProps) {
  if (balanceCents == null) {
    return (
      <span
        className="text-sm text-muted-foreground"
        data-testid="balance-unavailable"
      >
        Balance unavailable
      </span>
    );
  }

  return (
    <span
      className="text-sm font-medium tabular-nums text-foreground"
      data-testid="fake-balance"
    >
      {formatFakeBalance(balanceCents)}
    </span>
  );
}
