import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { Header } from "@/components/marketlab/header";

vi.mock("@/lib/profile/queries", () => ({
  getCurrentUser: vi.fn(async () => null),
  getCurrentProfile: vi.fn(async () => null),
}));

describe("Header", () => {
  it("renders MarketLab branding, markets nav, signed-out auth, and theme toggle", async () => {
    const html = renderToStaticMarkup(await Header());

    expect(html).toContain("MarketLab");
    expect(html).toContain('href="/markets"');
    expect(html).toContain('href="/positions"');
    expect(html).toContain("My Positions");
    expect(html).toContain('data-testid="header-signed-out"');
    expect(html).toContain('data-testid="theme-toggle"');
    expect(html).not.toContain("quito.png");
    expect(html).not.toContain("hero2-bg.webp");
  });
});
