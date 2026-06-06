import { describe, expect, it } from "vitest";

import {
  formatCloseDate,
  formatMarketStatus,
  formatYesChance,
} from "@/lib/markets/format";

describe("formatMarketStatus", () => {
  it("formats known statuses", () => {
    expect(formatMarketStatus("open")).toBe("Open");
    expect(formatMarketStatus("closed")).toBe("Closed");
    expect(formatMarketStatus("resolved")).toBe("Resolved");
  });
});

describe("formatCloseDate", () => {
  it("formats close dates", () => {
    const formatted = formatCloseDate(
      "2026-06-06T12:00:00.000Z",
      "en-US",
      "UTC",
    );
    expect(formatted).toContain("2026");
  });
});

describe("formatYesChance", () => {
  it("rounds yes chance percentages", () => {
    expect(formatYesChance(66.4)).toBe("66%");
  });
});
