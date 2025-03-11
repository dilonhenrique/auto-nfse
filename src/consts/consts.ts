import { config } from "dotenv";

const { parsed } = config();

export const CNPJ = parsed?.CNPJ;
export const PASS = parsed?.PASS;
