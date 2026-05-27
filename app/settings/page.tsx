"use client";

import DashboardLayout from "@/components/dashboard-layout";

import { supabase } from "@/lib/supabase";

import { useRouter } from "next/navigation";
import { deleteAccount } from "@/lib/delete-account";
import { useTheme } from "next-themes";
import { exportTransactions } from "@/lib/export-transactions";

import { useTransactionStore } from "@/store/transaction-store";

export default function SettingsPage() {
  const router = useRouter();

  const {
    theme,
    setTheme,
  } = useTheme();

  const transactions =
    useTransactionStore(
      (state) =>
        state.transactions
    );

  async function handleLogout() {
    await supabase.auth.signOut();

    router.push("/login");
  }

  async function handleDeleteAccount() {
    const confirmed =
      confirm(
        "Delete your account permanently?"
      );

    if (!confirmed) return;

    await deleteAccount();

    router.push("/login");
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            Settings
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your app preferences
          </p>
        </div>

        <div className="border rounded-2xl bg-white p-5 space-y-4">
          <button
            className="w-full border rounded-xl py-4 touch-manipulation"
          >
            Change Currency
          </button>

          <button
            onClick={() =>
              exportTransactions(
                transactions
              )
            }
            className="w-full border rounded-xl py-4 touch-manipulation"
          >
            Export Reports
          </button>

          <button
            onClick={() =>
              setTheme(
                theme === "dark"
                  ? "light"
                  : "dark"
              )
            }
            className="w-full border rounded-xl py-4 touch-manipulation"
          >
            Toggle Dark Mode
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white rounded-xl py-4 touch-manipulation"
          >
            Logout
          </button>

          <button
            onClick={
              handleDeleteAccount
            }
            className="w-full bg-black text-white rounded-xl py-4 touch-manipulation"
          >
            Delete Account
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}