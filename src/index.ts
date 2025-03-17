import { User } from "./application/services/User";
import { InvoiceDataCollector } from "./application/services/InvoiceDataCollector";
import { InvoiceEmitter } from "./application/services/InvoiceEmitter";
import { InvoiceEmailer } from "./application/services/InvoiceEmailer";

const main = async () => {
  const user = new User();

  const invoiceData = await new InvoiceDataCollector(user).collect();

  const emitter = await new InvoiceEmitter(user).init();
  await emitter.generate(invoiceData);

  const approved = await emitter.askForApproval();

  if (approved) {
    const url = await emitter.emitAndDownload();
    // const url = await emitter.downloadLastInvoice();

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
