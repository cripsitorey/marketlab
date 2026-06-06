import { Badge } from "@/components/ui/badge";
import { formatMarketStatus } from "@/lib/markets/format";
import type { MarketStatus } from "@/lib/markets/types";

const statusVariants: Record<
  MarketStatus,
  "success" | "muted" | "info" | "default"
> = {
  open: "success",
  closed: "muted",
  resolved: "info",
};

export function MarketStatusBadge({ status }: { status: string }) {
  const variant =
    status === "open" || status === "closed" || status === "resolved"
      ? statusVariants[status]
      : "default";

  return (
    <Badge variant={variant} data-testid="market-status-badge">
      {formatMarketStatus(status)}
    </Badge>
  );
}
