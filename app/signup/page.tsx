"use client";

import { useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { supabase } from "../../lib/supabase";

export default function SignUpPage() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSignup(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setLoading(true);

    const {
      data,
      error,
    } =
      await supabase.auth.signUp({
        email,
        password,
      });

    setLoading(false);

    if (error) {

      alert(error.message);

      return;
    }

    /*
      CREATE PROFILE
    */

    if (data.user) {

      await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          email: data.user.email,
        });
    }

    alert(
      "Account created successfully!"
    );

    router.push(
      "/onboarding"
    );
  }

  return (

    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">

        {/* TOP SECTION */}

        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white">

          <h1 className="text-4xl font-bold">
            Create Account
          </h1>

          <p className="mt-2 text-white/80">
            Start managing your business smarter
          </p>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSignup}
          className="p-8 space-y-5"
        >

          {/* EMAIL */}

          <div>

            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              placeholder="you@example.com"
              className="w-full mt-2 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-4 text-black dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* PASSWORD */}

          <div>

            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder="••••••••"
              className="w-full mt-2 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-4 text-black dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl py-4 font-semibold hover:scale-[1.01] transition"
          >

            {
              loading
                ? "Creating Account..."
                : "Create Account"
            }

          </button>

          {/* LOGIN LINK */}

          <div className="text-center pt-2">

            <p className="text-sm text-gray-500 dark:text-slate-400">

              Already have an account?{" "}

              <Link
                href="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign In
              </Link>

            </p>

          </div>

        </form>

      </div>

    </main>
  );
}