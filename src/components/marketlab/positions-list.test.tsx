import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { PositionsList } from "@/components/marketlab/positions-list";
import type { PositionWithMarket } from "@/lib/positions/types";

const position: PositionWithMarket = {
  yes_shares_cents: 500,
  no_shares_cents: 250,
  market: {
    id: "market-1",
    title: "Will it rain?",
    status: "open",
    close_date: "2099-01-01T00:00:00.000Z",
  },
};

describe("PositionsList", () => {
  it("renders an empty state", () => {
    const html = renderToStaticMarkup(<PositionsList positions={[]} />);

    expect(html).toContain("No positions yet");
    expect(html).toContain('href="/markets"');
  });

  it("renders yes, no, and total shares with market links", () => {
    const html = renderToStaticMarkup(<PositionsList positions={[position]} />);

    expect(html).toContain("Will it rain?");
    expect(html).toContain('href="/markets/market-1"');
    expect(html).toContain("$5.00 fake");
    expect(html).toContain("$2.50 fake");
    expect(html).toContain("$7.50 fake");
  });

  it("renders no-only positions", () => {
    const html = renderToStaticMarkup(
      <PositionsList
        positions={[
          {
            ...position,
            yes_shares_cents: 0,
            no_shares_cents: 1000,
          },
        ]}
      />,
    );

    expect(html).toContain("$10.00 fake");
    expect(html).toContain("$0.00 fake");
  });
});
