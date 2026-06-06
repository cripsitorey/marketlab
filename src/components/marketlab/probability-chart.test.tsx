import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ProbabilityChart } from "@/components/marketlab/probability-chart";
import { buildFlatSeries } from "@/lib/markets/probability";

describe("ProbabilityChart", () => {
  it("renders the chart svg and flat current-state line", () => {
    const series = buildFlatSeries(
      "2026-01-01T00:00:00.000Z",
      50,
      "2026-01-04T00:00:00.000Z",
    );

    const html = renderToStaticMarkup(
      <ProbabilityChart series={series} currentYesChance={50} />,
    );

    expect(html).toContain('data-testid="probability-chart"');
    expect(html).toContain('data-testid="probability-chart-svg"');
    expect(html).toContain('data-testid="probability-chart-line"');
    expect(html).toContain("50%");
    expect(html).toContain("Current market sentiment");
  });
});
