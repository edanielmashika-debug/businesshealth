"use client"
import { useTransactionStore } from "@/store/transaction-store";

export function useDashboardStats() {
    const transactions = 
     useTransactionStore(
        (state)=> state.transactions
    );

    const income = transactions
    .filter(
        (transactions)=>
            transactions.type === "income"
    )
    .reduce(
        (acc, transaction)=>
            acc+ transaction.amount,
        0
    );


    const expense = transactions
    .filter(
        (transactions)=>
            transactions.type === "expense"
    )
    .reduce(
        (acc, transaction)=>
            acc+transaction.amount,
        0
    );


    const profit = income - expense;
    return{
        income, 
        expense,
        profit,
    };
}