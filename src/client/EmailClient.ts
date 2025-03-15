import nodemailer from "nodemailer";

export class EmailClient {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    body: string,
    attachments?: any[]
  ): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: `"NF Service" <${process.env.EMAIL_FROM}>`,
        to,
        subject,
        html: body,
        attachments,
      });

      console.log(`📧 Email enviado para ${to}`);
      return true;
    } catch (error) {
      console.error("❌ Erro ao enviar e-mail:", error);
      return false;
    }
  }
}
