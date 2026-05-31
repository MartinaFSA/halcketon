"use client";

import { useState } from "react";
import { supabase } from "@/lib/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const handleLogin = async () => {
    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "http://localhost:3000/dashboard",
      },
    });
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <input
        type="email"
        className="border p-2 w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="bg-black text-white p-2 mt-4 w-full"
      >
        Ingresar
      </button>
    </div>
  );
}