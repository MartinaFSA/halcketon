"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserRole } from "../../lib/useUserRole";

export default function DashboardPage() {
  const router = useRouter();

  const {
    user,
    role,
    loading,
  } = useUserRole();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (role !== "admin") {
      router.replace("/perfil");
    }
  }, [loading, user, role, router]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!user || role !== "admin") {
    return <p>Redirigiendo...</p>;
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="border p-4">
        <h2>Donantes</h2>
        <p>0</p>
      </div>

      <div className="border p-4">
        <h2>Ingresos mensuales</h2>
        <p>$0</p>
      </div>

      <div className="border p-4">
        <h2>Pagos rechazados</h2>
        <p>0</p>
      </div>
    </div>
  );
}