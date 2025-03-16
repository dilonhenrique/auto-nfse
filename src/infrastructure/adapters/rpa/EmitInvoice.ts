import { InvoiceDownloader } from "./InvoiceDownloader";
import { Page } from "puppeteer";

export class EmitInvoice extends InvoiceDownloader {
  constructor(page: Page) {
    super(page);
  }

  protected getActionMessage(): string {
    return "Emitindo Nota Fiscal";
  }

  protected async download(): Promise<string> {
    await this.page.locator("#btnProsseguir").click();
    await this.page.locator("#btnDownloadDANFSE").click();
    return await this.waitForDownload();
  }
}
