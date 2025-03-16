import { InvoiceDownloader } from "./InvoiceDownloader";
import { Page } from "puppeteer";

export class DownloadLastInvoice extends InvoiceDownloader {
  constructor(page: Page) {
    super(page);
  }

  protected getActionMessage(): string {
    return "Baixando última Nota Fiscal";
  }

  protected async download(): Promise<string> {
    await this.page.click("a[href='/EmissorNacional/Notas/Emitidas']");
    await this.page.locator("table tbody > tr .menu-suspenso-tabela a").click();
    await this.page
      .locator("table tbody > tr .list-group-item ::-p-text(Download DANFS-e)")
      .click();

    return await this.waitForDownload();
  }
}
