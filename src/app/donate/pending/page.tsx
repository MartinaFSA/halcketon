// MercadoPago redirects here when a payment is pending (e.g. awaiting an
// offline/transfer confirmation).
export default async function DonatePendingPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_id?: string; status?: string }>;
}) {
  const { payment_id } = await searchParams;

  return (
    <main className="mx-auto max-w-md p-8 text-center">
      <h1 className="mb-4 text-2xl font-semibold text-yellow-700">
        Tu donación está pendiente
      </h1>
      <p className="mb-2 text-gray-700">
        Estamos esperando la confirmación del pago. Te avisaremos cuando se
        acredite.
      </p>
      {payment_id && (
        <p className="text-sm text-gray-500">
          Número de operación: <span className="font-mono">{payment_id}</span>
        </p>
      )}
      <a
        href="/"
        className="mt-6 inline-block rounded bg-yellow-600 px-4 py-2 text-white"
      >
        Volver al inicio
      </a>
    </main>
  );
}
