export function getLastMonth(){
  const today = new Date();
  const lastMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
  const year = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();

  return new Date(year, lastMonth, 12);
}