import { beforeEach, describe, expect, it, vi } from "vitest";

import { buyMarketShares } from "@/lib/markets/actions";

const { mockGetUser, mockRpc, mockCreateServerSupabaseClient } = vi.hoisted(
  () => ({
    mockGetUser: vi.fn(),
    mockRpc: vi.fn(),
    mockCreateServerSupabaseClient: vi.fn(),
  }),
);

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: mockCreateServerSupabaseClient,
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("buyMarketShares", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateServerSupabaseClient.mockResolvedValue({
      auth: { getUser: mockGetUser },
      rpc: mockRpc,
    });
  });

  it("rejects invalid sides before calling rpc", async () => {
    const formData = new FormData();
    formData.set("market_id", "market-1");
    formData.set("side", "maybe");
    formData.set("amount", "10");

    const result = await buyMarketShares({ status: "idle" }, formData);

    expect(result).toEqual({
      status: "error",
      message: "Choose Yes or No before buying.",
    });
    expect(mockRpc).not.toHaveBeenCalled();
  });

  it("rejects invalid amounts before calling rpc", async () => {
    const formData = new FormData();
    formData.set("market_id", "market-1");
    formData.set("side", "yes");
    formData.set("amount", "1.234");

    const result = await buyMarketShares({ status: "idle" }, formData);

    expect(result.status).toBe("error");
    expect(mockRpc).not.toHaveBeenCalled();
  });

  it("requires authentication before calling rpc", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    const formData = new FormData();
    formData.set("market_id", "market-1");
    formData.set("side", "yes");
    formData.set("amount", "10");

    const result = await buyMarketShares({ status: "idle" }, formData);

    expect(result).toEqual({
      status: "error",
      message: "Sign in to buy shares with fake money.",
    });
    expect(mockRpc).not.toHaveBeenCalled();
  });

  it("maps closed market errors from rpc", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });
    mockRpc.mockResolvedValue({
      data: null,
      error: { message: "market_not_buyable" },
    });

    const formData = new FormData();
    formData.set("market_id", "market-1");
    formData.set("side", "yes");
    formData.set("amount", "5");

    const result = await buyMarketShares({ status: "idle" }, formData);

    expect(result).toEqual({
      status: "error",
      message:
        "Buying is unavailable because this market is closed, resolved, or past its close date.",
    });
  });

  it("maps insufficient balance errors from rpc", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });
    mockRpc.mockResolvedValue({
      data: null,
      error: { message: "insufficient_balance" },
    });

    const formData = new FormData();
    formData.set("market_id", "market-1");
    formData.set("side", "no");
    formData.set("amount", "10");

    const result = await buyMarketShares({ status: "idle" }, formData);

    expect(result).toEqual({
      status: "error",
      message: "You do not have enough fake money for this purchase.",
    });
  });

  it("calls rpc with cents and no client user id", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });
    mockRpc.mockResolvedValue({
      data: {
        balance_cents: 90000,
        yes_shares_cents: 1000,
        no_shares_cents: 0,
      },
      error: null,
    });

    const formData = new FormData();
    formData.set("market_id", "market-1");
    formData.set("side", "yes");
    formData.set("amount", "10.00");

    const result = await buyMarketShares({ status: "idle" }, formData);

    expect(mockRpc).toHaveBeenCalledWith("buy_market_shares", {
      p_market_id: "market-1",
      p_side: "yes",
      p_amount_cents: 1000,
    });
    expect(result).toEqual({
      status: "success",
      balanceCents: 90000,
      yesSharesCents: 1000,
      noSharesCents: 0,
    });
  });
});
