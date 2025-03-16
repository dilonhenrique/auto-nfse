import puppeteer, { Browser, Page } from "puppeteer";
import { User } from "./User";
import { GenerateInvoice } from "../adapters/rpa/GenerateInvoice";
import { InvoiceData } from "../types/types";
import { EmitInvoice } from "../adapters/rpa/EmitInvoice";
import { DownloadLastInvoice } from "../adapters/rpa/DownloadLastInvoice";
import { InvoiceReviewer } from "./InvoiceReviewer";

export class InvoiceEmitter {
  private user: User;
  private browser?: Browser;
  private page?: Page;
  private resume?: Record<string, string>[] | undefined;

  constructor(user: User) {
    this.user = user;
  }

  public async init() {
    this.browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
      args: [
        `--disable-blink-features=AutomationControlled`,
        `--disable-popup-blocking`,
        `--disable-default-apps`,
        `--disable-extensions`,
      ],
    });
    this.page = await this.browser.newPage();

    return this;
  }

  public async generate(data: InvoiceData) {
    if (!this.page) throw new Error("O navegador não foi inicializado.");

    const process = new GenerateInvoice(this.page, this.user, data);
    this.resume = await process.execute();

    return this.resume;
  }

  public async askForApproval() {
    if (!this.resume) throw new Error("Nenhuma Nota fiscal para aprovação");

    return await new InvoiceReviewer(this.resume).askApproval();
  }

  public async emitAndDownload() {
    if (!this.page) throw new Error("O navegador não foi inicializado.");
    if (!this.resume) throw new Error("Nenhuma Nota fiscal para emitir");

    const process = new EmitInvoice(this.page);
    return await process.execute();
  }

  public async downloadLastInvoice() {
    if (!this.page) throw new Error("O navegador não foi inicializado.");

    const process = new DownloadLastInvoice(this.page);
    return await process.execute();
  }

  public async close() {
    await this.browser?.close();
  }
}
