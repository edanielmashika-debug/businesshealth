export type TransactionType = 
| "income"
| "expense";

export type PaymentMethod =
| "cash"
| "mpesa"
| "airtel money"
| "yas"
| "halopesa"

export interface Transaction{
    id: string;
    type: TransactionType;
    amount: number,
    category: string,
    paymentMethod: PaymentMethod;
    note?: string;
    createdAt: string;
}