import { CliPrompt } from "../../infrastructure/adapters/CliPrompt";
import { validateApproval } from "../../shared/utils/validations/approval";

export class InvoiceReviewer {
  constructor(private resume: Record<string, string>[]) {}

  private display(data: Record<string, string>[]) {
    data.forEach((section) => {
      Object.entries(section).forEach(([key, value]) => {
        console.log(`  \x1b[1m\x1b[36m${key}:\x1b[0m ${value}`);
      });
      console.log("");
    });
  }

  public async askApproval(): Promise<boolean> {
    this.display(this.resume);

    const prompt = new CliPrompt();
    const answer = await prompt.ask("Deseja emitir esta Nota Fiscal? (s/n)", {
      validation: validateApproval,
    });
    prompt.close();

    return ["y", "yes", "s", "sim"].includes(answer.toLowerCase());
  }
}
