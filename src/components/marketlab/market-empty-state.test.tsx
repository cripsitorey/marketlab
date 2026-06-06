import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MarketEmptyState } from "@/components/marketlab/market-empty-state";

describe("MarketEmptyState", () => {
  it("renders empty state copy", () => {
    const html = renderToStaticMarkup(<MarketEmptyState />);

    expect(html).toContain("No markets yet");
    expect(html).toContain("Browse fictional Yes/No markets using fake money");
  });
});
