import { Page } from "puppeteer";
import { User } from "../services/User";
import { createDescription } from "../utils/createDescription";
import { parseCurrency } from "../utils/parse/currency";
import { InvoiceData } from "../types/types";

const NF_URL =
  "https://www.nfse.gov.br/EmissorNacional/Login?ReturnUrl=%2fEmissorNacional/DPS/Pessoas";

export class GenerateInvoice {
  constructor(
    private page: Page,
    private user: User,
    private data: InvoiceData
  ) {}

  private async waitLoading() {
    await this.page.waitForFunction(() => {
      return document.body.innerText.includes("Por favor, aguarde...");
    });

    await this.page.waitForFunction(() => {
      return !document.body.innerText.includes("Por favor, aguarde...");
    });
  }

  private async clickSubmit() {
    await this.page.click("button[type=submit]");
    await this.page.waitForNavigation();
  }

  public async execute() {
    console.log("Iniciando criação da Nota fiscal...");

    await this.login();
    await this.fillInitialForm();
    await this.selectOptions();
    await this.fillServiceDetails();
    return await this.finish();
  }

  private async login() {
    await this.page.goto(NF_URL, { waitUntil: "load" });
    await this.page.type("input[name=Inscricao]", this.user.cnpj);
    await this.page.type("input[name=Senha]", this.user.password);

    await this.clickSubmit();
    console.log("\nLogin efetuado");
  }

  private async fillInitialForm() {
    await this.page.type(
      "input[name=DataCompetencia]",
      this.data.reference.string
    );
    await this.page.locator("form").click();
    await this.waitLoading();

    await this.page.click(
      "label:has(input[name='Tomador.LocalDomicilio'][value='1'])"
    );
    await this.page
      .locator("input[name='Tomador.Inscricao']")
      .fill(this.data.cnpj);
    await this.page.click("button#btn_Tomador_Inscricao_pesquisar");

    await this.page.waitForSelector("input#Tomador_Nome");
    await this.waitLoading();

    await this.clickSubmit();
    console.log("Pessoas concluído");
  }

  private async selectOptions() {
    await this.selectDropdown(
      "span[role=combobox][aria-labelledby='select2-LocalPrestacao_CodigoMunicipioPrestacao-container']",
      "input[aria-controls='select2-LocalPrestacao_CodigoMunicipioPrestacao-results']",
      this.data.city
    );

    await this.selectDropdown(
      "span[role=combobox][aria-labelledby='select2-ServicoPrestado_CodigoTributacaoNacional-container']",
      "input[aria-controls='select2-ServicoPrestado_CodigoTributacaoNacional-results']",
      this.data.tribNac
    );
    await this.waitLoading();

    await this.page.click(
      "label:has(input[name='ServicoPrestado.HaExportacaoImunidadeNaoIncidencia'][value='0'])"
    );
    await this.waitLoading();
  }

  private async fillServiceDetails() {
    const description = createDescription(this.data);
    await this.page
      .locator("textarea[name='ServicoPrestado.Descricao']")
      .fill(description);

    await this.selectDropdown(
      "#ServicoPrestado_CodigoNBS_chosen a.chosen-single",
      "#ServicoPrestado_CodigoNBS_chosen .chosen-search > input",
      this.data.nbs
    );

    await this.clickSubmit();

    console.log("Serviço concluído");

    await this.page.type(
      "input[name='Valores.ValorServico']",
      parseCurrency(this.data.value)
    );
    await this.clickSubmit();

    console.log("Valores concluído");
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
      console.log("Nota fiscal preparada!\n");
    } else {
      throw new Error("Erro ao gerar resumo da Nota fiscal");
    }

    return resume?.filter((obj) => Object.keys(obj).length);
  }
}
