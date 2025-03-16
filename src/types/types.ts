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

export type GenerateInvoiceData = {
  people: GenerateInvoicePeopleData;
  service: GenerateInvoiceServiceData;
  value: string;
};

export type GenerateInvoicePeopleData = {
  reference: string;
  cnpj: string;
};

export type GenerateInvoiceServiceData = {
  city: string;
  tribNac: string;
  description: string;
  nbs: string;
};
