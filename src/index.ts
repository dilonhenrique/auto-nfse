import { InvoiceEmitter } from "./services/InvoiceEmitter";
import { InvoiceDataCollector } from "./services/InvoiceDataCollector";
import { User } from "./services/User";

const main = async () => {
  const user = new User();

  const invoiceData = await new InvoiceDataCollector(user).collect();

  const invoice = await new InvoiceEmitter(user).init();
  const resume = await invoice.generate(invoiceData);
  console.log(resume);
};

/**
 * TODO:
 * logs durante emissao nf
 * validacao no final
 * refatoracao em classes
 */

main();

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
