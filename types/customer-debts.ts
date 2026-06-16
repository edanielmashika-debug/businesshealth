export interface CustomerDebt {
id: string;

customer_name: string;

phone?: string;

amount: number;

paid_amount: number;

status:
| "unpaid"
| "partial"
| "paid";

due_date?: string;

notes?: string;

created_at: string;
}
