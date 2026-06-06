import { describe, expect, it } from "vitest";

import {
  computeTotalSharesCents,
  formatFakeShares,
  parseFakeDollarInput,
} from "@/lib/fake-money";

describe("parseFakeDollarInput", () => {
  it("accepts whole and decimal fake dollar amounts", () => {
    expect(parseFakeDollarInput("1")).toEqual({ ok: true, cents: 100 });
    expect(parseFakeDollarInput("1.5")).toEqual({ ok: true, cents: 150 });
    expect(parseFakeDollarInput("10.00")).toEqual({ ok: true, cents: 1000 });
  });

  it("rejects empty and invalid amounts", () => {
    expect(parseFakeDollarInput("")).toEqual({
      ok: false,
      error: "Enter a fake dollar amount.",
    });
    expect(parseFakeDollarInput("abc")).toEqual({
      ok: false,
      error: "Use up to two decimal places, like 1, 1.50, or 10.00.",
    });
    expect(parseFakeDollarInput("0")).toEqual({
      ok: false,
      error: "Enter a positive fake dollar amount.",
    });
  });

  it("rejects more than two decimal places", () => {
    expect(parseFakeDollarInput("1.234")).toEqual({
      ok: false,
      error: "Use up to two decimal places, like 1, 1.50, or 10.00.",
    });
  });
});

describe("formatFakeShares", () => {
  it("formats share cents as fake dollars", () => {
    expect(formatFakeShares(1000)).toBe("$10.00 fake");
    expect(formatFakeShares(500)).toBe("$5.00 fake");
  });
});

describe("computeTotalSharesCents", () => {
  it("sums yes and no share cents", () => {
    expect(computeTotalSharesCents(500, 300)).toBe(800);
    expect(computeTotalSharesCents(0, 250)).toBe(250);
  });
});
