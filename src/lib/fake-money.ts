export type ParseFakeDollarResult =
  | { ok: true; cents: number }
  | { ok: false; error: string };

const DOLLAR_INPUT_PATTERN = /^\d+(\.\d{1,2})?$/;

export function parseFakeDollarInput(value: string): ParseFakeDollarResult {
  const trimmed = value.trim();

  if (!trimmed) {
    return { ok: false, error: "Enter a fake dollar amount." };
  }

  if (!DOLLAR_INPUT_PATTERN.test(trimmed)) {
    return {
      ok: false,
      error: "Use up to two decimal places, like 1, 1.50, or 10.00.",
    };
  }

  const [wholePart, fractionalPart = ""] = trimmed.split(".");
  const centsFromWhole = Number(wholePart) * 100;
  const centsFromFraction = Number(fractionalPart.padEnd(2, "0"));
  const cents = centsFromWhole + centsFromFraction;

  if (!Number.isSafeInteger(cents) || cents <= 0) {
    return { ok: false, error: "Enter a positive fake dollar amount." };
  }

  return { ok: true, cents };
}

export function formatFakeShares(cents: number): string {
  const dollars = cents / 100;

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(dollars);

  return `${formatted} fake`;
}

export function computeTotalSharesCents(
  yesSharesCents: number,
  noSharesCents: number,
): number {
  return yesSharesCents + noSharesCents;
}
