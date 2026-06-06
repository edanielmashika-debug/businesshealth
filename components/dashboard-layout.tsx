"use client";

import Link from "next/link";

import {
    usePathname,
} from "next/navigation";



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
} from "lucide-react";

import {
    useState, useEffect
} from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [open, setOpen] =
        useState(false);

    const pathname =
        usePathname();

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
            name: "Settings",
            href: "/settings",
            icon: Settings,
        },

        {
            name: "Expenses",
            href: "/expenses",
            icon: BadgeDollarSignIcon
        },

        {
            name: "Reports",
            href: "/reports",
            icon: FileText,
        },
    ];


    const [logoUrl, setLogoUrl] =
        useState("");



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
                    data.business_name || ""
                );
            }
        }

        loadProfile();

    }, []);

    const [businessName, setBusinessName,] = useState("");



    return (
        <div className="flex min-h-screen bg-[#f5f7fb] dark:bg-[#0f172a]">

            {/* MOBILE BUTTON */}

            <button
                onClick={() =>
                    setOpen(!open)
                }
                className="fixed top-4 left-4 z-50 bg-black text-white p-2 rounded-xl lg:hidden"
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
        h-screen w-72 bg-white dark:bg-slate-900
        border-r
        transition-transform
        duration-300
        flex flex-col

        ${open
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }

        lg:translate-x-0
      `}
            >
                {/* LOGO */}

                <div className="p-6 border-b">
                    <h1 className="text-2xl font-bold">
                        Biashara Nova.
                    </h1>

                    <p className="text-sm text-gray-500 dark:text-slate-400">
                        Enterprise Dashboard
                    </p>
                </div>
                
                <div>

                </div>

                {/* LINKS */}

                <nav className="flex-1 px-3 space-y-2 overflow-y-auto">
                    {links.map(
                        (link) => {
                            const Icon =
                                link.icon;

                            return (
                                <Link
                                    key={
                                        link.href
                                    }
                                    href={
                                        link.href
                                    }
                                    className={`
flex items-center gap-3 px-4 py-3 rounded-xl transition

${pathname === link.href
                                            ? "bg-blue-50 text-blue-600 font-semibold"
                                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                        }
`}
                                >
                                    <Icon
                                        size={20}
                                    />

                                    <span>
                                        {link.name}
                                    </span>
                                </Link>
                            );
                        }
                    )}
                </nav>

                {/* PROFILE */}

                <div className="border-t p-4">
                    <Link href="/profile">
                        <div className="flex items-center gap-3">
                            <Link href="/profile">

                                <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center">

                                    {logoUrl ? (

                                        <img
                                            src={logoUrl}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />

                                    ) : (

                                        <span className="text-white font-bold">
                                            {businessName
                                                ?.charAt(0)
                                                ?.toUpperCase() || "B"}
                                        </span>

                                    )}

                                </div>

                            </Link>

                            <div>

                                <div className="font-semibold text-gray-800 dark:text-white">
                                    {businessName || "My Business"}
                                </div>



                                <div className="text-sm text-gray-500">
                                    Admin
                                </div>
                            </div>
                        </div>
                    </Link>

                    <button className="mt-4 w-full border rounded-xl py-3 text-red-500 hover:bg-red-50 transition">
                        Logout
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}

            <main className="flex-1 lg:ml-72">

                {/* TOP HEADER */}

                <header className="h-20 bg-white dark:bg-slate-900 border-b dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30">

                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                            Dashboard
                        </h1>

                        <p className="text-sm text-gray-500 dark:text-slate-400">
                            Welcome back, Emmanuel 👋
                        </p>
                    </div>

                    <div className="flex items-center gap-4">

                        {/* NOTIFICATION */}

                        <button className="relative p-3 rounded-xl border hover:bg-gray-50 transition">
                            🔔

                            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                        </button>

                        {/* PROFILE */}

                        <div className="flex items-center gap-3">
                            <Link href="/profile">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center">

                                    {logoUrl ? (

                                        <img
                                            src={logoUrl}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />

                                    ) : (

                                        <span className="text-white font-bold">
                                            {businessName
                                                ?.charAt(0)
                                                ?.toUpperCase() || "B"}
                                        </span>

                                    )}

                                </div>
                            </Link>

                            <div className="hidden md:block">
                                <div className="font-semibold text-sm">
                                    Emmanuel
                                </div>

                                <div className="text-xs text-gray-500 dark:text-slate-400">
                                    Administrator
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* PAGE CONTENT */}

                <div className="p-6">
                    {children}
                </div>

            </main>
        </div>
    );
}