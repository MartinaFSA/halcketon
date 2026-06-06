/*
Nombre

Email

Teléfono

Fecha alta

Estado

Pagos realizados
*/
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserRole } from "../../lib/useUserRole";

export default function PerfilPage() {
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

    if (role !== "donor") {
      router.replace("/dashboard");
    }
  }, [loading, user, role, router]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!user || role !== "donor") {
    return <p>Redirigiendo...</p>;
  }

  return (
    <div>
      <h1>Perfil del donante</h1>
      <a href="/baja">Quiero darme de baja</a>
    </div>
  );
}