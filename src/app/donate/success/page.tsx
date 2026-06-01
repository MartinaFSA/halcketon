// MercadoPago redirects here after an approved payment, appending query params
// like ?payment_id=...&status=approved. searchParams is a Promise in Next 16.
export default async function DonateSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_id?: string; status?: string }>;
}) {
  const { payment_id, status } = await searchParams;

  return (
    <main className="mx-auto max-w-md p-8 text-center">
      <h1 className="mb-4 text-2xl font-semibold text-green-700">
        ¡Gracias por tu donación!
      </h1>
      <p className="mb-2 text-gray-700">
        Tu pago se acreditó correctamente. Tu aporte ayuda a sostener nuestra
        labor.
      </p>
      {payment_id && (
        <p className="text-sm text-gray-500">
          Número de operación: <span className="font-mono">{payment_id}</span>
          {status ? ` · ${status}` : null}
        </p>
      )}
      <a
        href="/"
        className="mt-6 inline-block rounded bg-green-700 px-4 py-2 text-white"
      >
        Volver al inicio
      </a>
    </main>
  );
}
