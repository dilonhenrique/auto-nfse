export function isTribNac(value: string): boolean {
  const regex = /^\d{2}\.\d{2}\.\d{2}$/;
  return regex.test(value);
}
