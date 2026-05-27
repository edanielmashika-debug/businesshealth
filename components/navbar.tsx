"use client"
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { deleteAccountData } from "@/services/account-service";
import { Trash2 } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  async function handleLogOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function handleDeleteAccount() {
    const confirmed =
      confirm(
        "Are you sure you want to delete your account data?"
      );

    if (!confirmed) {
      return;
    }

    await deleteAccountData();

    router.push("/login");
  }
  return (
    <header className="border-b p-4 flex items-center justify-between">
      <div>
        <h2 className="font-semibold text-lg">
          Welcome Back 👋
        </h2>
      </div>
  
   
      <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
        A
        
      </div>

      <div>
         <button
          onClick={handleDeleteAccount}
          className="flex items-center gap-2 text-red-600"
        >
          <Trash2 size={18} />

          
        </button>
      </div>
    </header>
  );
}