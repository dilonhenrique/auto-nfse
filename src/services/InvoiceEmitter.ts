import { GenerateInvoice } from "../adapters/rpa/GenerateInvoice";
import { EmitInvoice } from "../adapters/rpa/EmitInvoice";
import { DownloadLastInvoice } from "../adapters/rpa/DownloadLastInvoice";
import { InvoiceReviewer } from "./InvoiceReviewer";
import { User } from "./User";
import { InvoiceData } from "../types/types";
import { createDescription } from "../utils/createDescription";
import { InvoiceAutomation } from "../adapters/InvoiceAutomation";
import { parseCurrency } from "../utils/parsers/currency";

export class InvoiceEmitter {
  private automation: InvoiceAutomation;
  private user: User;
  private resume?: Record<string, string>[];

  constructor(user: User) {
    this.user = user;
    this.automation = new InvoiceAutomation();
  }

  public async init() {
    await this.automation.init();
    return this;
  }

  public async generate(data: InvoiceData) {
    const page = this.automation.getPage();

    const process = new GenerateInvoice(page, this.user);

    this.resume = await process.execute({
      people: {
        reference: data.reference.string,
        cnpj: data.cnpj,
      },
      service: {
        city: data.city,
        description: createDescription(data),
        tribNac: data.tribNac,
        nbs: data.nbs,
      },
      value: parseCurrency(data.value),
    });
  }

  public async askForApproval(): Promise<boolean> {
    if (!this.resume) throw new Error("Nenhuma Nota fiscal para aprovação");
    return new InvoiceReviewer(this.resume).askApproval();
  }

  public async emitAndDownload() {
    const page = this.automation.getPage();
    if (!this.resume) throw new Error("Nenhuma Nota fiscal para emitir");

    const process = new EmitInvoice(page);
    return await process.execute();
  }

  public async downloadLastInvoice() {
    const page = this.automation.getPage();
    const process = new DownloadLastInvoice(page);
    await process.execute();
  }
}
