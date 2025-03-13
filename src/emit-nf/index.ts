import puppeteer from "puppeteer";
import { User } from "../user";
import { NFData } from "../input";

const NF_URL =
  "https://www.nfse.gov.br/EmissorNacional/Login?ReturnUrl=%2fEmissorNacional/DPS/Pessoas";

export async function emitNf(user: User, data: NFData) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(NF_URL, { waitUntil: "load" });

  await page.type("input[name=Inscricao]", user.cnpj);
  await page.type("input[name=Senha]", user.password);

  await page.click("button[type=submit]");

  await page.waitForSelector(".navbar-brand.completa");
  // await new Promise((resolve) => setTimeout(resolve, 2000));

  // await page.click('a[href="/EmissorNacional/DPS/Pessoas"]');
  // await page.goto("https://www.nfse.gov.br/EmissorNacional/DPS/Pessoas");

  await page.type("input[name=DataCompetencia]", data.reference.string);
  // await page.click("body");

  await page.click(
    "label:has(input[name='Tomador.LocalDomicilio'][value='1'])"
  );
  await new Promise((resolve) => setTimeout(resolve, 500));
  await page.click(
    "label:has(input[name='Tomador.LocalDomicilio'][value='1'])"
  );
  await new Promise((resolve) => setTimeout(resolve, 500));
  await page.click(
    "label:has(input[name='Tomador.LocalDomicilio'][value='1'])"
  );

  const el = await page.waitForSelector("input[name='Tomador.Inscricao']");

  await page.type("input[name='Tomador.Inscricao']", data.cnpj);

  await page.click("button#btn_Tomador_Inscricao_pesquisar");

  // Alternativa para `waitForTimeout` -> usar setTimeout
  await new Promise((resolve) => setTimeout(resolve, 5000));

  await browser.close();
}
