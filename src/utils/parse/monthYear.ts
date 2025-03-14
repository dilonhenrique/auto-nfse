export function formatDateToMonthYear(date: Date): string {
  const formattedDate = date
    .toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
    .replace(" de ", "/");

  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}
