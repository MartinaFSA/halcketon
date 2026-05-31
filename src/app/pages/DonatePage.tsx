"use client";

import { useState } from "react";

export default function DonatePage() {
  const [amount, setAmount] = useState("");

  return (
    <div className="max-w-md mx-auto">
      <input
        className="border p-2 w-full"
        placeholder="Monto"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white p-2 mt-4 w-full"
      >
        Donar
      </button>
    </div>
  );
}