import { describe, expect, it } from "vitest";

import { isMarketBuyable } from "@/lib/markets/is-market-buyable";

const futureDate = "2099-01-01T00:00:00.000Z";
const pastDate = "2020-01-01T00:00:00.000Z";

describe("isMarketBuyable", () => {
  it("returns true for open markets before close date", () => {
    expect(
      isMarketBuyable(
        { status: "open", close_date: futureDate },
        new Date("2026-01-01T00:00:00.000Z"),
      ),
    ).toBe(true);
  });

  it("returns false for closed markets", () => {
    expect(
      isMarketBuyable(
        { status: "closed", close_date: futureDate },
        new Date("2026-01-01T00:00:00.000Z"),
      ),
    ).toBe(false);
  });

  it("returns false for resolved markets", () => {
    expect(
      isMarketBuyable(
        { status: "resolved", close_date: futureDate },
        new Date("2026-01-01T00:00:00.000Z"),
      ),
    ).toBe(false);
  });

  it("returns false when close date has passed", () => {
    expect(
      isMarketBuyable(
        { status: "open", close_date: pastDate },
        new Date("2026-01-01T00:00:00.000Z"),
      ),
    ).toBe(false);
  });
});
