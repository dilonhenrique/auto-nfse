import fs from "fs";
import path from "path";
import { Page } from "puppeteer";

export abstract class InvoiceDownloader {
  protected downloadPath: string;

  constructor(protected page: Page) {
    this.downloadPath = path.resolve(__dirname, "..", "..", "..", "downloads");
    if (!fs.existsSync(this.downloadPath)) {
      fs.mkdirSync(this.downloadPath);
    }
  }

  public async execute() {
    await this.init();
    console.log(`\n${this.getActionMessage()}`);
    return await this.download();
  }

  private async init() {
    const client = await this.page.createCDPSession();
    await client.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: this.downloadPath,
    });
  }

  protected abstract getActionMessage(): string;
  protected abstract download(): Promise<string>;

  protected async waitForDownload(): Promise<string> {
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
