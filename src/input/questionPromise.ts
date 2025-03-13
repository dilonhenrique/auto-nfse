import readline from "readline";

export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

if (process.stdin.isTTY) process.stdin.setRawMode(true);

export const questionPromise = (
  question: string,
  defaultValue: string = ""
) => {
  const formatQuestion = `\x1b[1m\x1b[32m${question} \x1b[0m`;
  return new Promise<string>((resolve) => {
    rl.question(formatQuestion, (answer) => {
      if (answer.trim() === "") {
        return resolve(defaultValue);
      }

      resolve(answer);
    });

    if (defaultValue) {
      rl.write(defaultValue);
      readline.moveCursor(process.stdout, -defaultValue.length, 0);

      readline.emitKeypressEvents(process.stdin, rl);

      rl.addListener("keypress", (str, key) => {
        if (key.name !== "enter") {
          readline.clearLine(process.stdout, 1);
        } else {
          rl.removeAllListeners();
        }
      });
    }
  });
};
