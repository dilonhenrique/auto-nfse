import { config } from "dotenv";
import { CliPrompt } from "../../infrastructure/adapters/CliPrompt";
import { InvoiceData, ReferenceDate } from "../../shared/types/types";
import { getLastMonth } from "../../shared/utils/getLastMonth";
import { parseDate } from "../../shared/utils/parsers/date";
import { parseDecimal } from "../../shared/utils/parsers/decimal";
import { isValidCNPJ } from "../../shared/utils/validations/cnpj";
import { isValidDateFormat } from "../../shared/utils/validations/date";
import { isValidDecimal } from "../../shared/utils/validations/decimal";
import { isValidEmail } from "../../shared/utils/validations/email";
import { isValidNbs } from "../../shared/utils/validations/nbs";
import { isTribNac } from "../../shared/utils/validations/tribNac";
import { User } from "./User";

export class InvoiceDataCollector {
  private user: User;
  private prompt: CliPrompt;
  private invoiceData: Partial<InvoiceData> = {};

  private readonly defaultValues: Record<keyof InvoiceData, string | undefined>;

  constructor(user: User) {
    this.user = user;
    this.prompt = new CliPrompt();

    const { parsed } = config();

    this.defaultValues = {
      reference: getLastMonth().toLocaleDateString(),
      cnpj: parsed?.INVOICE_DEFAULT_CNPJ,
      value: parsed?.INVOICE_DEFAULT_VALUE,
      pix: parsed?.INVOICE_DEFAULT_PIX,
      tribNac: parsed?.INVOICE_DEFAULT_TRIBNAC,
      nbs: parsed?.INVOICE_DEFAULT_NBS,
      city: parsed?.INVOICE_DEFAULT_CITY,
      email: parsed?.INVOICE_DEFAULT_EMAIL,
    };
  }

  async collect(): Promise<InvoiceData> {
    const name = this.user.name.split(" ")[0];
    console.log(`\x1b[1m\x1b[33mOlá, ${name}!\x1b[0m\n`);

    this.invoiceData.reference = await this.askDate(
      "Qual a data de referência da emissão da NFe? (DD/MM/YYYY)",
      this.defaultValues.reference
    );

    this.invoiceData.value = parseDecimal(
      await this.askNumber("Qual o valor da Nota?", this.defaultValues.value)
    );

    this.invoiceData.pix = await this.askString(
      "Qual o seu PIX?",
      this.defaultValues.pix
    );

    this.invoiceData.cnpj = await this.askString(
      "Qual o CNPJ do tomador? (00.000.000/0000-00)",
      this.defaultValues.cnpj,
      isValidCNPJ
    );

    this.invoiceData.email = await this.askString(
      "Qual o email do financeiro?",
      this.defaultValues.email,
      isValidEmail
    );

    this.invoiceData.city = await this.askString(
      "Qual a cidade em que o serviço foi feito?",
      this.defaultValues.city
    );

    this.invoiceData.tribNac = await this.askString(
      "Qual o código de tributação nacional? (00.00.00)",
      this.defaultValues.tribNac,
      isTribNac
    );

    this.invoiceData.nbs = await this.askString(
      "Qual o código NBS? (000000000)",
      this.defaultValues.nbs,
      isValidNbs
    );

    this.prompt.close();

    return this.formatData();
  }

  private async askString(
    question: string,
    defaultValue?: string,
    validation?: (val: string) => boolean
  ): Promise<string> {
    return await this.prompt.ask(question, { validation, defaultValue });
  }

  private async askNumber(
    question: string,
    defaultValue?: string
  ): Promise<string> {
    return await this.prompt.ask(question, {
      validation: isValidDecimal,
      defaultValue,
    });
  }

  private async askDate(
    question: string,
    defaultValue?: string
  ): Promise<{ string: string; date: Date }> {
    const referenceStr = await this.prompt.ask(question, {
      validation: isValidDateFormat,
      defaultValue,
    });

    const referenceDate = parseDate(referenceStr);
    if (!referenceDate) {
      console.error("Data de referência inválida");
      process.exit(1);
    }

    return { string: referenceStr, date: referenceDate };
  }

  private formatData(): InvoiceData {
    return {
      reference: this.invoiceData.reference as ReferenceDate,
      value: this.invoiceData.value as number,
      pix: this.invoiceData.pix as string,
      cnpj: this.invoiceData.cnpj as string,
      tribNac: this.invoiceData.tribNac as string,
      nbs: this.invoiceData.nbs as string,
      city: this.invoiceData.city as string,
      email: this.invoiceData.email as string,
    };
  }
}
