import puppeteer from "puppeteer";
import { User } from "../user";
import { NFData } from "../input";
import { Page } from "puppeteer";
import { createDescription } from "../utils/parse/createDescription";
import { parseCurrency } from "../utils/parse/currency";

const NF_URL =
  "https://www.nfse.gov.br/EmissorNacional/Login?ReturnUrl=%2fEmissorNacional/DPS/Pessoas";

export class EmitNf {
  private user: User;
  private data: NFData;

  constructor(user: User, data: NFData) {
    this.user = user;
    this.data = data;
  }

  public async execute() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const response = await new EmitProcess(
      page,
      this.user,
      this.data
    ).execute();

    browser.close();

    return response;
  }
}

class EmitProcess {
  private page: Page;
  private user: User;
  private data: NFData;

  constructor(page: Page, user: User, data: NFData) {
    this.user = user;
    this.data = data;
    this.page = page;
  }

  private async waitLoading() {
    await this.page.waitForFunction(() => {
      return document.body.innerText.includes("Por favor, aguarde...");
    });

    await this.page.waitForFunction(() => {
      return !document.body.innerText.includes("Por favor, aguarde...");
    });
  }

  public async execute() {
    await this.login();
    await this.firstPage();

    await this.selectCity();

    await this.selectTribNac();
    await this.waitLoading();

    await this.setIssqnImunity();
    await this.waitLoading();

    await this.setDescription();

    await this.setNbs();

    await this.setValue();

    return await this.close();
  }

  private async login() {
    await this.page?.goto(NF_URL, { waitUntil: "load" });

    await this.page.type("input[name=Inscricao]", this.user.cnpj);
    await this.page.type("input[name=Senha]", this.user.password);

    await this.page.click("button[type=submit]");

    await this.page.waitForNavigation();
    // await this.page.waitForSelector(".navbar-brand.completa");
  }

  private async firstPage() {
    await this.page.type(
      "input[name=DataCompetencia]",
      this.data.reference.string
    );
    // await page.click("body");

    await this.page.locator("form").click();
    await this.waitLoading();

    await this.page.click(
      "label:has(input[name='Tomador.LocalDomicilio'][value='1'])"
    );
    // await new Promise((resolve) => setTimeout(resolve, 500));
    // await this.page.click(
    //   "label:has(input[name='Tomador.LocalDomicilio'][value='1'])"
    // );
    // await new Promise((resolve) => setTimeout(resolve, 500));
    // await this.page.click(
    //   "label:has(input[name='Tomador.LocalDomicilio'][value='1'])"
    // );

    await this.page
      .locator("input[name='Tomador.Inscricao']")
      .fill(this.data.cnpj);

    // await this.page.type("input[name='Tomador.Inscricao']", this.data.cnpj);

    await this.page.click("button#btn_Tomador_Inscricao_pesquisar");

    await this.page.waitForSelector("input#Tomador_Nome");
    // await this.page.click("input#Tomador_Nome");

    // await new Promise((resolve) => setTimeout(resolve, 2000));
    await this.waitLoading();

    // await this.page.click("button#btnAvancar");
    await this.page.click("button[type=submit]");
    await this.page.waitForNavigation();
  }

  private async selectCity() {
    await this.page
      .locator(
        "span[role=combobox][aria-labelledby='select2-LocalPrestacao_CodigoMunicipioPrestacao-container']"
      )
      .click();

    await this.page
      .locator(
        "input[aria-controls='select2-LocalPrestacao_CodigoMunicipioPrestacao-results']"
      )
      .fill("Florianópolis");

    // await new Promise((resolve) => setTimeout(resolve, 2000));

    await this.page
      .locator('li[role="option"] ::-p-text(Florianópolis)')
      .click();
  }

  private async selectTribNac() {
    await this.page
      .locator(
        "span[role=combobox][aria-labelledby='select2-ServicoPrestado_CodigoTributacaoNacional-container']"
      )
      .click();

    await this.page
      .locator(
        "input[aria-controls='select2-ServicoPrestado_CodigoTributacaoNacional-results']"
      )
      .fill(this.data.tribNac);

    // await new Promise((resolve) => setTimeout(resolve, 2000));

    await this.page
      .locator(`li[role="option"] ::-p-text(${this.data.tribNac})`)
      .click();
  }

