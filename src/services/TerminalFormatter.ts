import { CliPrompt } from "../cli/CliPrompt";
import { validateApproval } from "../utils/validation/approval";

export class InvoiceDataFormatter {
  static async display(data: Record<string, string>[]): Promise<boolean> {
    data.forEach((section) => {
      Object.entries(section).forEach(([key, value]) => {
        console.log(`  \x1b[1m\x1b[36m${key}:\x1b[0m ${value}`);
      });
      console.log(""); // Espaço entre seções
    });

    return await this.askApproval();
  }

  private static async askApproval(): Promise<boolean> {
    const prompt = new CliPrompt();
    const answer = await prompt.ask("Deseja emitir esta Nota Fiscal? (s/n)", {
      validation: validateApproval,
    });
    prompt.close();

    return ["y", "yes", "s", "sim"].includes(answer.toLowerCase());
  }
}
