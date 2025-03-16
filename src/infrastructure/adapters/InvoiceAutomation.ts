import puppeteer, { Browser, Page } from "puppeteer";

export class InvoiceAutomation {
  private browser?: Browser;
  private page?: Page;

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

  public getPage(): Page {
    if (!this.page) throw new Error("O navegador não foi inicializado.");
    return this.page;
  }

  public async close() {
    await this.browser?.close();
  }
}
