export function parseDecimal(val: string): number {
  const num = Number(val.trim().replace(/\./g, "").replace(",", "."));
  return isNaN(num) ? NaN : parseFloat(num.toFixed(2));
}
