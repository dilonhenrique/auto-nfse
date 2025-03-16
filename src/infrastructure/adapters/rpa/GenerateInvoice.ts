import { Page } from "puppeteer";
import { User } from "../../../application/services/User";
import { createDescription } from "../../../shared/utils/createDescription";
import { parseCurrency } from "../../../shared/utils/parsers/currency";
import {
  GenerateInvoiceData,
  GenerateInvoicePeopleData,
  GenerateInvoiceServiceData,
  InvoiceData,
} from "../../../shared/types/types";

const NF_URL =
  "https://www.nfse.gov.br/EmissorNacional/Login?ReturnUrl=%2fEmissorNacional/DPS/Pessoas";

export class GenerateInvoice {
  constructor(private page: Page, private user: User) {}

  private async waitLoading() {
    await this.page.waitForFunction(() => {
      return document.body.innerText.includes("Por favor, aguarde...");
    });

    await this.page.waitForFunction(() => {
      return !document.body.innerText.includes("Por favor, aguarde...");
    });
  }

  private async clickSubmit() {
    await this.page.locator("button[type=submit]").click();
    // await this.page.waitForNavigation();
  }

  public async execute(data: GenerateInvoiceData) {
    console.log("\nIniciando criação da Nota fiscal...");

    await this.login();
    await this.fillPeopleForm(data.people);
    await this.fillServiceForm(data.service);
    await this.fillValue(data.value);
    return await this.finish();
  }

  private async login() {
    await this.page.goto(NF_URL, { waitUntil: "load" });
    await this.page.locator("input[name=Inscricao]").fill(this.user.cnpj);
    await this.page.locator("input[name=Senha]").fill(this.user.password);

    await this.clickSubmit();
    console.log("✅ Login efetuado");
  }

  private async fillPeopleForm(data: GenerateInvoicePeopleData) {
    await this.page.locator("input[name=DataCompetencia]").fill(data.reference);
    await this.page.locator("form").click();
    await this.waitLoading();

    await this.page
      .locator("label:has(input[name='Tomador.LocalDomicilio'][value='1'])")
      .click();
    await this.page.locator("input[name='Tomador.Inscricao']").fill(data.cnpj);
    await this.page.locator("button#btn_Tomador_Inscricao_pesquisar").click();

    await this.page.waitForSelector("input#Tomador_Nome");
    await this.waitLoading();

    await this.clickSubmit();
    console.log("✅ Pessoas concluído");
  }

  private async fillServiceForm(data: GenerateInvoiceServiceData) {
    await this.selectOptions(data);
    await this.fillServiceDetails(data);
  }

  private async selectOptions(data: GenerateInvoiceServiceData) {
    await this.selectDropdown(
      "span[role=combobox][aria-labelledby='select2-LocalPrestacao_CodigoMunicipioPrestacao-container']",
      "input[aria-controls='select2-LocalPrestacao_CodigoMunicipioPrestacao-results']",
      data.city
    );

    await this.selectDropdown(
      "span[role=combobox][aria-labelledby='select2-ServicoPrestado_CodigoTributacaoNacional-container']",
      "input[aria-controls='select2-ServicoPrestado_CodigoTributacaoNacional-results']",
      data.tribNac
    );
    await this.waitLoading();

    await this.page
      .locator(
        "label:has(input[name='ServicoPrestado.HaExportacaoImunidadeNaoIncidencia'][value='0'])"
      )
      .click();
    await this.waitLoading();
  }

  private async fillServiceDetails(data: GenerateInvoiceServiceData) {
    await this.page
      .locator("textarea[name='ServicoPrestado.Descricao']")
      .fill(data.description);

    await this.selectDropdown(
      "#ServicoPrestado_CodigoNBS_chosen a.chosen-single",
      "#ServicoPrestado_CodigoNBS_chosen .chosen-search > input",
      data.nbs
    );

    await this.clickSubmit();

    console.log("✅ Serviço concluído");
  }

  private async fillValue(value: string) {
    await this.page.locator("input[name='Valores.ValorServico']").fill(value);

    await this.clickSubmit();
    await this.page.waitForNavigation();

    console.log("✅ Valores concluído");
  }

  private async selectDropdown(
    containerSelector: string,
    inputSelector: string,
    value: string
  ) {
    await this.page.locator(containerSelector).click();
    await this.page.locator(inputSelector).fill(value);
    await this.page.locator(`li ::-p-text(${value})`).click();
  }

  private async finish() {
    const resume = await this.page.evaluate(() => {
      const sections = document.querySelectorAll("div.emissao-conteudo");
      if (!sections) return null;

      return Array.from(sections).map((section) => {
        const keys = Array.from(section.querySelectorAll("dt")).map(
          (dt) => dt.textContent?.trim() || ""
        );
        const vals = Array.from(section.querySelectorAll("dd")).map(
          (dd) => dd.textContent?.trim() || ""
        );

        const data: Record<string, string> = {};
        keys.forEach((key, index) => {
          data[key.replace(":", "")] = vals[index] || "";
        });

        return data;
      });
    });

    if (resume) {
      console.log("📃 Nota fiscal preparada!\n");
    } else {
      throw new Error("Erro ao gerar resumo da Nota fiscal");
    }

    return resume?.filter((obj) => Object.keys(obj).length);
  }
}
