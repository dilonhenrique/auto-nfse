import { parseDecimal } from "../parse/decimal";

export function isValidDecimal(val: string): boolean {
  const number = parseDecimal(val.trim());
  return !isNaN(number);
}
