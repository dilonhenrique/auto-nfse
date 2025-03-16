import fs from "fs";
import path from "path";
import { Page } from "puppeteer";

export class EmitInvoice {
  private downloadPath: string;

  constructor(private page: Page) {
    this.downloadPath = path.resolve(__dirname, "..", "..", "downloads");
    if (!fs.existsSync(this.downloadPath)) {
      fs.mkdirSync(this.downloadPath);
    }
  }

  public async execute() {
    await this.init();

    console.log("\nEmitindo Nota fiscal");

    await this.emit();
    return await this.download();
  }

  private async init() {
    const client = await this.page.createCDPSession();
    await client.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: this.downloadPath,
    });
  }

  private async emit() {
    await this.page.locator("#btnProsseguir").click();
  }

  private async download() {
    await this.page.locator("#btnDownloadDANFSE").click();

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
