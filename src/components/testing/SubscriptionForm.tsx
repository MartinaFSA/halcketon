'use client'

export default function SubscriptionForm() {
  return (
    <div>
      <form action="/api/donate" method="POST">
        <h2>Hacé tu donación</h2>

        <label htmlFor="name">Nombre</label>
        <input type="text" id="name" name="name" required />

        <label htmlFor="email">Correo electrónico</label>
        <input type="email" id="email" name="email" required />

        <label htmlFor="amount">Monto a donar (ARS)</label>
        <input type="number" id="amount" name="amount" min="100" step="100" defaultValue="1000" required />

        <fieldset>
          <legend>Montos sugeridos</legend>
          <label>
            <input type="radio" name="preset" value="500" /> $500
          </label>
          <label>
            <input type="radio" name="preset" value="1000" /> $1000
          </label>
          <label>
            <input type="radio" name="preset" value="2000" /> $2000
          </label>
        </fieldset>

        <button type="submit">Donar</button>
      </form>
    </div>
  )
}
