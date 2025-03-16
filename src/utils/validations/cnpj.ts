function isValidCNPJFormat(cnpj: string): boolean {
  const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
  return cnpjRegex.test(cnpj.trim());
}

export function isValidCNPJ(cnpj: string): boolean {
  if (!isValidCNPJFormat(cnpj)) return false;

  // Remove caracteres não numéricos
  const cleanedCNPJ = cnpj.trim().replace(/[^\d]/g, "");

  if (cleanedCNPJ.length !== 14) return false;

  // Elimina CNPJs com todos os dígitos iguais
  if (/^(\d)\1+$/.test(cleanedCNPJ)) return false;

  const calcDigits = (cnpjBase: string, weights: number[]): number => {
    let sum = 0;
    weights.forEach((weight, index) => {
      sum += parseInt(cnpjBase[index]) * weight;
    });

    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  // Calcula os dois dígitos verificadores
  const baseCNPJ = cleanedCNPJ.slice(0, 12);
  const firstDigit = calcDigits(baseCNPJ, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const secondDigit = calcDigits(
    baseCNPJ + firstDigit,
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  );

  return (
    cleanedCNPJ === baseCNPJ + firstDigit.toString() + secondDigit.toString()
  );
}
