import { isValidDateFormat } from "../validations/date";

export function parseDate(dateStr: string): Date | null {
  if (!isValidDateFormat(dateStr)) return null;

  const [day, month, year] = dateStr.trim().split("/").map(Number);
  return new Date(year, month - 1, day);
}
