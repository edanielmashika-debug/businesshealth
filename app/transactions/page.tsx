import DashboardLayout from "@/components/dashboard-layout";
import AddTransactionForm from "@/components/add-transaction-form";
import TransactionList from "@/components/transaction-list";
import SMSImport from "@/components/sms-import";

export default function TransactionsPage() {
    return (
        <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">
        Transactions
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AddTransactionForm />

        <TransactionList />
        <SMSImport/>
      </div>
    </DashboardLayout>
    );
} 