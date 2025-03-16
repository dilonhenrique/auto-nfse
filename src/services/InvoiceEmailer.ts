import { EmailClient } from "../clients/EmailClient";
import { InvoiceData } from "../types/types";
import { createDescription } from "../utils/createDescription";
import { createSubject } from "../utils/createSubject";
import { User } from "./User";

type InvoiceDataWithUrl = InvoiceData & {
  url: string;
};

type Props = {
  to: string;
  user: User;
  invoice: InvoiceDataWithUrl;
};

export class InvoiceEmailer {
  private emailClient: EmailClient;

  constructor() {
    this.emailClient = new EmailClient();
  }

  async sendNf(props: Props): Promise<boolean> {
    const body = createDescription(props.invoice);
    const subject = createSubject(props.user, props.invoice);
    const filename = `${subject}.pdf`;

    return await this.emailClient.sendEmail({
      to: props.to,
      body,
      subject,
      attachments: [
        {
          filename,
          path: props.invoice.url,
        },
      ],
    });
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
