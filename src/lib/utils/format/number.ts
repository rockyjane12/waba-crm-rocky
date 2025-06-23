export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat("en-US", options).format(value);
}

export function formatCurrency(
  value: number,
  currency: string = "USD",
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  }).format(value);
}

// Additional functions from formatting.ts
export function formatProductItemsCount(productItems: any): number {
  if (!productItems) return 0;
  if (Array.isArray(productItems)) return productItems.length;
  if (typeof productItems === "object") return Object.keys(productItems).length;
  return 0;
}