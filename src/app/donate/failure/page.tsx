// MercadoPago redirects here when a payment is rejected/cancelled.
export default async function DonateFailurePage({
  searchParams,
}: {
  searchParams: Promise<{ payment_id?: string; status?: string }>;
}) {
  const { status } = await searchParams;

  return (
    <main className="mx-auto max-w-md p-8 text-center">
      <h1 className="mb-4 text-2xl font-semibold text-red-700">
        No pudimos procesar tu donación
      </h1>
      <p className="mb-2 text-gray-700">
        El pago no se completó{status ? ` (${status})` : ""}. No se realizó
        ningún cargo. Podés intentarlo nuevamente.
      </p>
      <a
        href="/"
        className="mt-6 inline-block rounded bg-red-700 px-4 py-2 text-white"
      >
        Intentar de nuevo
      </a>
    </main>
  );
}
