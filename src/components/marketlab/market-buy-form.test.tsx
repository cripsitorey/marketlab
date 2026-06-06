import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { MarketBuyForm } from "@/components/marketlab/market-buy-form";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");

  return {
    ...actual,
    useActionState: () => [{ status: "idle" }, vi.fn(), false],
    useEffect: () => undefined,
  };
});

describe("MarketBuyForm", () => {
  it("prompts signed-out users to sign in", () => {
    const html = renderToStaticMarkup(
      <MarketBuyForm
        marketId="market-1"
        marketTitle="Open market"
        isSignedIn={false}
        canBuy
        balanceCents={null}
        yesSharesCents={0}
        noSharesCents={0}
      />,
    );

    expect(html).toContain("Sign in to buy Yes or No shares");
    expect(html).toContain('href="/sign-in"');
    expect(html).not.toContain('data-testid="buy-submit-button"');
  });

  it("shows unavailable state for closed markets", () => {
    const html = renderToStaticMarkup(
      <MarketBuyForm
        marketId="market-1"
        marketTitle="Closed market"
        isSignedIn
        canBuy={false}
        balanceCents={100000}
        yesSharesCents={0}
        noSharesCents={0}
      />,
    );

    expect(html).toContain("Buying is unavailable for this market.");
    expect(html).not.toContain('data-testid="buy-submit-button"');
  });

  it("renders buy controls for signed-in users on buyable markets", () => {
    const html = renderToStaticMarkup(
      <MarketBuyForm
        marketId="market-1"
        marketTitle="Open market"
        isSignedIn
        canBuy
        balanceCents={100000}
        yesSharesCents={500}
        noSharesCents={250}
      />,
    );

    expect(html).toContain('data-testid="buy-submit-button"');
    expect(html).toContain("$1,000.00 fake");
    expect(html).toContain("Yes $5.00 fake");
    expect(html).toContain("No $2.50 fake");
  });
});
