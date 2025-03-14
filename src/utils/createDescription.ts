import { InvoiceData } from "../types/types";
import { parseCurrency } from "./parse/currency";
import { formatDateToMonthYear } from "./parse/monthYear";

export function createDescription(data: InvoiceData) {
  const date = formatDateToMonthYear(data.reference.date);
  const value = parseCurrency(data.value);

  return `Serviços prestados em ${date} | Valor: R$ ${value} | Pix: ${data.pix}`;
}
