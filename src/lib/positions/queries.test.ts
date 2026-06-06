import { describe, expect, it } from "vitest";

import { filterActivePositions } from "@/lib/positions/queries";
import type { PositionWithMarket } from "@/lib/positions/types";

const basePosition: PositionWithMarket = {
  yes_shares_cents: 0,
  no_shares_cents: 0,
  market: {
    id: "market-1",
    title: "Test market",
    status: "open",
    close_date: "2099-01-01T00:00:00.000Z",
  },
};

describe("filterActivePositions", () => {
  it("keeps positions with yes or no shares", () => {
    const positions = [
      { ...basePosition, yes_shares_cents: 500 },
      { ...basePosition, market: { ...basePosition.market, id: "market-2" } },
      {
        ...basePosition,
        market: { ...basePosition.market, id: "market-3" },
        no_shares_cents: 250,
      },
    ];

    const filtered = filterActivePositions(positions);

    expect(filtered).toHaveLength(2);
    expect(filtered[0]?.yes_shares_cents).toBe(500);
    expect(filtered[1]?.no_shares_cents).toBe(250);
  });
});
