import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import PositionsPage from "@/app/positions/page";

vi.mock("@/lib/profile/queries", () => ({
  getCurrentUser: vi.fn(async () => null),
}));

vi.mock("@/lib/positions/queries", () => ({
  getUserPositionsWithMarkets: vi.fn(async () => []),
}));

describe("PositionsPage", () => {
  it("shows a sign-in message without private position data", async () => {
    const html = renderToStaticMarkup(await PositionsPage());

    expect(html).toContain("Sign in to see the markets");
    expect(html).toContain('data-testid="positions-signed-out"');
    expect(html).not.toContain('data-testid="positions-list"');
  });
});
