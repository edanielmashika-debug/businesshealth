"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "../../lib/supabase";

export default function OnboardingPage() {

  const router = useRouter();

  const [businessName, setBusinessName] =
    useState("");

  const [businessType, setBusinessType] =
    useState("");

  const [businessPhone, setBusinessPhone] =
    useState("");

  const [businessLocation, setBusinessLocation] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } =
      await supabase
        .from("profiles")
        .update({
          business_name:
            businessName,

          business_type:
            businessType,

          business_phone:
            businessPhone,

          business_location:
            businessLocation,

          onboarding_completed:
            true,
        })
        .eq("id", user.id);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-6">

      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-slate-800">

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Welcome 👋
          </h1>

          <p className="text-gray-500 dark:text-slate-400 mt-2">
            Setup your business profile
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Business Name
            </label>

            <input
              type="text"
              value={businessName}
              onChange={(e) =>
                setBusinessName(
                  e.target.value
                )
              }
              placeholder="Emmanuel Store"
              className="w-full mt-2 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-4 text-black dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Business Type
            </label>

            <select
              value={businessType}
              onChange={(e) =>
                setBusinessType(
                  e.target.value
                )
              }
              className="w-full mt-2 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-4 text-black dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                Select Business Type
              </option>

              <option value="Retail Shop">
                Retail Shop
              </option>

              <option value="Restaurant">
                Restaurant
              </option>

              <option value="Salon">
                Salon
              </option>

              <option value="Pharmacy">
                Pharmacy
              </option>

              <option value="Electronics">
                Electronics
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Phone Number
            </label>

            <input
              type="text"
              value={businessPhone}
              onChange={(e) =>
                setBusinessPhone(
                  e.target.value
                )
              }
              placeholder="+255..."
              className="w-full mt-2 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-4 text-black dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Location
            </label>

            <input
              type="text"
              value={businessLocation}
              onChange={(e) =>
                setBusinessLocation(
                  e.target.value
                )
              }
              placeholder="Dar es Salaam"
              className="w-full mt-2 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-4 text-black dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl py-4 font-semibold hover:scale-[1.01] transition"
          >
            {
              loading
                ? "Saving..."
                : "Continue"
            }
          </button>

        </form>
      </div>
    </div>
  );
}