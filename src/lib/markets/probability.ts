import type {
  LedgerAggregateEntry,
  PositionTotals,
  ProbabilityPoint,
  ProbabilitySeries,
  YesChanceResult,
} from "@/lib/markets/types";

export const NEUTRAL_YES_CHANCE = 50;

export function computeYesChanceFromTotals(
  totals: PositionTotals,
): YesChanceResult {
  const { yesTotal, noTotal } = totals;
  const total = yesTotal + noTotal;

  if (total <= 0) {
    return { available: false, yesChance: NEUTRAL_YES_CHANCE };
  }

  return {
    available: true,
    yesChance: (yesTotal / total) * 100,
  };
}

export function resolveYesChance(
  totalsResult:
    | { available: true; totals: PositionTotals }
    | { available: false },
): YesChanceResult {
  if (!totalsResult.available) {
    return { available: false, yesChance: NEUTRAL_YES_CHANCE };
  }

  return computeYesChanceFromTotals(totalsResult.totals);
}

export function inferLedgerSide(
  entryType: string,
  description: string | null,
): "yes" | "no" | null {
  const normalizedType = entryType.toLowerCase();
  const normalizedDescription = (description ?? "").toLowerCase();

  if (
    normalizedType.includes("yes") ||
    normalizedDescription.includes(" yes") ||
    normalizedDescription.startsWith("yes")
  ) {
    return "yes";
  }

  if (
    normalizedType.includes("no") ||
    normalizedDescription.includes(" no") ||
    normalizedDescription.startsWith("no")
  ) {
    return "no";
  }

  return null;
}

export function buildHistorySeries(
  entries: LedgerAggregateEntry[],
  createdAt: string,
  currentYesChance: number,
): ProbabilitySeries | null {
  if (entries.length === 0) {
    return null;
  }

  const sorted = [...entries].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  let yesTotal = 0;
  let noTotal = 0;
  const points: ProbabilityPoint[] = [
    {
      timestamp: createdAt,
      yesChance: NEUTRAL_YES_CHANCE,
    },
  ];

  for (const entry of sorted) {
    if (entry.side === "yes") {
      yesTotal += entry.amount_cents;
    } else {
      noTotal += entry.amount_cents;
    }

    const total = yesTotal + noTotal;
    const yesChance = total > 0 ? (yesTotal / total) * 100 : NEUTRAL_YES_CHANCE;

    points.push({
      timestamp: entry.created_at,
      yesChance,
    });
  }

  const lastPoint = points.at(-1);
  if (!lastPoint || Math.abs(lastPoint.yesChance - currentYesChance) > 0.01) {
    points.push({
      timestamp: new Date().toISOString(),
      yesChance: currentYesChance,
    });
  }

  if (points.length < 2) {
    return null;
  }

  return {
    points,
    mode: "history",
    label: "Yes chance over time",
  };
}

export function buildFlatSeries(
  createdAt: string,
  yesChance: number,
  now: string = new Date().toISOString(),
): ProbabilitySeries {
  return {
    points: [
      { timestamp: createdAt, yesChance },
      { timestamp: now, yesChance },
    ],
    mode: "flat",
    label: "Current market sentiment",
  };
}

export function buildProbabilitySeries(options: {
  createdAt: string;
  yesChance: number;
  ledgerEntries?: LedgerAggregateEntry[];
  now?: string;
}): ProbabilitySeries {
  const history = options.ledgerEntries
    ? buildHistorySeries(
        options.ledgerEntries,
        options.createdAt,
        options.yesChance,
      )
    : null;

  if (history) {
    return history;
  }

  return buildFlatSeries(options.createdAt, options.yesChance, options.now);
}

export function filterSeriesByRange(
  series: ProbabilitySeries,
  range: "7d" | "30d" | "all",
  now: Date = new Date(),
): ProbabilitySeries {
  if (range === "all") {
    return series;
  }

  const days = range === "7d" ? 7 : 30;
  const cutoff = now.getTime() - days * 24 * 60 * 60 * 1000;
  const filtered = series.points.filter(
    (point) => new Date(point.timestamp).getTime() >= cutoff,
  );

  if (filtered.length < 2) {
    return {
      ...series,
      points:
        filtered.length === 1
          ? [
              filtered[0],
              {
                timestamp: now.toISOString(),
                yesChance: filtered[0].yesChance,
              },
            ]
          : series.points.slice(-2),
      mode: "flat",
      label: "Current market sentiment",
    };
  }

  return {
    ...series,
    points: filtered,
  };
}
