export const formatCOP = (value: number, opts?: { compact?: boolean }) => {
  if (opts?.compact) {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(value >= 10_000_000 ? 1 : 2)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
  }
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
};
