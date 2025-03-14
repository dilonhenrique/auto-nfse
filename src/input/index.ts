import { User } from "../user";
import { parseDate } from "../utils/parse/date";
import { parseDecimal } from "../utils/parse/decimal";
import { isValidCNPJ } from "../utils/validation/cnpj";
import { isValidDateFormat } from "../utils/validation/date";
import { isValidDecimal } from "../utils/validation/decimal";
import { isValidNumber } from "../utils/validation/number";
import { isTribNac } from "../utils/validation/tribNac";
import { askQuestion } from "./question";
import { rl } from "./questionPromise";

type ReferenceDate = {
  string: string;
  date: Date;
};

export type NFData = {
  reference: ReferenceDate;
  value: number;
  pix: string;
  cnpj: string;
  tribNac: string;
  nbs: string;
};

// * - cnpj tomador: 36.396.246/0001-71
//  * - valor do servico: 12.992,53
//  * - pix: 009.553.790-24
//  * - cód. tributacao naciona: 010601 - Assessoria e consultoria em informática.
//  * - cód. item NBS: 115011000 - Serviços de consultoria em tecnologia da informação (TI)
//  * - Período: mês e ano @default = mês anterior

const defaultValues: Record<keyof NFData, string> = {
  cnpj: "36.396.246/0001-71",
  value: "12.992,53",
  reference: "12/02/2025",
  pix: "009.553.790-24",
  tribNac: "01.06.01",
  nbs: "115011000",
};

export async function getNfData(user: User): Promise<NFData> {
  const name = user.name.split(" ")[0];

  console.log(`\x1b[1m\x1b[33mOlá, ${name}!\x1b[0m\n`);

  return {
    ...defaultValues,
    value: parseDecimal(defaultValues.value),
    reference: {
      string: defaultValues.reference,
      date: parseDate(defaultValues.reference) as Date,
    },
  };

  // const referenceStr = await askQuestion(
  //   "Qual a data de referência da emissão da NFe? (DD/MM/YYYY)",
  //   { validation: isValidDateFormat, defaultValue: defaultValues.reference }
  // );

  // const valueStr = await askQuestion("Qual o valor da Nota?", {
  //   validation: isValidDecimal,
  //   defaultValue: defaultValues.value,
  // });

  // const pix = await askQuestion("Qual o seu PIX?", {
  //   defaultValue: defaultValues.pix,
  // });

  // const cnpj = await askQuestion(
  //   "Qual o Cnpj do tomador? (00.000.000/0000-00)",
  //   { validation: isValidCNPJ, defaultValue: defaultValues.cnpj }
  // );

  // const tribNac = await askQuestion(
  //   "Qual o código de tributação nacional? (00.00.00)",
  //   { validation: isTribNac, defaultValue: defaultValues.tribNac }
  // );

  // const nbs = await askQuestion("Qual o código Nbs? (somente números)", {
  //   validation: isValidNumber,
  //   defaultValue: defaultValues.nbs,
  // });

  // rl.close();

  // const reference = parseDate(referenceStr);

  // if (!reference) {
  //   console.error("Data de referência inválida");
  //   process.exit(1);
  // }

  // return {
  //   reference: { string: referenceStr, date: reference },
  //   value: parseDecimal(valueStr),
  //   pix,
  //   cnpj,
  //   tribNac,
  //   nbs,
  // };
}
