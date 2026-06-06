export function formatFakeBalance(balanceCents: number): string {
  const dollars = balanceCents / 100;

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(dollars);

  return `${formatted} fake`;
}
