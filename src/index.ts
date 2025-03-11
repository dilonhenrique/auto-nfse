import puppeteer from "puppeteer";
import { CNPJ, PASS } from "./consts/consts";

const openPage = async (url: string) => {
  if (!CNPJ || !PASS) return;

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "load" });

  await page.type("input[name=Inscricao]", CNPJ);
  await page.type("input[name=Senha]", PASS);

  await page.click("button[type=submit]");

  await page.waitForSelector(".navbar-brand.completa");
  // await new Promise((resolve) => setTimeout(resolve, 2000));

  // await page.click('a[href="/EmissorNacional/DPS/Pessoas"]');
  // await page.goto("https://www.nfse.gov.br/EmissorNacional/DPS/Pessoas");

  await page.type("input[name=DataCompetencia]", "12/02/2025");
  await new Promise((resolve) => setTimeout(resolve, 100));
  // await page.click("body");

  // Alternativa para `waitForTimeout` -> usar setTimeout
  await new Promise((resolve) => setTimeout(resolve, 5000));

  await browser.close();
};

openPage(
  "https://www.nfse.gov.br/EmissorNacional/Login?ReturnUrl=%2fEmissorNacional/DPS/Pessoas"
);

/**
 * FLUXO:
 * - pede todos os inputs com default pré setado
 * - alguns campos precisam de validacao - pede de novo, caso falhe
 * - valida tudo com um resumo
 * - emite via pupeteer
 * - avisa o resultado no terminal
 * - caso de falha, encerra
 * - baixa e salva o pdf
 * - envia o email
 * - avisa o resultado no terminal
 * 
 * CADASTRO (env):
 * - nome completo
 * - cnpj
 * - senha
 * 
 * INPUTS:
 * - cnpj tomador: 36.396.246/0001-71
 * - valor do servico: 12.992,53
 * - pix: 009.553.790-24
 * - cód. tributacao naciona: 010601 - Assessoria e consultoria em informática.
 * - cód. item NBS: 115011000 - Serviços de consultoria em tecnologia da informação (TI)
 * - Período: mês e ano @default = mês anterior
 * 
 * MONTAR descrição:
 * Serviços prestados em Fevereiro/2025 | Valor: R$ 12.992,53 | Pix: 009.553.790-24
 * Serviços prestados em [período/ano] | Valor: R$ [valor] | Pix: [pix]
 * 
 * BAIXAR PDF:
 * Nome: Dilon Henrique Souza da Silva - Remuneração de Fevereiro-2025
 * 
 * EMAIL:
 * para: francielle.barbosa@abstrato.ventures
 * assunto: Dilon Henrique Souza da Silva - Remuneração de Fevereiro-2025
 * corpo: Serviços prestados em Fevereiro/2025 | Valor: R$ 12.992,53 | Pix: 009.553.790-24
 */
