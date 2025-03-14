import { NFData } from "../../input";
import { parseCurrency } from "./currency";
import { formatDateToMonthYear } from "./monthYear";

export function createDescription(data: NFData) {
  const date = formatDateToMonthYear(data.reference.date);
  const value = parseCurrency(data.value);

  return `Serviços prestados em ${date} | Valor: R$ ${value} | Pix: ${data.pix}`;
}
