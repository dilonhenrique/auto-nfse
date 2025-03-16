export function isStringNaN(value: string): boolean {
  return isNaN(Number(value.trim()));
}

export function isValidNumber(value: string): boolean {
  return !isStringNaN(value);
}
