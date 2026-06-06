import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { BalanceDisplay } from "@/components/marketlab/balance-display";

describe("BalanceDisplay", () => {
  it("shows formatted fake balance", () => {
    const html = renderToStaticMarkup(<BalanceDisplay balanceCents={100000} />);

    expect(html).toContain('data-testid="fake-balance"');
    expect(html).toContain("$1,000.00 fake");
  });

  it("handles missing profile balance", () => {
    const html = renderToStaticMarkup(<BalanceDisplay balanceCents={null} />);

    expect(html).toContain('data-testid="balance-unavailable"');
    expect(html).toContain("Balance unavailable");
  });
});
