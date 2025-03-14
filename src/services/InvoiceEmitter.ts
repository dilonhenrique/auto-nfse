import puppeteer, { Browser, Page } from "puppeteer";
import { User } from "./User";
import { GenerateInvoice } from "../automation/GenerateInvoice";
import { InvoiceData } from "../types/types";

export class InvoiceEmitter {
  private user: User;
  private browser?: Browser;
  private page?: Page;

  constructor(user: User) {
    this.user = user;
  }

  public async init() {
    this.browser = await puppeteer.launch({ headless: true });
    this.page = await this.browser.newPage();

    return this;
  }

  public async generate(data: InvoiceData) {
    if (!this.page) throw new Error("O navegador não foi inicializado.");

    const process = new GenerateInvoice(this.page, this.user, data);
    return await process.execute();
  }

  public async close() {
    await this.browser?.close();
  }
}
