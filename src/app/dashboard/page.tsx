export default function DashboardPage() {
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