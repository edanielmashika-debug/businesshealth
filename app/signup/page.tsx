"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignUpPage() {
    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    async function handleSignup(
        e: React.FormEvent
    ) {
        e.preventDefault();

        const { error } =
            await supabase.auth.signUp({
                email,
                password,
            });
        if(error){
            alert(error.message);
            return;
        }

        alert(
            "Account created successfully!"
        );
    }
    return(
        <main className="min-h-screen flex items-center justify-center p-6">
            <form
              onSubmit={handleSignup}
              className="w-full max-w-md border rounded-2xl p-6 space-y-4"
            >
                <h1 className="text-3x1 font-bold">
                    Create Account
                </h1>

                <div>
                    <label>Email</label>

                    <input
                      type="email"
                      value={email}
                      onChange={(e)=> 
                        setEmail(e.target.value)
                      }
                      className="w-full border rounded-lg p-3 mt-1"
                    />
                </div>

                <div>
                    <label>Password</label>

                    <input
                      type="password"
                      value={password}
                      onChange={(e)=>
                        setPassword(e.target.value)
                      }
                      className="w-full border rounded-lg p-3 mt-1"
                      />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white rounded-lg py-3"
                  >
                    SignUp
                  </button>
            </form>
        </main>
    );
}