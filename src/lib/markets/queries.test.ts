import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  evaluateMarketWidePositionTotals,
  getMarketById,
  getMarkets,
  mapLedgerRowsToAggregates,
} from "@/lib/markets/queries";

const mockFrom = vi.fn();
const mockCreateClient = vi.fn(() => ({ from: mockFrom }));

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: () => mockCreateClient(),
}));

function createListQueryBuilder(result: { data: unknown; error: unknown }) {
  const builder = {
    select: vi.fn(function select() {
      return builder;
    }),
    order: vi.fn(async () => result),
  };

  return builder;
}

function createSingleQueryBuilder(result: { data: unknown; error: unknown }) {
  const builder = {
    select: vi.fn(function select() {
      return builder;
    }),
    eq: vi.fn(function eq() {
      return builder;
    }),
    maybeSingle: vi.fn(async () => result),
  };

  return builder;
}

describe("getMarkets", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns markets from Supabase", async () => {
    const markets = [
      {
        id: "market-1",
        title: "Test market",
        description: "Description",
        status: "open",
        close_date: "2099-01-01T00:00:00.000Z",
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-01T00:00:00.000Z",
      },
    ];

    mockFrom.mockReturnValue(
      createListQueryBuilder({ data: markets, error: null }),
    );

    await expect(getMarkets()).resolves.toEqual(markets);
    expect(mockFrom).toHaveBeenCalledWith("markets");
  });
});

describe("getMarketById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a single market", async () => {
    const market = {
      id: "market-1",
      title: "Test market",
      description: "Description",
      status: "open",
      close_date: "2099-01-01T00:00:00.000Z",
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
    };

    mockFrom.mockReturnValue(
      createSingleQueryBuilder({ data: market, error: null }),
    );

    await expect(getMarketById("market-1")).resolves.toEqual(market);
  });
});

describe("evaluateMarketWidePositionTotals", () => {
  it("marks totals unavailable under current RLS", () => {
    expect(
      evaluateMarketWidePositionTotals([
        { yes_shares_cents: 1000, no_shares_cents: 500 },
      ]),
    ).toEqual({ available: false, reason: "rls" });
  });

  it("returns totals when market-wide aggregation is available", () => {
    expect(
      evaluateMarketWidePositionTotals(
        [
          { yes_shares_cents: 1000, no_shares_cents: 500 },
          { yes_shares_cents: 2000, no_shares_cents: 1000 },
        ],
        { marketWide: true },
      ),
    ).toEqual({
      available: true,
      totals: { yesTotal: 3000, noTotal: 1500 },
    });
  });
});

describe("mapLedgerRowsToAggregates", () => {
  it("maps ledger rows with side hints", () => {
    expect(
      mapLedgerRowsToAggregates([
        {
          created_at: "2026-01-02T00:00:00.000Z",
          amount_cents: 1000,
          entry_type: "buy_yes",
          description: null,
        },
      ]),
    ).toEqual([
      {
        created_at: "2026-01-02T00:00:00.000Z",
        amount_cents: 1000,
        side: "yes",
      },
    ]);
  });
});
