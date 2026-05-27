export type DebtStatus = 
| "pending"
| "paid";

export interface Debt{
    id: string;

    name: string;
    amount: number;
    status: DebtStatus;
    createdAt: string;
}