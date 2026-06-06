import { describe, expect, it } from "vitest";

import {
  buildFlatSeries,
  buildHistorySeries,
  buildProbabilitySeries,
  computeYesChanceFromTotals,
  inferLedgerSide,
  NEUTRAL_YES_CHANCE,
  resolveYesChance,
} from "@/lib/markets/probability";

describe("computeYesChanceFromTotals", () => {
  it("calculates yes chance from aggregate positions", () => {
    const result = computeYesChanceFromTotals({
      yesTotal: 7000,
      noTotal: 3000,
    });

    expect(result).toEqual({ available: true, yesChance: 70 });
  });

  it("uses neutral baseline when totals are empty", () => {
    const result = computeYesChanceFromTotals({
      yesTotal: 0,
      noTotal: 0,
    });

    expect(result).toEqual({
      available: false,
      yesChance: NEUTRAL_YES_CHANCE,
    });
  });
});

describe("resolveYesChance", () => {
  it("returns neutral baseline when totals are unavailable", () => {
    expect(resolveYesChance({ available: false })).toEqual({
      available: false,
      yesChance: 50,
    });
  });
});

describe("inferLedgerSide", () => {
  it("detects yes and no sides from entry metadata", () => {
    expect(inferLedgerSide("buy_yes", null)).toBe("yes");
    expect(inferLedgerSide("trade", "Bought No shares")).toBe("no");
  });
});

describe("buildProbabilitySeries", () => {
  it("builds historical series from ledger aggregates", () => {
    const series = buildProbabilitySeries({
      createdAt: "2026-01-01T00:00:00.000Z",
      yesChance: 75,
      ledgerEntries: [
        {
          created_at: "2026-01-02T00:00:00.000Z",
          amount_cents: 1000,
          side: "yes",
        },
        {
          created_at: "2026-01-03T00:00:00.000Z",
          amount_cents: 500,
          side: "no",
        },
      ],
      now: "2026-01-04T00:00:00.000Z",
    });

    expect(series.mode).toBe("history");
    expect(series.points.length).toBeGreaterThan(1);
  });

  it("falls back to a flat current-state line without ledger history", () => {
    const series = buildFlatSeries(
      "2026-01-01T00:00:00.000Z",
      50,
      "2026-01-04T00:00:00.000Z",
    );

    expect(series.mode).toBe("flat");
    expect(series.label).toBe("Current market sentiment");
    expect(series.points).toHaveLength(2);
    expect(series.points[0].yesChance).toBe(50);
    expect(series.points[1].yesChance).toBe(50);
  });
});

describe("buildHistorySeries", () => {
  it("returns null when no ledger entries are provided", () => {
    expect(buildHistorySeries([], "2026-01-01T00:00:00.000Z", 50)).toBeNull();
  });
});
