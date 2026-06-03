export type TransactionType =
  | "revenue"
  | "expense";

export interface Transaction {

  id: string;

  title: string;

  amount: number;

  category: string;

  type: TransactionType;

  source?:
    | "manual"
    | "sms";

  createdAt: string;
}