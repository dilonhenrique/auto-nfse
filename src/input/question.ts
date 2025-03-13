import { questionPromise } from "./questionPromise";

type QuestionOptions = { validation?: Validator; defaultValue?: string };
type Validator = (response: string) => boolean | string;

export async function askQuestion(
  question: string,
  options: QuestionOptions = {}
): Promise<string> {
  const answer = await questionPromise(question, options.defaultValue);

  if (options.validation) {
    const response = options.validation(answer);
    const isMessage = typeof response === "string";

    if (isMessage || response === false) {
      console.log(isMessage ? response : "Resposta inválida!");

      return await askQuestion(question, options);
    }
  }

  return answer;
}
