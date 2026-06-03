
"use client";

import { useState } from "react";

import DashboardLayout from "../../components/dashboard-layout";

import {
  Camera,
  Mail,
  Lock,
  LogOut,
  Trash2,
  User,
  Building2,
} from "lucide-react";

export default function ProfilePage() {

  const [businessName, setBusinessName] =
    useState("Mashika Store");

  const [email, setEmail] =
    useState("business@email.com");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  function handleImageChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    const file =
      e.target.files?.[0];

    if (!file) return;

    const imageUrl =
      URL.createObjectURL(file);

    setImagePreview(imageUrl);
  }

  async function handleSaveProfile() {

    // TODO:
    // connect to supabase later

    alert("Profile updated");
  }

  async function handlePasswordChange() {

    if (
      !password ||
      !confirmPassword
    ) {
      alert("Fill all fields");
      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      alert(
        "Passwords do not match"
      );

      return;
    }

    // TODO:
    // supabase password update

    alert("Password updated");

    setPassword("");
    setConfirmPassword("");
  }

  async function handleLogout() {

    // TODO:
    // await supabase.auth.signOut()

    alert("Logged out");
  }

  async function handleDeleteAccount() {

    const confirmed =
      confirm(
        "Are you sure you want to delete your account?"
      );

    if (!confirmed) return;

    // TODO:
    // delete account logic

    alert("Account deleted");
  }

  return (

    <DashboardLayout>

      <div className="space-y-8">

        {/* HEADER */}

        <div>

          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Profile
          </h1>

          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Manage your business account
          </p>

        </div>

        {/* PROFILE CARD */}

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-8 shadow-sm">

          <div className="flex flex-col items-center text-center">

            <div className="relative">

              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 bg-gray-100 dark:bg-slate-800 flex items-center justify-center">

                {imagePreview ? (

                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />

                ) : (

                  <Building2
                    size={50}
                    className="text-gray-400"
                  />

                )}

              </div>

              <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full cursor-pointer shadow-lg transition">

                <Camera size={18} />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

              </label>

            </div>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-5">
              {businessName}
            </h2>

            <p className="text-gray-500 dark:text-slate-400 mt-1">
              {email}
            </p>

          </div>

        </div>

        {/* BUSINESS INFO */}

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm">

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Business Information
            </h2>

            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Update your account details
            </p>

          </div>

          <div className="space-y-5">

            {/* BUSINESS NAME */}

            <div>

              <label className="text-sm font-medium text-gray-600 dark:text-slate-300 mb-2 block">
                Business Name
              </label>

              <div className="relative">

                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={businessName}
                  onChange={(e) =>
                    setBusinessName(
                      e.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-12 py-4 outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white"
                  placeholder="Business Name"
                />

              </div>

            </div>

            {/* EMAIL */}

            <div>

              <label className="text-sm font-medium text-gray-600 dark:text-slate-300 mb-2 block">
                Email Address
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-12 py-4 outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white"
                  placeholder="Email Address"
                />

              </div>

            </div>

            <button
              onClick={
                handleSaveProfile
              }
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl py-4 font-semibold shadow-lg hover:scale-[1.01] transition"
            >
              Save Changes
            </button>

          </div>

        </div>

        {/* PASSWORD */}

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm">

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Security
            </h2>

            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Change your password
            </p>

          </div>

          <div className="space-y-5">

            <div className="relative">

              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                className="w-full rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-12 py-4 outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white"
                placeholder="New Password"
              />

            </div>

            <div className="relative">

              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                className="w-full rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-12 py-4 outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white"
                placeholder="Confirm Password"
              />

            </div>

            <button
              onClick={
                handlePasswordChange
              }
              className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl py-4 font-semibold shadow-lg hover:scale-[1.01] transition"
            >
              Update Password
            </button>

          </div>

        </div>

        {/* ACTIONS */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* LOGOUT */}

          <button
            onClick={handleLogout}
            className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 flex items-center justify-center gap-3 hover:shadow-md transition"
          >

            <LogOut className="text-orange-500" />

            <span className="font-semibold text-gray-800 dark:text-white">
              Logout
            </span>

          </button>

          {/* DELETE */}

          <button
            onClick={
              handleDeleteAccount
            }
            className="bg-red-500 hover:bg-red-600 rounded-3xl p-6 flex items-center justify-center gap-3 text-white transition shadow-lg"
          >

            <Trash2 />

            <span className="font-semibold">
              Delete Account
            </span>

          </button>

        </div>

      </div>

    </DashboardLayout>
  );
}

