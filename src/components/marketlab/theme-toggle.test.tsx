import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ThemeToggle } from "@/components/marketlab/theme-toggle";

describe("ThemeToggle", () => {
  it("renders the theme toggle button", () => {
    const html = renderToStaticMarkup(<ThemeToggle />);

    expect(html).toContain('data-testid="theme-toggle"');
    expect(html).toContain("Switch to dark mode");
  });
});
