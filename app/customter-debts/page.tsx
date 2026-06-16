"use client";

import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "../../components/dashboard-layout";

import {
    Plus,
    X,
    Trash2,
    Wallet,
    Users,
    AlertTriangle,
    CreditCard,
    Sparkles,
} from "lucide-react";

import {
    useCustomerDebtStore,
} from "../../store/customer-debt-store";

export default function CustomerDebtsPage() {
    

    const {
        debts,
        fetchDebts,
        addDebt,
        deleteDebt,
        recordPayment,
    } =
        useCustomerDebtStore();

    const [showAddModal, setShowAddModal] =
        useState(false);

    const [showPaymentModal, setShowPaymentModal] =
        useState(false);

    const [selectedDebtId, setSelectedDebtId] =
        useState("");

    const [paymentAmount, setPaymentAmount] =
        useState("");

    const [customerName, setCustomerName] =
        useState("");

    const [phone, setPhone] =
        useState("");

    const [amount, setAmount] =
        useState("");

    const [dueDate, setDueDate] =
        useState("");

    const [notes, setNotes] =
        useState("");

    useEffect(() => {

        fetchDebts();


    }, []);

    const outstandingDebt =
        useMemo(() => {


            return debts.reduce(
                (sum, debt) =>
                    sum +
                    (debt.amount -
                        debt.paid_amount),
                0
            );

        }, [debts]);


    const unpaidCustomers =
        debts.filter(
            (debt) =>
                debt.status !== "paid"
        ).length;

    const collectedThisMonth =
        useMemo(() => {


            const now =
                new Date();

            return debts
                .filter((debt) => {

                    const created =
                        new Date(
                            debt.created_at
                        );

                    return (
                        created.getMonth() ===
                        now.getMonth() &&
                        created.getFullYear() ===
                        now.getFullYear()
                    );

                })
                .reduce(
                    (
                        sum,
                        debt
                    ) =>
                        sum +
                        debt.paid_amount,
                    0
                );

        }, [debts]);


    async function handleAddDebt(
        e: React.FormEvent
    ) {


        e.preventDefault();

        if (
            !customerName ||
            !amount
        )
            return;

        await addDebt({
            id: crypto.randomUUID(),

            customer_name:
                customerName,

            phone,

            amount:
                Number(amount),

            paid_amount: 0,

            status:
                "unpaid",

            due_date:
                dueDate,

            notes,

            created_at:
                new Date().toISOString(),
        });

        setCustomerName("");
        setPhone("");
        setAmount("");
        setDueDate("");
        setNotes("");

        setShowAddModal(false);


    }

    async function handlePayment() {

        if (
            !selectedDebtId ||
            !paymentAmount
        )
            return;

        await recordPayment(
            selectedDebtId,
            Number(
                paymentAmount
            )
        );

        setPaymentAmount("");

        setSelectedDebtId("");

        setShowPaymentModal(
            false
        );


    }

    const selectedDebt =
        debts.find(
            (debt) =>
                debt.id ===
                selectedDebtId
        );



return (
    <DashboardLayout>

        <div className="space-y-8 pb-10">

            {/* HERO */}

            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 via-cyan-500 to-indigo-700 p-8 lg:p-10 text-white shadow-2xl">

                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_35%)]" />

                <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                    <div>

                        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium">

                            <Wallet className="w-4 h-4" />

                            Customer Debt Tracker

                        </div>

                        <h1 className="text-4xl lg:text-5xl font-black mt-5 leading-tight">

                            Customer
                            <br />
                            Debts

                        </h1>

                        <p className="text-blue-100 mt-4 max-w-2xl text-lg">

                            Track money owed by customers,
                            monitor repayments and manage
                            overdue balances.

                        </p>

                    </div>

                    <button
                        onClick={() =>
                            setShowAddModal(true)
                        }
                        className="w-20 h-20 rounded-[2rem] bg-white text-blue-600 shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300"
                    >

                        <Plus className="w-10 h-10" />

                    </button>

                </div>

            </div>

            {/* ANALYTICS CARDS */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* OUTSTANDING */}

                <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-200 dark:border-slate-800 p-6 shadow-sm">

                    <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/10 rounded-full blur-3xl" />

                    <div className="relative z-10">

                        <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                            Outstanding Debt
                        </p>

                        <h2 className="text-4xl font-black text-red-500 mt-3">

                            TZS{" "}

                            {outstandingDebt.toLocaleString()}

                        </h2>

                    </div>

                </div>

                {/* CUSTOMERS */}

                <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-200 dark:border-slate-800 p-6 shadow-sm">

                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />

                    <div className="relative z-10">

                        <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                            Unpaid Customers
                        </p>

                        <h2 className="text-4xl font-black text-blue-500 mt-3">

                            {unpaidCustomers}

                        </h2>

                    </div>

                </div>

                {/* COLLECTED */}

                <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-200 dark:border-slate-800 p-6 shadow-sm">

                    <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/10 rounded-full blur-3xl" />

                    <div className="relative z-10">

                        <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                            Collected This Month
                        </p>

                        <h2 className="text-4xl font-black text-green-500 mt-3">

                            TZS{" "}

                            {collectedThisMonth.toLocaleString()}

                        </h2>

                    </div>

                </div>

            </div>
            {/* ADD DEBT MODAL */}

            {showAddModal && (

                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">

                    <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden">

                        <div className="h-2 bg-gradient-to-r from-blue-600 to-cyan-500" />

                        <div className="p-8">

                            <div className="flex items-center justify-between mb-8">

                                <div>

                                    <h2 className="text-3xl font-black text-gray-800 dark:text-white">
                                        Add Customer Debt
                                    </h2>

                                    <p className="text-gray-500 dark:text-slate-400 mt-2">
                                        Record money owed by a customer
                                    </p>

                                </div>

                                <button
                                    onClick={() =>
                                        setShowAddModal(false)
                                    }
                                    className="w-11 h-11 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center"
                                >
                                    <X />
                                </button>

                            </div>

                            <form
                                onSubmit={handleAddDebt}
                                className="space-y-5"
                            >
                                <input
                                    value={customerName}
                                    onChange={(e) =>
                                        setCustomerName(e.target.value)
                                    }
                                    placeholder="Customer Name"
                                    className="w-full rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-5 py-4 outline-none"
                                />

                                <input
                                    value={phone}
                                    onChange={(e) =>
                                        setPhone(e.target.value)
                                    }
                                    placeholder="Phone Number"
                                    className="w-full rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-5 py-4 outline-none"
                                />

                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) =>
                                        setAmount(e.target.value)
                                    }
                                    placeholder="Amount Owed"
                                    className="w-full rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-5 py-4 outline-none"
                                />

                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) =>
                                        setDueDate(e.target.value)
                                    }
                                    className="w-full rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-5 py-4 outline-none"
                                />

                                <textarea
                                    value={notes}
                                    onChange={(e) =>
                                        setNotes(e.target.value)
                                    }
                                    placeholder="Notes"
                                    rows={4}
                                    className="w-full rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-5 py-4 outline-none"
                                />

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl py-4 font-bold"
                                >
                                    Save Debt
                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            )}

            {/* PAYMENT MODAL */}

            {showPaymentModal && (

                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">

                    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden">

                        <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500" />

                        <div className="p-8">

                            <div className="flex items-center justify-between mb-6">

                                <div>

                                    <h2 className="text-2xl font-black text-gray-800 dark:text-white">
                                        Record Payment
                                    </h2>

                                    <p className="text-gray-500 dark:text-slate-400 mt-2">
                                        Enter amount received from customer
                                    </p>

                                </div>

                                <button
                                    onClick={() => {
                                        setShowPaymentModal(false);
                                        setPaymentAmount("");
                                    }}
                                    className="w-11 h-11 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center"
                                >
                                    <X />
                                </button>

                            </div>

                            <form
                                onSubmit={handlePayment}
                                className="space-y-5"
                            >

                                <input
                                    type="number"
                                    value={paymentAmount}
                                    onChange={(e) =>
                                        setPaymentAmount(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Amount Received"
                                    className="w-full rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-5 py-4 outline-none text-black dark:text-white"
                                />

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl py-4 font-bold"
                                >
                                    Save Payment
                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            )}


            {/* DEBTS LIST */}

            <div className="grid gap-5">

                {debts.map((debt) => {

                    const remaining =
                        debt.amount -
                        debt.paid_amount;

                    const overdue =
                        debt.status !== "paid" &&
                        debt.due_date &&
                        new Date(
                            debt.due_date
                        ) < new Date();

                    return (

                        <div
                            key={debt.id}
                            className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-200 dark:border-slate-800 p-6 shadow-sm"
                        >

                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                                <div>

                                    <div className="flex items-center gap-3 flex-wrap">

                                        <h2 className="text-2xl font-black text-gray-800 dark:text-white">

                                            {debt.customer_name}

                                        </h2>

                                        {overdue && (

                                            <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">

                                                <AlertTriangle className="w-4 h-4" />

                                                Overdue

                                            </span>

                                        )}

                                        {debt.status ===
                                            "paid" && (

                                                <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-semibold">

                                                    Paid

                                                </span>

                                            )}

                                    </div>

                                    <p className="text-gray-500 dark:text-slate-400 mt-3">

                                        {debt.phone}

                                    </p>

                                    <div className="grid md:grid-cols-3 gap-4 mt-6">

                                        <div>

                                            <p className="text-xs text-gray-500">
                                                Debt
                                            </p>

                                            <h3 className="font-bold text-red-500">

                                                TZS{" "}

                                                {debt.amount.toLocaleString()}

                                            </h3>

                                        </div>

                                        <div>

                                            <p className="text-xs text-gray-500">
                                                Paid
                                            </p>

                                            <h3 className="font-bold text-green-500">

                                                TZS{" "}

                                                {debt.paid_amount.toLocaleString()}

                                            </h3>

                                        </div>

                                        <div>

                                            <p className="text-xs text-gray-500">
                                                Remaining
                                            </p>

                                            <h3 className="font-bold text-blue-500">

                                                TZS{" "}

                                                {remaining.toLocaleString()}

                                            </h3>

                                        </div>

                                    </div>

                                    {debt.due_date && (

                                        <p className="text-sm text-gray-500 mt-4">

                                            Due:
                                            {" "}
                                            {new Date(
                                                debt.due_date
                                            ).toLocaleDateString()}

                                        </p>

                                    )}

                                </div>

                                <div className="flex flex-col gap-3">

                                    {debt.status !==
                                        "paid" && (

                                            <button
                                                onClick={() => {

                                                    setSelectedDebtId(
                                                        debt.id
                                                    );

                                                    setShowPaymentModal(
                                                        true
                                                    );

                                                }}
                                                className="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-2xl font-semibold flex items-center gap-2"
                                            >

                                                <CreditCard className="w-4 h-4" />

                                                Record Payment

                                            </button>

                                        )}

                                    <button
                                        onClick={() =>
                                            deleteDebt(
                                                debt.id
                                            )
                                        }
                                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-2xl font-semibold flex items-center gap-2"
                                    >

                                        <Trash2 className="w-4 h-4" />

                                        Delete

                                    </button>

                                </div>

                            </div>

                        </div>

                    );

                })}

                {debts.length === 0 && (

                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-dashed border-gray-300 dark:border-slate-700 p-14 text-center">

                        <div className="text-6xl mb-5">
                            💳
                        </div>

                        <h2 className="text-3xl font-black text-gray-800 dark:text-white">

                            No customer debts

                        </h2>

                        <p className="text-gray-500 dark:text-slate-400 mt-3">

                            Start tracking money owed by customers.

                        </p>

                    </div>

                )}

            </div>

        </div>

    </DashboardLayout>

);
}