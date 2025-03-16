import { InvoiceEmitter } from "./services/InvoiceEmitter";
import { InvoiceDataCollector } from "./services/InvoiceDataCollector";
import { User } from "./services/User";
import { InvoiceDataFormatter } from "./services/TerminalFormatter";
import { InvoiceEmail } from "./services/InvoiceEmail";

const main = async () => {
  const user = new User();

  const invoiceData = await new InvoiceDataCollector(user).collect();

  const invoice = await new InvoiceEmitter(user).init();
  const resume = await invoice.generate(invoiceData);

  const approved = await InvoiceDataFormatter.display(resume);

  if (approved) {
    // const url = await invoice.emitAndDownload();
    const url = await invoice.downloadLastInvoice();

    const invoiceEmailer = new InvoiceEmail();
    await invoiceEmailer.sendNf({
      user,
      to: invoiceData.email,
      invoice: { ...invoiceData, url },
    });
  } else {
    console.log("Eu nem queria mesmo...");
  }

  process.exit(1);
};

/**
 * TODO:
 * apos aprovar > emitir
 * log
 * download
 * log
 * email
 * log
 */

main();

/**
 * BAIXAR PDF:
 * Nome: Dilon Henrique Souza da Silva - Remuneração de Fevereiro-2025
 *
 * EMAIL:
 * para: francielle.barbosa@abstrato.ventures
 * assunto: Dilon Henrique Souza da Silva - Remuneração de Fevereiro-2025
 * corpo: Serviços prestados em Fevereiro/2025 | Valor: R$ 12.992,53 | Pix: 009.553.790-24
 */
