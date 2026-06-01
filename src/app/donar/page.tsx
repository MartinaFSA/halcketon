"use client";

import { useState } from "react";
export default function DonatePage() {
  const [amount, setAmount] = useState("5000");

  console.log("TOKEN EXISTS",
    !!process.env.MP_PLAN_5000
  );

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  async function handleDonate() {
    const response = await fetch(
      "/api/mercadopago",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          planId: process.env.MP_PLAN_5000,
          amount,
        }),
      }
    );

    const data = await response.json();

    window.location.href =
      data.checkoutUrl;
  }

  return (
    <div className="max-w-md mx-auto">
      <input
        type="text"
        placeholder="Nombre"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Apellido"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <select
        className="border p-2 w-full"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      >
        <option value="3000">
          $3.000
        </option>

        <option value="5000">
          $5.000
        </option>

      </select>

      <button
        onClick={handleDonate}
        className="bg-blue-600 text-white p-2 mt-4 w-full"
      >
        Donar
      </button>
    </div>
  );
}