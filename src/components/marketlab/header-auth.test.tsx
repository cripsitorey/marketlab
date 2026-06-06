import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { HeaderAuth } from "@/components/marketlab/header-auth";

const signedInUser = {
  id: "user-1",
  email: "trader@example.com",
  app_metadata: {},
  user_metadata: {},
  aud: "authenticated",
  created_at: "2026-01-01T00:00:00.000Z",
} as const;

describe("HeaderAuth", () => {
  it("renders sign-in and sign-up actions when signed out", () => {
    const html = renderToStaticMarkup(
      <HeaderAuth user={null} profile={null} />,
    );

    expect(html).toContain('data-testid="header-signed-out"');
    expect(html).toContain('href="/sign-in"');
    expect(html).toContain('href="/sign-up"');
    expect(html).toContain("Sign in");
    expect(html).toContain("Sign up");
  });

  it("renders balance and sign-out when signed in", () => {
    const html = renderToStaticMarkup(
      <HeaderAuth
        user={signedInUser}
        profile={{
          balance_cents: 100000,
          first_name: "Ada",
          last_name: "Lovelace",
        }}
      />,
    );

    expect(html).toContain('data-testid="header-signed-in"');
    expect(html).toContain('data-testid="fake-balance"');
    expect(html).toContain("$1,000.00 fake");
    expect(html).toContain('data-testid="sign-out-button"');
    expect(html).toContain("Sign out");
    expect(html).not.toContain('href="/sign-in"');
    expect(html).not.toContain('href="/sign-up"');
  });

  it("shows unavailable balance when profile is missing", () => {
    const html = renderToStaticMarkup(
      <HeaderAuth user={signedInUser} profile={null} />,
    );

    expect(html).toContain('data-testid="balance-unavailable"');
    expect(html).toContain('data-testid="sign-out-button"');
  });
});
