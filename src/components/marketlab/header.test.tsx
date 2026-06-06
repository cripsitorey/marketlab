import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Header } from "@/components/marketlab/header";

describe("Header", () => {
  it("renders MarketLab branding, markets nav, and no hero images", () => {
    const html = renderToStaticMarkup(<Header />);

    expect(html).toContain("MarketLab");
    expect(html).toContain('href="/markets"');
    expect(html).toContain('data-testid="theme-toggle"');
    expect(html).not.toContain("quito.png");
    expect(html).not.toContain("hero2-bg.webp");
  });
});
