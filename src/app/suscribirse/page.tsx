"use client";

import { useState } from "react";
import { supabase } from "@/lib/client";

export default function DonorForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  async function saveDonor() {
    await supabase.from("donors").insert({
      first_name: firstName,
      last_name: lastName,
      email,
    });
  }

  return (
    <div className="space-y-4">
      <input
        className="border p-2 w-full"
        placeholder="Nombre"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        placeholder="Apellido"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={saveDonor}
        className="bg-black text-white p-2"
      >
        Guardar
      </button>
    </div>
  );
}