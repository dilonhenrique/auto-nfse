import { isValidNumber } from "./number";

export function isValidNbs(val: string) {
  return isValidNumber(val) && val.length === 9;
}
