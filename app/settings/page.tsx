"use client";

import DashboardLayout from "@/components/dashboard-layout";

import { supabase } from "@/lib/supabase";

import { useRouter } from "next/navigation";

import { deleteAccount } from "@/lib/delete-account";

import { useTheme } from "next-themes";

import { exportTransactions } from "@/lib/export-transactions";

import { useTransactionStore } from "@/store/transaction-store";
import { useLanguageStore} from "@/store/language-store";


import {
  DollarSign,
  Download,
  LogOut,
  Trash2,
  ShieldCheck,
  Cloud,
  Smartphone,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function SettingsPage() {
  const t = useTranslation();
  const router = useRouter();


const language =
  useLanguageStore(
    (state) => state.language
  );

const setLanguage =
  useLanguageStore(
    (state) => state.setLanguage
  );

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

    router.push(
      "/login"
    );
  }

  async function handleDeleteAccount() {

    const confirmed =
      confirm(
        "Delete your account permanently?"
      );

    if (!confirmed)
      return;

    await deleteAccount();

    router.push(
      "/login"
    );
  }

  return (
    <DashboardLayout>

      <div className="space-y-8">

        {/* HEADER */}

        <div>

          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                {t.settingsPage.settings}
          </h1>

          <p className="text-gray-500 dark:text-slate-400 mt-1">
             {t.settingsPage.settingsDescription}
          </p>
        </div>

        {/* SETTINGS CARD */}

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">

          {/* SECTION HEADER */}

          <div className="p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-900">

            <h2 className="text-2xl font-bold text-black dark:text-white">
              {t.settingsPage.appSettings}
            </h2>

            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              {t.settingsPage.appSettingsDescription}
            </p>
          </div>

          {/* SETTINGS OPTIONS */}

          <div className="p-6 space-y-4">

            {/* CURRENCY */}

            <button
              className="w-full flex items-center justify-between rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 transition px-5 py-5"
            >

              <div className="flex items-center gap-4">

                <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-2xl">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>

                <div className="text-left">

                  <h3 className="font-semibold text-black dark:text-white">
                    {t.settingsPage.changeCurrency}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                    {t.settingsPage.changeCurrencyDescription}
                  </p>
                </div>
              </div>

              <div className="text-blue-600 font-semibold">
                TZS
              </div>
            </button>

            {/* EXPORT */}

            <button
              onClick={() =>
                exportTransactions(
                  transactions
                )
              }
              className="w-full flex items-center justify-between rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 transition px-5 py-5"
            >

              <div className="flex items-center gap-4">

                <div className="bg-cyan-100 dark:bg-cyan-900/40 p-3 rounded-2xl">
                  <Download className="w-5 h-5 text-cyan-600" />
                </div>

                <div className="text-left">

                  <h3 className="font-semibold text-black dark:text-white">
                    {t.settingsPage.exportReports}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                    {t.settingsPage.exportReportsDescription}
                  </p>
                </div>
              </div>

              <div className="text-blue-600 font-semibold">
                {t.settingsPage.export}
              </div>
            </button>

            {/* DARK MODE */}

            <button
              onClick={() =>
                setTheme(
                  theme === "dark"
                    ? "light"
                    : "dark"
                )
              }
              className="w-full bg-slate-900 dark:bg-white dark:text-black text-white rounded-2xl py-4 font-semibold flex items-center justify-center gap-3 transition"
            >

              {theme === "dark"
                ? t.settingsPage.lightMode
                : t.settingsPage.darkMode}

            </button>

            {/*LANGUAGE SWITCH */}
            <div className="flex gap-3">

              <button
                onClick={() =>
                  setLanguage("en")
                }
                className={`px-4 py-3 rounded-xl ${language === "en"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                  }`}
              >
                English
              </button>

              <button
                onClick={() =>
                  setLanguage("sw")
                }
                className={`px-4 py-3 rounded-xl ${language === "sw"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                  }`}
              >
                Kiswahili
              </button>

            </div>

            {/* LOGOUT */}

            <button
              onClick={
                handleLogout
              }
              className="w-full flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-5 font-semibold transition"
            >
              <LogOut className="w-5 h-5" />

              {t.settingsPage.logout}
            </button>

            {/* DELETE ACCOUNT */}

            <button
              onClick={
                handleDeleteAccount
              }
              className="w-full flex items-center justify-center gap-3 rounded-2xl bg-black dark:bg-red-950 hover:bg-gray-900 text-white py-5 font-semibold transition"
            >
              <Trash2 className="w-5 h-5" />

              {t.settingsPage.deleteAccount}
            </button>
          </div>
        </div>

        {/* ACCOUNT INFO */}

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">

          <h2 className="text-xl font-bold text-black dark:text-white">
            {t.settingsPage.businessSystem}
          </h2>

          <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
            {t.settingsPage.businessSystemDescription}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

            {/* CLOUD */}

            <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 p-4">

              <div className="flex items-center gap-3">

                <Cloud className="w-5 h-5 text-blue-600" />

                <p className="text-sm text-blue-600">
                  {t.settingsPage.cloudSync}
                </p>
              </div>

              <h3 className="text-xl font-bold text-black dark:text-white mt-2">
                {t.settingsPage.active}
              </h3>
            </div>

            {/* SECURITY */}

            <div className="rounded-2xl bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900 p-4">

              <div className="flex items-center gap-3">

                <ShieldCheck className="w-5 h-5 text-green-600" />

                <p className="text-sm text-green-600">
                  {t.settingsPage.security}
                </p>
              </div>

              <h3 className="text-xl font-bold text-black dark:text-white mt-2">
                {t.settingsPage.protected}
              </h3>
            </div>

            {/* MULTI DEVICE */}

            <div className="rounded-2xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-100 dark:border-cyan-900 p-4">

              <div className="flex items-center gap-3">

                <Smartphone className="w-5 h-5 text-cyan-600" />

                <p className="text-sm text-cyan-600">
                  {t.settingsPage.multiDevice}
                </p>
              </div>

              <h3 className="text-xl font-bold text-black dark:text-white mt-2">
                {t.settingsPage.enabled}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}