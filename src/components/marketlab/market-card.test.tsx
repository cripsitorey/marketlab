import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MarketCard } from "@/components/marketlab/market-card";

const market = {
  id: "market-1",
  title: "Will it rain?",
  description: "A fictional weather market.",
  status: "open",
  close_date: "2099-01-01T00:00:00.000Z",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

describe("MarketCard", () => {
  it("renders title, status, and close date", () => {
    const html = renderToStaticMarkup(<MarketCard market={market} />);

    expect(html).toContain("Will it rain?");
    expect(html).toContain("Open");
    expect(html).toContain('data-testid="market-close-date"');
    expect(html).toContain("View market");
  });
});