  private async setIssqnImunity() {
    await this.page.click(
      "label:has(input[name='ServicoPrestado.HaExportacaoImunidadeNaoIncidencia'][value='0'])"
    );
  }

  private async setDescription() {
    const description = createDescription(this.data);

    await this.page
      .locator("textarea[name='ServicoPrestado.Descricao']")
      .fill(description);
  }

  private async setNbs() {
    const dropdown = await this.page.waitForSelector(
      "#ServicoPrestado_CodigoNBS_chosen"
    );

    const trigger = await dropdown?.waitForSelector("a.chosen-single");
    const search = await dropdown?.waitForSelector(".chosen-search > input");

    await trigger?.click();
    await search?.type(this.data.nbs);

    await this.page
      .locator(
        `#ServicoPrestado_CodigoNBS_chosen li ::-p-text(${this.data.nbs})`
      )
      .click();

    await this.page.click("button[type=submit]");
    await this.page.waitForNavigation();
  }

  private async setValue() {
    await this.page.type(
      "input[name='Valores.ValorServico']",
      parseCurrency(this.data.value)
    );

    await this.page.click("button[type=submit]");
    await this.page.waitForNavigation();
  }

  private async close() {
    // const sections = this.page.locator("div.emissao-conteudo");
    const brief = await this.page.evaluate(() => {
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

    // await new Promise((resolve) => setTimeout(resolve, 15000));

    return brief?.filter((obj) => Object.keys(obj).length);
  }
}

// export async function emitNf(user: User, data: NFData) {
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();

//   await page.goto(NF_URL, { waitUntil: "load" });

//   await page.type("input[name=Inscricao]", user.cnpj);
//   await page.type("input[name=Senha]", user.password);

//   await page.click("button[type=submit]");

//   await page.waitForNavigation();
//   await page.waitForSelector(".navbar-brand.completa");
//   // await new Promise((resolve) => setTimeout(resolve, 2000));

//   // await page.click('a[href="/EmissorNacional/DPS/Pessoas"]');
//   // await page.goto("https://www.nfse.gov.br/EmissorNacional/DPS/Pessoas");

//   await page.type("input[name=DataCompetencia]", data.reference.string);
//   // await page.click("body");

//   await page.click(
//     "label:has(input[name='Tomador.LocalDomicilio'][value='1'])"
//   );
//   await new Promise((resolve) => setTimeout(resolve, 500));
//   await page.click(
//     "label:has(input[name='Tomador.LocalDomicilio'][value='1'])"
//   );
//   await new Promise((resolve) => setTimeout(resolve, 500));
//   await page.click(
//     "label:has(input[name='Tomador.LocalDomicilio'][value='1'])"
//   );

//   const el = await page.waitForSelector("input[name='Tomador.Inscricao']");

//   await page.type("input[name='Tomador.Inscricao']", data.cnpj);

//   await page.click("button#btn_Tomador_Inscricao_pesquisar");

//   await page.waitForSelector("input#Tomador_Nome");
//   // await page.click("input#Tomador_Nome");

//   await new Promise((resolve) => setTimeout(resolve, 2000));

//   await page.click("button#btnAvancar");

//   // -------------------------------

//   const select = await page.waitForSelector(
//     "span[role=combobox][aria-labelledby='select2-LocalPrestacao_CodigoMunicipioPrestacao-container']"
//   );
//   await select?.click();

//   const serachDD = await page.waitForSelector(
//     "input[aria-controls='select2-LocalPrestacao_CodigoMunicipioPrestacao-results']"
//   );
//   await serachDD?.type("Florianópolis");

//   await new Promise((resolve) => setTimeout(resolve, 2000));

//   const option = await page.wait("li[role=option]:has(Florianópolis)");
//   await option?.click();

//   // Alternativa para `waitForTimeout` -> usar setTimeout
//   await new Promise((resolve) => setTimeout(resolve, 5000));

//   await browser.close();
// }

// async function login(user: User) {}
