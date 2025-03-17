import { config } from "dotenv";
import { UserType } from "../../shared/types/types";

export class User implements UserType {
  public readonly name: string;
  public readonly cnpj: string;
  public readonly password: string;

  constructor() {
    const { parsed } = config();

    const name = parsed?.USER_NAME;
    const cnpj = parsed?.USER_CNPJ;
    const password = parsed?.USER_PASS;

    if (!name || !cnpj || !password) throw new Error("No User found in .env");

    this.name = name;
    this.cnpj = cnpj;
    this.password = password;
  }
}
