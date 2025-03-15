import { EmailClient } from "../client/EmailClient";

export class InvoiceEmail {
  private emailClient: EmailClient;

  constructor() {
    this.emailClient = new EmailClient();
  }

  async sendNf(
    to: string,
    invoice: Record<string, string>[]
  ): Promise<boolean> {
    const emailBody = this.formatInvoiceEmail(invoice);
    const subject = "📄 Sua Nota Fiscal Eletrônica";

    return await this.emailClient.sendEmail(to, subject, emailBody);
  }

  private formatInvoiceEmail(nfData: Record<string, string>[]): string {
    let body = `<h2>📄 Detalhes da Nota Fiscal</h2><ul>`;

    nfData.forEach((section) => {
      Object.entries(section).forEach(([key, value]) => {
        body += `<li><strong>${key}:</strong> ${value}</li>`;
      });
    });

    body += `</ul><p>Obrigado por utilizar nossos serviços!</p>`;

    return body;
  }
}
