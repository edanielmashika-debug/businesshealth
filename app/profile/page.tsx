"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import DashboardLayout from "../../components/dashboard-layout";

import { supabase } from "../../lib/supabase";

import {
  Camera,
  LogOut,
  Save,
} from "lucide-react";

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

        

      /* IF PROFILE DOESN'T EXIST */

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
        .upsert({
          id: user.id,

          business_name:
            businessName,

          logo_url:
            logoUrl,
        });

    if (error) {

      console.log(error);

      alert(
        error.message
      );
    } else {

      alert(
        "Profile updated"
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
        `${user.id}.${ext}`;

      await supabase.storage
        .from("profiles")
        .remove([
          fileName,
        ]);

      const {
        error:
          uploadError,
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

        alert(
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
        .upsert({
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

      <div className="max-w-3xl mx-auto space-y-8">

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

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">

          <div className="flex flex-col items-center">

            {/* IMAGE */}

            <div className="relative">

              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">

                {logoUrl ? (

                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />

                ) : (

                  <span className="text-white text-4xl font-bold">
                    {businessName
                      ?.charAt(0)
                      ?.toUpperCase() || "B"}
                  </span>

                )}

              </div>

              <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full cursor-pointer shadow-lg transition">

                <Camera size={18} />

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

            {/* FORM */}

            <div className="w-full mt-8 space-y-5">

              <div>

                <label className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Business Name
                </label>

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
                  className="w-full mt-2 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-950 px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white"
                />

              </div>

              <div>

                <label className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Email Address
                </label>

                <div className="w-full mt-2 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-950 px-5 py-4 text-gray-600 dark:text-slate-300">
                  {email}
                </div>

              </div>

              <button
                onClick={
                  handleSave
                }
                disabled={
                  loading
                }
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl py-4 font-semibold shadow-lg hover:scale-[1.01] transition flex items-center justify-center gap-2"
              >

                <Save size={18} />

                {loading
                  ? "Saving..."
                  : "Save Changes"}

              </button>

            </div>

          </div>

        </div>

        {/* LOGOUT */}

        <button
          onClick={
            handleLogout
          }
          className="w-full bg-red-500 hover:bg-red-600 text-white rounded-2xl py-4 font-semibold transition flex items-center justify-center gap-2"
        >

          <LogOut size={18} />

          Logout

        </button>

      </div>

    </DashboardLayout>
  );
}

