import { config } from "dotenv";

const { parsed } = config();

const name = parsed?.NAME;
const cnpj = parsed?.CNPJ;
const password = parsed?.PASS;

export type User = {
  name: string;
  cnpj: string;
  password: string;
};

export function getUser(): User {
  if (!name || !cnpj || !password) return process.exit(1);

  return {
    name,
    cnpj,
    password,
  };
}
