import type { MarketStatus } from "@/lib/markets/types";

const statusLabels: Record<MarketStatus, string> = {
  open: "Open",
  closed: "Closed",
  resolved: "Resolved",
};

export function formatMarketStatus(status: string): string {
  if (status === "open" || status === "closed" || status === "resolved") {
    return statusLabels[status];
  }

  return status;
}

export function formatCloseDate(
  closeDate: string,
  locale = "en-US",
  timeZone = "UTC",
): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone,
  }).format(new Date(closeDate));
}

export function formatYesChance(yesChance: number): string {
  return `${Math.round(yesChance)}%`;
}
