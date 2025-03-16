import { InvoiceData } from "../../shared/types/types";
import { parseCurrency } from "./parsers/currency";
import { formatDateToMonthYear } from "./parsers/monthYear";

export function createDescription(data: InvoiceData) {
  const date = formatDateToMonthYear(data.reference.date);
  const value = parseCurrency(data.value);

  return `Serviços prestados em ${date} | Valor: R$ ${value} | Pix: ${data.pix}`;
}
