import { Page } from "puppeteer";

export class EmitInvoice {
  constructor(private page: Page) {}

  public async execute() {
    console.log("\nEmitindo Nota fiscal");

    await this.emit();
    return await this.download();
  }

  private async emit() {
    await this.page.click("#btnProsseguir");
    await this.page.waitForNavigation();
  }

  private async download() {
    // TODO
    return true;
  }
}
