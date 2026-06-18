"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import DashboardLayout from "../../components/dashboard-layout";

import { supabase } from "../../lib/supabase";

import {
  Camera,
  LogOut,
  Save,
  Building2,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { toast } from "sonner";

export default function ProfilePage() {

  const router =
    useRouter();

  const [loading, setLoading] =
    useState(false);

  const [email, setEmail] =
    useState("");

  const [
    businessName,
    setBusinessName,
  ] = useState("");

  const [logoUrl, setLogoUrl] =
    useState("");

  /* LOAD PROFILE */

  useEffect(() => {

    async function loadProfile() {

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {

        router.push("/login");

        return;
      }

      setEmail(
        user.email || ""
      );

      const { data, error } =
        await supabase
          .from("profiles")
          .select("*")
          .eq(
            "id",
            user.id
          )
          .single();

      /* CREATE EMPTY PROFILE */

      if (
        error ||
        !data
      ) {

        await supabase
          .from("profiles")
          .insert({
            id: user.id,

            business_name: "",

            logo_url: "",
          });

        return;
      }

      setBusinessName(
        data.business_name || ""
      );

      setLogoUrl(
        data.logo_url || ""
      );
    }

    loadProfile();

  }, [router]);

  /* SAVE PROFILE */

  async function handleSave() {

    setLoading(true);

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) return;

    const { error } =
      await supabase
        .from("profiles")
        .update({
          id: user.id,

          business_name:
            businessName,

          logo_url:
            logoUrl,
        });

    if (error) {

      console.log(error);

      toast.error(
        error.message
      );

    } else {

      toast.success(
        "Profile updated successfully"
      );
    }

    setLoading(false);
  }

  /* UPLOAD LOGO */

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    try {

      const file =
        e.target.files?.[0];

      if (!file) return;

      setLoading(true);

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) return;

      const ext =
        file.name
          .split(".")
          .pop();

      const fileName =
        `${user.id}-${Date.now()}.${ext}`;


      const {
        error: uploadError,
      } =
        await supabase.storage
          .from("profiles")
          .upload(
            fileName,
            file,
            {
              upsert: true,
            }
          );

      if (uploadError) {

        console.log(
          uploadError
        );

        toast.error(
          uploadError.message
        );

        setLoading(false);

        return;
      }

      const {
        data: publicUrlData,
      } =
        supabase.storage
          .from("profiles")
          .getPublicUrl(
            fileName
          );

      const publicUrl =
        `${publicUrlData.publicUrl}?t=${Date.now()}`;

      setLogoUrl(
        publicUrl
      );

      await supabase
        .from("profiles")
        .update({
          id: user.id,

          business_name:
            businessName,

          logo_url:
            publicUrl,
        });

      setLoading(false);

    } catch (error) {

      console.log(error);

      setLoading(false);
    }
  }

  /* LOGOUT */

  async function handleLogout() {

    await supabase.auth.signOut();

    router.push("/login");
  }

  return (

    <DashboardLayout>

      <div className="max-w-5xl mx-auto space-y-8 pb-10">

        {/* HERO */}

        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-cyan-500 to-indigo-700 p-8 md:p-10 text-white shadow-2xl">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)] opacity-10" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            {/* LEFT */}

            <div>

              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium">

                <ShieldCheck className="w-4 h-4" />

                Business Profile

              </div>

              <h1 className="text-4xl lg:text-5xl font-black mt-5 leading-tight">

                Manage
                <br />
                Your Account

              </h1>

              <p className="text-blue-100 mt-4 max-w-2xl text-lg">

                Customize your business identity, upload your logo,
                and manage account information.

              </p>

            </div>

            {/* RIGHT */}

            <div className="flex flex-col items-center">

              <div className="relative">

                <div className="w-36 h-36 rounded-[2rem] overflow-hidden bg-white/15 backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center">

                  {logoUrl ? (

                    <img
                      src={logoUrl}
                      alt="Business Logo"
                      className="w-full h-full object-cover"
                    />

                  ) : (

                    <span className="text-white text-5xl font-black">
                      {businessName
                        ?.charAt(0)
                        ?.toUpperCase() || "B"}
                    </span>

                  )}

                </div>

                <label className="absolute -bottom-2 -right-2 w-14 h-14 rounded-2xl bg-white text-blue-700 shadow-xl flex items-center justify-center cursor-pointer hover:scale-110 transition">

                  <Camera className="w-5 h-5" />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      handleUpload
                    }
                    hidden
                  />

                </label>

              </div>

              <p className="text-sm text-blue-100 mt-5">
                Upload business logo
              </p>

            </div>

          </div>

        </div>

        {/* PROFILE FORM */}

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[2rem] p-6 md:p-8 shadow-sm">

          <div className="flex items-center gap-3 mb-8">

            <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">

              <Building2 className="w-7 h-7 text-blue-600 dark:text-blue-400" />

            </div>

            <div>

              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Business Information
              </h2>

              <p className="text-gray-500 dark:text-slate-400 mt-1">
                Update your business identity and account details
              </p>

            </div>

          </div>

          <div className="space-y-6">

            {/* BUSINESS NAME */}

            <div>

              <label className="text-sm font-semibold text-gray-600 dark:text-slate-300">
                Business Name
              </label>

              <div className="relative mt-2">

                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="text"
                  value={
                    businessName
                  }
                  onChange={(e) =>
                    setBusinessName(
                      e.target.value
                    )
                  }
                  placeholder="My Business"
                  className="w-full rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-950 pl-12 pr-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white placeholder:text-gray-400"
                />

              </div>

            </div>

            {/* EMAIL */}

            <div>

              <label className="text-sm font-semibold text-gray-600 dark:text-slate-300">
                Email Address
              </label>

              <div className="relative mt-2">

                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <div className="w-full rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-950 pl-12 pr-5 py-4 text-gray-700 dark:text-slate-300">

                  {email}

                </div>

              </div>

            </div>

            {/* SAVE BUTTON */}

            <button
              onClick={
                handleSave
              }
              disabled={
                loading
              }
              className="w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 hover:opacity-95 text-white rounded-2xl py-4 font-semibold shadow-lg transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-3"
            >

              <Save size={18} />

              {loading
                ? "Saving..."
                : "Save Changes"}

            </button>

          </div>

        </div>

        {/* LOGOUT CARD */}

        <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/40 rounded-[2rem] p-6 shadow-sm">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Logout Session
              </h2>

              <p className="text-gray-500 dark:text-slate-400 mt-1">
                Securely sign out from your business dashboard
              </p>

            </div>

            <button
              onClick={
                handleLogout
              }
              className="bg-red-500 hover:bg-red-600 text-white rounded-2xl px-6 py-4 font-semibold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 shadow-lg"
            >

              <LogOut size={18} />

              Logout

            </button>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}