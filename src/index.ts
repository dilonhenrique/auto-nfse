import { InvoiceEmitter } from "./services/InvoiceEmitter";
import { InvoiceDataCollector } from "./services/InvoiceDataCollector";
import { User } from "./services/User";
import { InvoiceEmailer } from "./services/InvoiceEmailer";

const main = async () => {
  const user = new User();

  const invoiceData = await new InvoiceDataCollector(user).collect();

  const invoice = await new InvoiceEmitter(user).init();
  await invoice.generate(invoiceData);

  const approved = await invoice.askForApproval();

  if (approved) {
    const url = await invoice.emitAndDownload();

    const mailer = new InvoiceEmailer();
    await mailer.sendNf({
      user,
      to: invoiceData.email,
      invoice: { ...invoiceData, url },
    });
  } else {
    console.log("Eu nem queria mesmo...");
  }

  process.exit(1);
};

main();
