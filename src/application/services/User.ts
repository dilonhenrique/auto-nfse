import { config } from "dotenv";
import { UserType } from "../../shared/types/types";

export class User implements UserType {
  public readonly name: string;
  public readonly cnpj: string;
  public readonly password: string;

  constructor() {
    const { parsed } = config();

    const name = parsed?.NAME;
    const cnpj = parsed?.CNPJ;
    const password = parsed?.PASS;

    if (!name || !cnpj || !password) throw new Error("No User found in .env");

    this.name = name;
    this.cnpj = cnpj;
    this.password = password;
  }
}
