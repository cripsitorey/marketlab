import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SignUpContent } from "@/components/marketlab/sign-up-content";

describe("SignUpContent", () => {
  it("renders the signup form by default", () => {
    const html = renderToStaticMarkup(<SignUpContent />);

    expect(html).toContain("Create account");
    expect(html).toContain('name="first_name"');
    expect(html).toContain('name="last_name"');
    expect(html).toContain('href="/sign-in"');
  });

  it("renders check-your-email state after signup without a session", () => {
    const html = renderToStaticMarkup(<SignUpContent checkEmail />);

    expect(html).toContain('data-testid="check-email-state"');
    expect(html).toContain("Check your email");
    expect(html).not.toContain('name="password"');
  });
});
