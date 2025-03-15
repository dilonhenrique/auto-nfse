import puppeteer, { Browser, Page } from "puppeteer";
import { User } from "./User";
import { GenerateInvoice } from "../automation/GenerateInvoice";
import { InvoiceData } from "../types/types";
import { EmitInvoice } from "../automation/EmitInvoice";
import { DownloadLastInvoice } from "../automation/DownloadLastInvoice";

export class InvoiceEmitter {
  private user: User;
  private browser?: Browser;
  private page?: Page;
  private isGenerated = false;

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
    const resume = await process.execute();

    this.isGenerated = true;

    return resume;
  }

  public async emitAndDownload() {
    if (!this.page) throw new Error("O navegador não foi inicializado.");
    if (!this.isGenerated)
      throw new Error("Você deve gerar a Nota fiscal antes de emitir");

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
