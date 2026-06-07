"use client";

import Link from "next/link";

import {
  usePathname,
} from "next/navigation";

import {
  useState,
  useEffect,
} from "react";

import { supabase } from "../lib/supabase";

import {
  Home,
  BarChart3,
  Package,
  Receipt,
  Wallet,
  Settings,
  Menu,
  X,
  BadgeDollarSignIcon,
  FileText,
  HandCoins,
  Bell,
  ChevronRight,
  Sparkles,
  LogOut,
} from "lucide-react";
import { Toaster } from "sonner";



export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [open, setOpen] =
    useState(false);

  const pathname =
    usePathname();

  const [logoUrl, setLogoUrl] =
    useState("");

  const [
    businessName,
    setBusinessName,
  ] = useState("");

  const links = [

    {
      name: "Home",
      href: "/",
      icon: Home,
    },

    {
      name: "Sales",
      href: "/sales",
      icon: Receipt,
    },

    {
      name: "Inventory",
      href: "/inventory",
      icon: Package,
    },

    {
      name: "Transactions",
      href: "/transactions",
      icon: Wallet,
    },

    {
      name: "Debts",
      href: "/debts",
      icon: HandCoins,
    },

    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
    },

    {
      name: "Expenses",
      href: "/expenses",
      icon:
        BadgeDollarSignIcon,
    },

    {
      name: "Reports",
      href: "/reports",
      icon: FileText,
    },

    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  useEffect(() => {

    async function loadProfile() {

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) return;

      const { data } =
        await supabase
          .from("profiles")
          .select("*")
          .eq(
            "id",
            user.id
          )
          .single();

      if (data) {

        setLogoUrl(
          data.logo_url || ""
        );

        setBusinessName(
          data.business_name ||
          ""
        );
      }
    }

    loadProfile();

  }, []);

  async function handleLogout() {

    await supabase.auth.signOut();

    window.location.href =
      "/login";
  }

  return (

    <div className="flex min-h-screen bg-[#f4f7fb] dark:bg-[#020617]">

      {/* MOBILE OVERLAY */}

      {open && (

        <div
          onClick={() =>
            setOpen(false)
          }
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
        />

      )}

      {/* MOBILE MENU BUTTON */}

      <button
        onClick={() =>
          setOpen(!open)
        }
        className="fixed top-5 left-5 z-50 lg:hidden w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xl flex items-center justify-center"
      >

        {open ? (
          <X size={20} />
        ) : (
          <Menu size={20} />
        )}

      </button>

      {/* SIDEBAR */}

      <aside
        className={`
fixed top-0 left-0 z-40
h-screen w-[290px]
bg-white/90 dark:bg-slate-950/95
backdrop-blur-xl
border-r border-gray-200 dark:border-slate-800
transition-transform duration-300
flex flex-col

${open
            ? "translate-x-0"
            : "-translate-x-full"
          }

lg:translate-x-0
`}
      >

        {/* LOGO */}

        <div className="p-6 border-b border-gray-200 dark:border-slate-800">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg">

              <Sparkles className="w-7 h-7 text-white" />

            </div>

            <div>

              <h1 className="text-2xl font-black text-gray-800 dark:text-white">
                Biashara Nova
              </h1>

              <p className="text-sm text-gray-500 dark:text-slate-400">
                Enterprise Dashboard
              </p>

            </div>

          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">

          {links.map(
            (link) => {

              const Icon =
                link.icon;

              const active =
                pathname ===
                link.href;

              return (

                <Link
                  key={
                    link.href
                  }
                  href={
                    link.href
                  }
                  onClick={() =>
                    setOpen(false)
                  }
                  className={`
group flex items-center justify-between
px-4 py-4 rounded-2xl
transition-all duration-300

${active
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
                      : "text-gray-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-900"
                    }
`}
                >

                  <div className="flex items-center gap-4">

                    <div
                      className={`
w-11 h-11 rounded-xl
flex items-center justify-center

${active
                          ? "bg-white/20"
                          : "bg-gray-100 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-slate-800"
                        }
`}
                    >

                      <Icon
                        size={
                          20
                        }
                      />

                    </div>

                    <span className="font-semibold">
                      {
                        link.name
                      }
                    </span>

                  </div>

                  {active && (

                    <ChevronRight className="w-5 h-5 opacity-80" />

                  )}

                </Link>
              );
            }
          )}

        </nav>

        {/* PROFILE */}

        <div className="border-t border-gray-200 dark:border-slate-800 p-5">

          <Link href="/profile">

            <div className="bg-gray-50 dark:bg-slate-900 rounded-3xl p-4 border border-gray-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300">

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">

                  {logoUrl ? (

                    <img
                      src={
                        logoUrl
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />

                  ) : (

                    <span className="text-white font-black text-xl">

                      {businessName
                        ?.charAt(
                          0
                        )
                        ?.toUpperCase() ||
                        "B"}

                    </span>

                  )}

                </div>

                <div className="flex-1">

                  <div className="font-bold text-gray-800 dark:text-white">

                    {businessName ||
                      "My Business"}

                  </div>

                  <div className="text-sm text-gray-500 dark:text-slate-400">
                    Administrator
                  </div>

                </div>

              </div>

            </div>

          </Link>

          {/* LOGOUT */}

          <button
            onClick={
              handleLogout
            }
            className="mt-4 w-full bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 rounded-2xl py-4 font-semibold transition-all duration-300 flex items-center justify-center gap-3"
          >

            <LogOut className="w-5 h-5" />

            Logout

          </button>

        </div>

      </aside>

      {/* MAIN */}

      <main className="flex-1 lg:ml-[290px] min-w-0">

        {/* TOP HEADER */}

        <header className="sticky top-0 z-30 h-24 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-800 px-6 md:px-8 flex items-center justify-between">

          {/* LEFT */}

          <div className="ml-14 lg:ml-0">

            <h1 className="text-2xl md:text-3xl font-black text-gray-800 dark:text-white">

              Dashboard

            </h1>

            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">

              Welcome back,
              {" "}
              <span className="font-semibold text-blue-600 dark:text-cyan-400">
                Emmanuel
              </span>
              {" "}
              👋

            </p>

          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-4">

            {/* NOTIFICATIONS */}

            <button className="relative w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 flex items-center justify-center hover:shadow-lg transition-all duration-300">

              <Bell className="w-5 h-5 text-gray-700 dark:text-slate-300" />

              <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-blue-500" />

            </button>

            {/* PROFILE */}

            <Link href="/profile">

              <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl px-3 py-2 hover:shadow-lg transition-all duration-300">

                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">

                  {logoUrl ? (

                    <img
                      src={
                        logoUrl
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />

                  ) : (

                    <span className="text-white font-black">

                      {businessName
                        ?.charAt(
                          0
                        )
                        ?.toUpperCase() ||
                        "B"}

                    </span>

                  )}

                </div>

                <div className="hidden md:block">

                  <div className="font-bold text-sm text-gray-800 dark:text-white">

                    {businessName ||
                      "My Business"}

                  </div>

                  <div className="text-xs text-gray-500 dark:text-slate-400">
                    Administrator
                  </div>

                </div>

              </div>

            </Link>

          </div>

        </header>

        {/* CONTENT */}

        <div className="p-5 md:p-8">

          {children}

          <Toaster
            richColors
            position="top-right"
            closeButton
            duration={3000}
          />

        </div>

      </main>

    </div>
  );
}