import readline from "readline";

type Validator = (response: string) => boolean | string;

type QuestionOptions = {
  validation?: Validator;
  defaultValue?: string;
};

export class CliPrompt {
  private rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    if (process.stdin.isTTY) process.stdin.setRawMode(true);
  }

  async ask(question: string, options: QuestionOptions = {}): Promise<string> {
    const answer = await this.questionPromise(question, options.defaultValue);

    if (options.validation) {
      const response = options.validation(answer);
      const isMessage = typeof response === "string";

      if (isMessage || response === false) {
        console.log(isMessage ? response : "Resposta inválida!");
        return await this.ask(question, options);
      }
    }

    return answer;
  }

  close() {
    this.rl.close();
  }

  private questionPromise(
    question: string,
    defaultValue: string = ""
  ): Promise<string> {
    const formatQuestion = `\x1b[1m\x1b[32m${question} \x1b[0m`;

    return new Promise<string>((resolve) => {
      this.rl.question(formatQuestion, (answer) => {
        resolve(answer.trim() === "" ? defaultValue : answer);
      });

      if (defaultValue) {
        this.rl.write(defaultValue);

        // readline.moveCursor(process.stdout, -defaultValue.length, 0);
        // readline.emitKeypressEvents(process.stdin, this.rl);

        // this.rl.addListener("keypress", (str, key) => {
        //   if (key.name !== "enter") {
        //     readline.clearLine(process.stdout, 1);
        //   } else {
        //     this.rl.removeAllListeners();
        //   }
        // });
      }
    });
  }
}
