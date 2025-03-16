import { User } from "../services/User";
import { InvoiceData } from "../types/types";
import { formatDateToMonthYear } from "./parsers/monthYear";

export function createSubject(user: User, data: InvoiceData) {
  // Dilon Henrique Souza da Silva - Remuneração de Fevereiro-2025
  const date = formatDateToMonthYear(data.reference.date).replace("/", "-");

  return `${user.name} - Remuneração de ${date}`;
}
