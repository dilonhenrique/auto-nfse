export interface ReferenceDate {
  string: string;
  date: Date;
}

export interface InvoiceData {
  reference: ReferenceDate;
  value: number;
  pix: string;
  cnpj: string;
  tribNac: string;
  nbs: string;
  city: string;
  email: string;
}
