import fs from "fs";
import path from "path";
import { Page } from "puppeteer";

export class DownloadLastInvoice {
  private downloadPath: string;

  constructor(private page: Page) {
    this.downloadPath = path.resolve(__dirname, "..", "..", "downloads");
    if (!fs.existsSync(this.downloadPath)) {
      fs.mkdirSync(this.downloadPath);
    }
  }

  public async init() {
    const client = await this.page.createCDPSession();
    await client.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: this.downloadPath,
    });
  }

  public async execute() {
    await this.init();

    console.log("\nBaixando última Nota fiscal");

    return await this.download();
  }

  private async download() {
    await this.page.click("a[href='/EmissorNacional/Notas/Emitidas']");

    await this.page.locator("table tbody > tr .menu-suspenso-tabela a").click();
    await this.page
      .locator("table tbody > tr .list-group-item ::-p-text(Download DANFS-e)")
      .click();

    return await this.waitForDownload();
  }

  private async waitForDownload(): Promise<string> {
    return new Promise((resolve) => {
      const watcher = fs.watch(this.downloadPath, (event, filename) => {
        if (event === "rename" && filename?.endsWith(".pdf")) {
          console.log(`✅ Download concluído: ${filename}`);
          watcher.close();
          resolve(path.join(this.downloadPath, filename));
        }
      });
    });
  }
}
